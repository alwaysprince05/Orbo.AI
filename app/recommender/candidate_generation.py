"""
Candidate generation and filtering module for Orbo Beauty AI Recommendation System.

Handles hard constraint filtering and candidate pool generation.
"""

import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
import logging

logger = logging.getLogger(__name__)

# Valid values from dataset
VALID_SKIN_TYPES = ['dry', 'oily', 'combination', 'normal', 'sensitive', 'all']
VALID_CATEGORIES = ['cleanser', 'moisturizer', 'serum', 'sunscreen', 'toner', 'exfoliator', 'mask', 'eye_care', 'lip_care', 'face_oil', 'body_oil', 'other']
VALID_CONCERNS = ['hydration', 'acne', 'aging', 'pigmentation', 'sensitivity', 'texture', 'sun_protection']


def filter_by_category(df: pd.DataFrame, category: Optional[str]) -> pd.DataFrame:
    """Filter products by category."""
    if category is None:
        return df
    category = category.lower().strip()
    return df[df['category'] == category].copy()


def filter_by_budget(df: pd.DataFrame, max_budget: Optional[float], min_budget: float = 0) -> pd.DataFrame:
    """Filter products by price range."""
    if max_budget is None:
        return df
    return df[(df['price_usd'] >= min_budget) & (df['price_usd'] <= max_budget)].copy()


def filter_by_avoid_ingredients(df: pd.DataFrame, avoid_ingredients: List[str]) -> pd.DataFrame:
    """Filter out products containing avoided ingredients."""
    if not avoid_ingredients:
        return df
    
    avoid_lower = [ing.lower().strip() for ing in avoid_ingredients]
    
    def has_avoided(ingredients):
        if not isinstance(ingredients, list):
            return False
        ing_lower = [str(i).lower() for i in ingredients]
        return any(avoid in ing_lower for avoid in avoid_lower)
    
    mask = ~df['ingredients_normalized'].apply(has_avoided)
    return df[mask].copy()


def filter_by_skin_type(df: pd.DataFrame, skin_type: Optional[str]) -> pd.DataFrame:
    """Filter products compatible with skin type."""
    if skin_type is None:
        return df
    
    skin_type = skin_type.lower().strip()
    if skin_type not in VALID_SKIN_TYPES:
        logger.warning(f"Unknown skin type: {skin_type}, skipping filter")
        return df
    
    def matches_skin_type(skin_types):
        if not isinstance(skin_types, list):
            return False
        # 'all' means suitable for all skin types
        return skin_type in skin_types or 'all' in skin_types
    
    mask = df['skin_types'].apply(matches_skin_type)
    return df[mask].copy()


def filter_by_concerns(df: pd.DataFrame, concerns: List[str]) -> pd.DataFrame:
    """Filter products that address at least one of the user's concerns."""
    if not concerns:
        return df
    
    concerns_lower = [c.lower().strip() for c in concerns]
    
    def matches_concern(skin_concerns):
        if not isinstance(skin_concerns, list):
            return False
        return any(c in skin_concerns for c in concerns_lower)
    
    mask = df['skin_concerns'].apply(matches_concern)
    return df[mask].copy()


def filter_by_preferred_ingredients(df: pd.DataFrame, preferred_ingredients: List[str]) -> pd.DataFrame:
    """Filter products containing at least one preferred ingredient."""
    if not preferred_ingredients:
        return df
    
    preferred_lower = [ing.lower().strip() for ing in preferred_ingredients]
    
    def has_preferred(ingredients):
        if not isinstance(ingredients, list):
            return False
        ing_lower = [str(i).lower() for i in ingredients]
        return any(pref in ing_lower for pref in preferred_lower)
    
    mask = df['ingredients_normalized'].apply(has_preferred)
    return df[mask].copy()


def apply_hard_filters(
    df: pd.DataFrame,
    skin_type: Optional[str] = None,
    concerns: Optional[List[str]] = None,
    category: Optional[str] = None,
    max_budget: Optional[float] = None,
    preferred_ingredients: Optional[List[str]] = None,
    avoid_ingredients: Optional[List[str]] = None
) -> Tuple[pd.DataFrame, Dict[str, int]]:
    """
    Apply hard constraint filters in order of strictness.
    Returns filtered DataFrame and filter statistics.
    """
    stats = {'initial': len(df)}
    filtered = df.copy()
    
    # 1. Category filter (hard constraint)
    if category:
        filtered = filter_by_category(filtered, category)
        stats['after_category'] = len(filtered)
    
    # 2. Budget filter (hard constraint)
    if max_budget is not None:
        filtered = filter_by_budget(filtered, max_budget)
        stats['after_budget'] = len(filtered)
    
    # 3. Avoid ingredients (hard constraint)
    if avoid_ingredients:
        filtered = filter_by_avoid_ingredients(filtered, avoid_ingredients)
        stats['after_avoid_ingredients'] = len(filtered)
    
    stats['final'] = len(filtered)
    return filtered, stats


