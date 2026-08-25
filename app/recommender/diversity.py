"""
Diversity and deduplication module for Orbo Beauty AI Recommendation System.

Implements:
- Brand diversity (avoid too many products from same brand)
- Category diversity (if not filtered to single category)
- Ingredient diversity (avoid nearly identical formulations)
- MMR (Maximal Marginal Relevance) for relevance-diversity tradeoff
"""

import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional, Set
import logging

logger = logging.getLogger(__name__)


def compute_brand_diversity_penalty(
    selected_indices: List[int],
    candidate_idx: int,
    df: pd.DataFrame,
    brand_weight: float = 0.3
) -> float:
    """Compute diversity penalty based on brand overlap."""
    if not selected_indices:
        return 0.0
    
    candidate_brand = df.iloc[candidate_idx]['brand']
    selected_brands = set(df.iloc[selected_indices]['brand'].tolist())
    
    if candidate_brand in selected_brands:
        return brand_weight
    return 0.0


def compute_ingredient_similarity(
    idx1: int,
    idx2: int,
    df: pd.DataFrame,
    method: str = 'jaccard'
) -> float:
    """Compute ingredient similarity between two products."""
    ing1 = df.iloc[idx1]['ingredients_normalized']
    ing2 = df.iloc[idx2]['ingredients_normalized']
    
    if not isinstance(ing1, list) or not isinstance(ing2, list):
        return 0.0
    
    if not ing1 or not ing2:
        return 0.0
    
    set1 = set(str(i).lower() for i in ing1)
    set2 = set(str(i).lower() for i in ing2)
    
    if method == 'jaccard':
        intersection = len(set1 & set2)
        union = len(set1 | set2)
        return intersection / union if union > 0 else 0.0
    elif method == 'overlap':
        # Overlap coefficient
        intersection = len(set1 & set2)
        min_size = min(len(set1), len(set2))
        return intersection / min_size if min_size > 0 else 0.0
    
    return 0.0


def compute_category_diversity_penalty(
    selected_indices: List[int],
    candidate_idx: int,
    df: pd.DataFrame,
    category_weight: float = 0.2
) -> float:
    """Compute diversity penalty based on category overlap."""
    if not selected_indices:
        return 0.0
    
    candidate_cat = df.iloc[candidate_idx]['category']
    selected_cats = set(df.iloc[selected_indices]['category'].tolist())
    
    if candidate_cat in selected_cats:
        return category_weight
    return 0.0


def mmr_select(
    candidates_df: pd.DataFrame,
    relevance_scores: np.ndarray,
    top_k: int,
    lambda_param: float = 0.7,
    brand_weight: float = 0.3,
    ingredient_weight: float = 0.4,
    category_weight: float = 0.2,
    ingredient_threshold: float = 0.7
) -> List[int]:
    """
    Maximal Marginal Relevance (MMR) selection for diversity.
    
    Args:
        candidates_df: DataFrame of candidate products
        relevance_scores: Relevance scores for each candidate (aligned with df index)
        top_k: Number of products to select
        lambda_param: Tradeoff between relevance (1.0) and diversity (0.0)
        brand_weight: Penalty weight for same brand
        ingredient_weight: Penalty weight for ingredient similarity
        category_weight: Penalty weight for same category
        ingredient_threshold: Threshold above which ingredients are considered too similar
    
    Returns:
        List of selected indices (relative to candidates_df)
    """
    n_candidates = len(candidates_df)
    if n_candidates == 0:
        return []
    
    top_k = min(top_k, n_candidates)
    
    # Initialize with highest relevance
    selected = [np.argmax(relevance_scores)]
    remaining = set(range(n_candidates)) - {selected[0]}
    
    for _ in range(top_k - 1):
        if not remaining:
            break
        
        best_mmr = -np.inf
        best_idx = None
        
        for idx in remaining:
            relevance = relevance_scores[idx]
            
            # Compute diversity penalty
            brand_penalty = compute_brand_diversity_penalty(selected, idx, candidates_df, brand_weight)
            cat_penalty = compute_category_diversity_penalty(selected, idx, candidates_df, category_weight)
            
            # Ingredient similarity penalty (max over selected)
            max_ing_sim = 0.0
            for sel_idx in selected:
                sim = compute_ingredient_similarity(idx, sel_idx, candidates_df)
                max_ing_sim = max(max_ing_sim, sim)
            
            ing_penalty = ingredient_weight if max_ing_sim > ingredient_threshold else 0.0
            
            total_penalty = brand_penalty + cat_penalty + ing_penalty
            
            # MMR score
            mmr_score = lambda_param * relevance - (1 - lambda_param) * total_penalty
            
            if mmr_score > best_mmr:
                best_mmr = mmr_score
                best_idx = idx
        
        if best_idx is not None:
            selected.append(best_idx)
            remaining.remove(best_idx)
    
    return selected


def apply_diversity(
    ranked_df: pd.DataFrame,
    score_column: str = '_hybrid_score',
    top_k: int = 10,
    lambda_param: float = 0.7,
    brand_weight: float = 0.3,
    ingredient_weight: float = 0.4,
    category_weight: float = 0.2,
    ingredient_threshold: float = 0.7
) -> pd.DataFrame:
    """
    Apply diversity to ranked results using MMR.
    
    Returns top-k diverse products.
    """
    if len(ranked_df) == 0:
        return ranked_df
    
    # Get relevance scores
    relevance_scores = ranked_df[score_column].values
    
    # Apply MMR
    selected_indices = mmr_select(
        ranked_df,
        relevance_scores,
        top_k=top_k,
        lambda_param=lambda_param,
        brand_weight=brand_weight,
        ingredient_weight=ingredient_weight,
        category_weight=category_weight,
        ingredient_threshold=ingredient_threshold
    )
    
    # Return selected products in MMR order
    diverse_results = ranked_df.iloc[selected_indices].copy().reset_index(drop=True)
    diverse_results['_mmr_rank'] = range(1, len(diverse_results) + 1)
    
    logger.info(f"Diversity applied: {len(ranked_df)} -> {len(diverse_results)} products")
    logger.info(f"Selected brands: {diverse_results['brand'].tolist()}")
    
    return diverse_results


def simple_deduplicate(
    ranked_df: pd.DataFrame,
    score_column: str = '_hybrid_score',
    top_k: int = 10,
    max_per_brand: int = 2,
    max_per_category: int = 3
) -> pd.DataFrame:
    """
    Simple deduplication: limit products per brand and category.
    
    Alternative to MMR for simpler diversity control.
    """
    if len(ranked_df) == 0:
        return ranked_df
    
    selected = []
    brand_counts = {}
    category_counts = {}
    
    for idx, row in ranked_df.iterrows():
        brand = row['brand']
        category = row['category']
        
        brand_count = brand_counts.get(brand, 0)
        cat_count = category_counts.get(category, 0)
        
        if brand_count < max_per_brand and cat_count < max_per_category:
            selected.append(idx)
            brand_counts[brand] = brand_count + 1
            category_counts[category] = cat_count + 1
            
            if len(selected) >= top_k:
                break
    
    return ranked_df.loc[selected].copy().reset_index(drop=True)