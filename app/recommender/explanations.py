"""
Explanation generation module for Orbo Beauty AI Recommendation System.

Generates human-readable explanations for why products were recommended
based on actual matched features.
"""

import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)


def generate_match_reasons(
    row: pd.Series,
    user_skin_type: Optional[str] = None,
    user_concerns: Optional[List[str]] = None,
    user_category: Optional[str] = None,
    user_budget: Optional[float] = None,
    preferred_ingredients: Optional[List[str]] = None,
    avoid_ingredients: Optional[List[str]] = None,
    content_score: Optional[float] = None
) -> List[str]:
    """
    Generate explanation reasons for a recommended product.
    
    Only includes reasons that are actually supported by the data.
    """
    reasons = []
    
    # Skin type match
    if user_skin_type:
        skin_types = row['skin_types'] if isinstance(row['skin_types'], list) else []
        if user_skin_type.lower() in [s.lower() for s in skin_types]:
            reasons.append(f"Matches your {user_skin_type} skin type")
        elif 'all' in [s.lower() for s in skin_types]:
            reasons.append(f"Suitable for all skin types (including {user_skin_type})")
    
    # Concern matches
    if user_concerns:
        product_concerns = row['skin_concerns'] if isinstance(row['skin_concerns'], list) else []
        matched_concerns = [c for c in user_concerns if c.lower() in [pc.lower() for pc in product_concerns]]
        for concern in matched_concerns:
            reasons.append(f"Addresses your {concern} concern")
    
    # Category match
    if user_category and row['category'] == user_category.lower():
        reasons.append(f"Matches your requested {user_category} category")
    
    # Budget match
    if user_budget is not None:
        price = row['price_usd']
        if pd.notna(price) and price <= user_budget:
            if price <= user_budget * 0.5:
                reasons.append(f"Well within your budget (${price:.0f} vs ${user_budget:.0f})")
            elif price <= user_budget * 0.8:
                reasons.append(f"Within your budget (${price:.0f} vs ${user_budget:.0f})")
            else:
                reasons.append(f"Fits your budget (${price:.0f} vs ${user_budget:.0f})")
    
    # Preferred ingredients
    if preferred_ingredients:
        ingredients = row['ingredients_normalized'] if isinstance(row['ingredients_normalized'], list) else []
        ing_lower = [str(i).lower() for i in ingredients]
        matched_ingredients = [ing for ing in preferred_ingredients if ing.lower() in ing_lower]
        if matched_ingredients:
            if len(matched_ingredients) == 1:
                reasons.append(f"Contains your preferred ingredient: {matched_ingredients[0]}")
            else:
                reasons.append(f"Contains preferred ingredients: {', '.join(matched_ingredients[:3])}")
    
    # Avoided ingredients (confirmation of absence)
    if avoid_ingredients:
        ingredients = row['ingredients_normalized'] if isinstance(row['ingredients_normalized'], list) else []
        ing_lower = [str(i).lower() for i in ingredients]
        avoided_found = [ing for ing in avoid_ingredients if ing.lower() in ing_lower]
        if not avoided_found:
            reasons.append(f"Free from your avoided ingredients")
    
    # High rating
    rating = row['rating']
    if pd.notna(rating) and rating >= 4.5:
        reasons.append(f"Highly rated ({rating:.1f}/5.0)")
    elif pd.notna(rating) and rating >= 4.0:
        reasons.append(f"Well rated ({rating:.1f}/5.0)")
    
    # Popularity
    review_count = row['review_count']
    if pd.notna(review_count) and review_count >= 1000:
        reasons.append(f"Popular choice ({int(review_count):,} reviews)")
    elif pd.notna(review_count) and review_count >= 100:
        reasons.append(f"Well reviewed ({int(review_count):,} reviews)")
    
    # Content similarity (if available)
    if content_score is not None and content_score > 0.5:
        reasons.append(f"Strong ingredient profile match ({content_score:.0%} similarity)")
    
    # Brand reputation (for known brands)
    known_quality_brands = ['cerave', 'la roche-posay', 'vichy', 'avene', 'eucerin', 
                           'skinceuticals', 'paulas choice', 'the ordinary', 'cetaphil']
    if row['brand'].lower() in known_quality_brands:
        reasons.append(f"From trusted brand: {row['brand']}")
    
    return reasons