def apply_soft_filters(
    df: pd.DataFrame,
    skin_type: Optional[str] = None,
    concerns: Optional[List[str]] = None,
    preferred_ingredients: Optional[List[str]] = None
) -> Tuple[pd.DataFrame, Dict[str, int]]:
    """
    Apply soft preference filters (used for ranking, not hard elimination).
    Returns DataFrame with match columns added and filter statistics.
    """
    stats = {'initial': len(df)}
    filtered = df.copy()
    
    # Add match indicator columns for ranking
    if skin_type:
        filtered['skin_type_match'] = filtered['skin_types'].apply(
            lambda x: skin_type.lower() in (x if isinstance(x, list) else []) or 'all' in (x if isinstance(x, list) else [])
        )
        stats['skin_type_matches'] = int(filtered['skin_type_match'].sum())
    
    if concerns:
        concerns_lower = [c.lower() for c in concerns]
        filtered['concern_match_count'] = filtered['skin_concerns'].apply(
            lambda x: sum(1 for c in concerns_lower if c in (x if isinstance(x, list) else []))
        )
        filtered['concern_match'] = filtered['concern_match_count'] > 0
        stats['concern_matches'] = int(filtered['concern_match'].sum())
    
    if preferred_ingredients:
        preferred_lower = [ing.lower() for ing in preferred_ingredients]
        filtered['preferred_ingredient_match_count'] = filtered['ingredients_normalized'].apply(
            lambda x: sum(1 for p in preferred_lower if p in [str(i).lower() for i in (x if isinstance(x, list) else [])])
        )
        filtered['preferred_ingredient_match'] = filtered['preferred_ingredient_match_count'] > 0
        stats['preferred_ingredient_matches'] = int(filtered['preferred_ingredient_match'].sum())
    
    stats['final'] = len(filtered)
    return filtered, stats


def get_candidate_pool(
    df: pd.DataFrame,
    skin_type: Optional[str] = None,
    concerns: Optional[List[str]] = None,
    category: Optional[str] = None,
    max_budget: Optional[float] = None,
    preferred_ingredients: Optional[List[str]] = None,
    avoid_ingredients: Optional[List[str]] = None,
    min_candidates: int = 10
) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Generate candidate pool with fallback strategy.
    
    Strategy:
    1. Apply all hard filters
    2. If insufficient candidates, relax constraints in order:
       - Relax budget (increase by 20%)
       - Relax category (remove category filter)
       - Relax preferred ingredients (make soft)
       - Use content similarity only
    """
    filter_info = {
        'hard_filters_applied': [],
        'soft_filters_applied': [],
        'fallbacks_used': [],
        'filter_stats': {}
    }
    
    # Step 1: Apply hard filters
    candidates, hard_stats = apply_hard_filters(
        df, skin_type, concerns, category, max_budget, 
        preferred_ingredients, avoid_ingredients
    )
    filter_info['filter_stats']['hard'] = hard_stats
    filter_info['hard_filters_applied'] = ['category', 'budget', 'avoid_ingredients']
    
    # Step 2: Apply soft filters (add match columns)
    candidates, soft_stats = apply_soft_filters(
        candidates, skin_type, concerns, preferred_ingredients
    )
    filter_info['filter_stats']['soft'] = soft_stats
    filter_info['soft_filters_applied'] = ['skin_type', 'concerns', 'preferred_ingredients']
    
    # Step 3: Fallback strategy if insufficient candidates
    original_budget = max_budget
    current_candidates = candidates
    
    if len(current_candidates) < min_candidates:
        # Fallback 1: Relax budget by 20%
        if max_budget is not None:
            relaxed_budget = max_budget * 1.2
            candidates_relaxed, _ = apply_hard_filters(
                df, skin_type, concerns, category, relaxed_budget, 
                preferred_ingredients, avoid_ingredients
            )
            candidates_relaxed, _ = apply_soft_filters(
                candidates_relaxed, skin_type, concerns, preferred_ingredients
            )
            if len(candidates_relaxed) > len(current_candidates):
                current_candidates = candidates_relaxed
                filter_info['fallbacks_used'].append(f'budget_relaxed_to_{relaxed_budget:.0f}')
                logger.info(f"Fallback: Relaxed budget to ${relaxed_budget:.0f}, candidates: {len(current_candidates)}")
    
    if len(current_candidates) < min_candidates:
        # Fallback 2: Remove category filter
        candidates_relaxed, _ = apply_hard_filters(
            df, skin_type, concerns, None, max_budget, 
            preferred_ingredients, avoid_ingredients
        )
        candidates_relaxed, _ = apply_soft_filters(
            candidates_relaxed, skin_type, concerns, preferred_ingredients
        )
        if len(candidates_relaxed) > len(current_candidates):
            current_candidates = candidates_relaxed
            filter_info['fallbacks_used'].append('category_removed')
            logger.info(f"Fallback: Removed category filter, candidates: {len(current_candidates)}")
    
    if len(current_candidates) < min_candidates:
        # Fallback 3: Make preferred ingredients soft (remove from hard filters)
        candidates_relaxed, _ = apply_hard_filters(
            df, skin_type, concerns, category, max_budget, 
            None, avoid_ingredients  # preferred_ingredients=None
        )
        candidates_relaxed, _ = apply_soft_filters(
            candidates_relaxed, skin_type, concerns, preferred_ingredients
        )
        if len(candidates_relaxed) > len(current_candidates):
            current_candidates = candidates_relaxed
            filter_info['fallbacks_used'].append('preferred_ingredients_soft')
            logger.info(f"Fallback: Made preferred ingredients soft, candidates: {len(current_candidates)}")
    
    if len(current_candidates) < min_candidates and len(current_candidates) > 0:
        # Fallback 4: Remove skin type filter (keep only budget and avoid)
        candidates_relaxed, _ = apply_hard_filters(
            df, None, concerns, category, max_budget, 
            None, avoid_ingredients
        )
        candidates_relaxed, _ = apply_soft_filters(
            candidates_relaxed, skin_type, concerns, preferred_ingredients
        )
        if len(candidates_relaxed) > len(current_candidates):
            current_candidates = candidates_relaxed
            filter_info['fallbacks_used'].append('skin_type_removed')
            logger.info(f"Fallback: Removed skin type filter, candidates: {len(current_candidates)}")
    
    filter_info['final_candidate_count'] = len(current_candidates)
    filter_info['is_fallback'] = len(filter_info['fallbacks_used']) > 0
    
    return current_candidates, filter_info