def generate_warnings(
    row: pd.Series,
    user_skin_type: Optional[str] = None,
    user_concerns: Optional[List[str]] = None,
    user_budget: Optional[float] = None,
    avoid_ingredients: Optional[List[str]] = None
) -> List[str]:
    """Generate warnings or limitations for a recommended product."""
    warnings = []
    
    # Budget warning
    if user_budget is not None:
        price = row['price_usd']
        if pd.notna(price) and price > user_budget:
            overage = ((price - user_budget) / user_budget) * 100
            warnings.append(f"Exceeds budget by {overage:.0f}% (${price:.0f} vs ${user_budget:.0f})")
        elif pd.notna(price) and price > user_budget * 0.9:
            warnings.append(f"Near top of budget (${price:.0f} vs ${user_budget:.0f})")
    
    # Skin type mismatch
    if user_skin_type:
        skin_types = row['skin_types'] if isinstance(row['skin_types'], list) else []
        if user_skin_type.lower() not in [s.lower() for s in skin_types] and 'all' not in [s.lower() for s in skin_types]:
            warnings.append(f"Not specifically formulated for {user_skin_type} skin")
    
    # Missing concerns
    if user_concerns:
        product_concerns = row['skin_concerns'] if isinstance(row['skin_concerns'], list) else []
        unmatched = [c for c in user_concerns if c.lower() not in [pc.lower() for pc in product_concerns]]
        if unmatched and len(unmatched) == len(user_concerns):
            warnings.append(f"May not address your primary concerns: {', '.join(unmatched)}")
        elif unmatched:
            warnings.append(f"Does not address: {', '.join(unmatched)}")
    
    # Avoided ingredients present
    if avoid_ingredients:
        ingredients = row['ingredients_normalized'] if isinstance(row['ingredients_normalized'], list) else []
        ing_lower = [str(i).lower() for i in ingredients]
        avoided_found = [ing for ing in avoid_ingredients if ing.lower() in ing_lower]
        if avoided_found:
            warnings.append(f"Contains avoided ingredient(s): {', '.join(avoided_found)}")
    
    # Low rating
    rating = row['rating']
    if pd.notna(rating) and rating < 3.5:
        warnings.append(f"Lower rated product ({rating:.1f}/5.0)")
    
    # Fragrance warning for sensitive skin
    if user_skin_type == 'sensitive':
        ingredients = row['ingredients_normalized'] if isinstance(row['ingredients_normalized'], list) else []
        ing_lower = [str(i).lower() for i in ingredients]
        if any('fragrance' in i or 'parfum' in i for i in ing_lower):
            warnings.append("Contains fragrance - may irritate sensitive skin")
    
    # Alcohol warning for dry/sensitive skin
    if user_skin_type in ['dry', 'sensitive']:
        ingredients = row['ingredients_normalized'] if isinstance(row['ingredients_normalized'], list) else []
        ing_lower = [str(i).lower() for i in ingredients]
        drying_alcohols = ['alcohol denat', 'sd alcohol', 'denatured alcohol', 'ethanol', 'isopropyl alcohol']
        if any(alc in ' '.join(ing_lower) for alc in drying_alcohols):
            warnings.append("Contains drying alcohol - may not suit dry/sensitive skin")
    
    return warnings


def generate_explanation(
    row: pd.Series,
    user_profile: Dict[str, Any],
    content_score: Optional[float] = None,
    score_breakdown: Optional[Dict[str, float]] = None
) -> Dict[str, Any]:
    """
    Generate complete explanation object for a recommendation.
    """
    reasons = generate_match_reasons(
        row,
        user_skin_type=user_profile.get('skin_type'),
        user_concerns=user_profile.get('concerns'),
        user_category=user_profile.get('category'),
        user_budget=user_profile.get('budget'),
        preferred_ingredients=user_profile.get('preferred_ingredients'),
        avoid_ingredients=user_profile.get('avoid_ingredients'),
        content_score=content_score
    )
    
    warnings = generate_warnings(
        row,
        user_skin_type=user_profile.get('skin_type'),
        user_concerns=user_profile.get('concerns'),
        user_budget=user_profile.get('budget'),
        avoid_ingredients=user_profile.get('avoid_ingredients')
    )
    
    # Matching attributes summary
    matching_attrs = {}
    if user_profile.get('skin_type'):
        skin_types = row['skin_types'] if isinstance(row['skin_types'], list) else []
        matching_attrs['skin_type'] = user_profile['skin_type'].lower() in [s.lower() for s in skin_types] or 'all' in [s.lower() for s in skin_types]
    
    if user_profile.get('concerns'):
        product_concerns = row['skin_concerns'] if isinstance(row['skin_concerns'], list) else []
        matched = [c for c in user_profile['concerns'] if c.lower() in [pc.lower() for pc in product_concerns]]
        matching_attrs['concerns_matched'] = matched
        matching_attrs['concerns_total'] = user_profile['concerns']
    
    if user_profile.get('category'):
        matching_attrs['category'] = row['category'] == user_profile['category'].lower()
    
    if user_profile.get('budget') is not None:
        price = row['price_usd']
        matching_attrs['budget'] = pd.notna(price) and price <= user_profile['budget']
    
    if user_profile.get('preferred_ingredients'):
        ingredients = row['ingredients_normalized'] if isinstance(row['ingredients_normalized'], list) else []
        ing_lower = [str(i).lower() for i in ingredients]
        matched = [ing for ing in user_profile['preferred_ingredients'] if ing.lower() in ing_lower]
        matching_attrs['preferred_ingredients_matched'] = matched
        matching_attrs['preferred_ingredients_total'] = user_profile['preferred_ingredients']
    
    explanation = {
        'reasons': reasons,
        'warnings': warnings,
        'matching_attributes': matching_attrs,
        'score_breakdown': score_breakdown or {}
    }
    
    return explanation


def format_explanation_for_ui(explanation: Dict[str, Any]) -> str:
    """Format explanation for UI display."""
    lines = []
    
    if explanation['reasons']:
        lines.append("Why recommended:")
        for reason in explanation['reasons']:
            lines.append(f"  ✓ {reason}")
    
    if explanation['warnings']:
        lines.append("Notes:")
        for warning in explanation['warnings']:
            lines.append(f"  ⚠ {warning}")
    
    if explanation['score_breakdown']:
        lines.append("Score breakdown:")
        for key, value in explanation['score_breakdown'].items():
            lines.append(f"  {key}: {value:.0%}")
    
    return '\n'.join(lines)