"""
Hybrid ranking module for Orbo Beauty AI Recommendation System.

Combines:
- Preference matching scores (skin type, concerns, ingredients, category, budget, rating)
- Content similarity scores (TF-IDF cosine similarity)
- Quality signals
"""

import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
import logging

logger = logging.getLogger(__name__)


# Default weights (can be tuned based on evaluation)
DEFAULT_WEIGHTS = {
    'preference': {
        'skin_type': 0.25,
        'concern': 0.25,
        'ingredient': 0.15,
        'category': 0.10,
        'budget': 0.10,
        'rating': 0.10,
        'popularity': 0.05
    },
    'hybrid': {
        'preference': 0.60,
        'content': 0.40
    }
}


def normalize_series(series: pd.Series, method: str = 'minmax') -> pd.Series:
    """Normalize a series to [0, 1] range."""
    if series.isna().all() or series.nunique() <= 1:
        return pd.Series(0.5, index=series.index)
    
    if method == 'minmax':
        min_val = series.min()
        max_val = series.max()
        if max_val == min_val:
            return pd.Series(0.5, index=series.index)
        return (series - min_val) / (max_val - min_val)
    elif method == 'zscore':
        mean = series.mean()
        std = series.std()
        if std == 0:
            return pd.Series(0.5, index=series.index)
        normalized = (series - mean) / std
        # Clip to [-3, 3] and rescale to [0, 1]
        normalized = normalized.clip(-3, 3)
        return (normalized + 3) / 6
    else:
        return series


def compute_skin_type_score(df: pd.DataFrame, user_skin_type: Optional[str]) -> pd.Series:
    """Compute skin type match score (0-1)."""
    if user_skin_type is None:
        return pd.Series(0.5, index=df.index)
    
    user_skin_type = user_skin_type.lower()
    
    def score(row):
        skin_types = row['skin_types'] if isinstance(row['skin_types'], list) else []
        if user_skin_type in skin_types:
            return 1.0
        elif 'all' in skin_types:
            return 0.8
        else:
            return 0.0
    
    return df.apply(score, axis=1)


def compute_concern_score(df: pd.DataFrame, user_concerns: Optional[List[str]]) -> pd.Series:
    """Compute concern match score (0-1) based on overlap."""
    if not user_concerns:
        return pd.Series(0.5, index=df.index)
    
    user_concerns = [c.lower() for c in user_concerns]
    
    def score(row):
        product_concerns = row['skin_concerns'] if isinstance(row['skin_concerns'], list) else []
        if not product_concerns:
            return 0.0
        matches = sum(1 for c in user_concerns if c in product_concerns)
        return min(matches / len(user_concerns), 1.0)
    
    return df.apply(score, axis=1)


def compute_ingredient_score(df: pd.DataFrame, preferred_ingredients: Optional[List[str]]) -> pd.Series:
    """Compute preferred ingredient match score (0-1)."""
    if not preferred_ingredients:
        return pd.Series(0.5, index=df.index)
    
    preferred_lower = [ing.lower() for ing in preferred_ingredients]
    
    def score(row):
        ingredients = row['ingredients_normalized'] if isinstance(row['ingredients_normalized'], list) else []
        if not ingredients:
            return 0.0
        ing_lower = [str(i).lower() for i in ingredients]
        matches = sum(1 for p in preferred_lower if p in ing_lower)
        return min(matches / len(preferred_lower), 1.0)
    
    return df.apply(score, axis=1)


def compute_category_score(df: pd.DataFrame, user_category: Optional[str]) -> pd.Series:
    """Compute category match score (0-1)."""
    if user_category is None:
        return pd.Series(0.5, index=df.index)
    
    user_category = user_category.lower()
    return (df['category'] == user_category).astype(float)


def compute_budget_score(df: pd.DataFrame, max_budget: Optional[float]) -> pd.Series:
    """Compute budget compatibility score (0-1)."""
    if max_budget is None:
        return pd.Series(0.5, index=df.index)
    
    def score(row):
        price = row['price_usd']
        if pd.isna(price):
            return 0.5
        if price <= max_budget:
            # Within budget - higher score for better value (not just cheapest)
            ratio = price / max_budget
            # Sweet spot around 50-80% of budget
            if ratio <= 0.5:
                return 0.8
            elif ratio <= 0.8:
                return 1.0
            elif ratio <= 1.0:
                return 0.9
            else:
                return 0.0
        else:
            # Over budget - penalize based on how much over
            over_ratio = price / max_budget
            if over_ratio <= 1.1:
                return 0.5
            elif over_ratio <= 1.25:
                return 0.25
            else:
                return 0.0
    
    return df.apply(score, axis=1)


def compute_rating_score(df: pd.DataFrame) -> pd.Series:
    """Compute normalized product rating score (0-1)."""
    return normalize_series(df['rating'], method='minmax')


def compute_popularity_score(df: pd.DataFrame) -> pd.Series:
    """Compute normalized review count/popularity score (0-1)."""
    return normalize_series(df['review_count'], method='minmax')


def compute_preference_score(
    df: pd.DataFrame,
    user_skin_type: Optional[str] = None,
    user_concerns: Optional[List[str]] = None,
    user_category: Optional[str] = None,
    user_budget: Optional[float] = None,
    preferred_ingredients: Optional[List[str]] = None,
    weights: Optional[Dict[str, float]] = None
) -> pd.Series:
    """
    Compute weighted preference score.
    
    Modifies the DataFrame in place to store component scores.
    
    Returns a Series with preference scores for each product.
    """
    if weights is None:
        weights = DEFAULT_WEIGHTS['preference']
    
    # Compute individual component scores
    skin_type_score = compute_skin_type_score(df, user_skin_type)
    concern_score = compute_concern_score(df, user_concerns)
    ingredient_score = compute_ingredient_score(df, preferred_ingredients)
    category_score = compute_category_score(df, user_category)
    budget_score = compute_budget_score(df, user_budget)
    rating_score = compute_rating_score(df)
    popularity_score = compute_popularity_score(df)
    
    # Weighted combination
    preference_score = (
        weights['skin_type'] * skin_type_score +
        weights['concern'] * concern_score +
        weights['ingredient'] * ingredient_score +
        weights['category'] * category_score +
        weights['budget'] * budget_score +
        weights['rating'] * rating_score +
        weights['popularity'] * popularity_score
    )
    
    # Store component scores for explainability
    df['_skin_type_score'] = skin_type_score
    df['_concern_score'] = concern_score
    df['_ingredient_score'] = ingredient_score
    df['_category_score'] = category_score
    df['_budget_score'] = budget_score
    df['_rating_score'] = rating_score
    df['_popularity_score'] = popularity_score
    df['_preference_score'] = preference_score
    
    return preference_score


def compute_hybrid_score(
    df: pd.DataFrame,
    content_similarities: pd.Series,
    preference_weights: Optional[Dict[str, float]] = None,
    hybrid_weights: Optional[Dict[str, float]] = None
) -> pd.Series:
    """
    Compute final hybrid score combining preference and content similarity.
    
    Args:
        df: DataFrame with preference score components
        content_similarities: Series of content similarity scores (0-1)
        preference_weights: Weights for preference components
        hybrid_weights: Weights for preference vs content
    
    Returns:
        Series of final hybrid scores
    """
    if preference_weights is None:
        preference_weights = DEFAULT_WEIGHTS['preference']
    if hybrid_weights is None:
        hybrid_weights = DEFAULT_WEIGHTS['hybrid']
    
    # Ensure content similarities are normalized
    content_norm = normalize_series(content_similarities, method='minmax')
    
    # Preference score (already computed and stored in df)
    preference_score = df['_preference_score'] if '_preference_score' in df.columns else pd.Series(0.5, index=df.index)
    
    # Hybrid combination
    hybrid_score = (
        hybrid_weights['preference'] * preference_score +
        hybrid_weights['content'] * content_norm
    )
    
    df['_content_score'] = content_norm
    df['_hybrid_score'] = hybrid_score
    
    return hybrid_score


def rank_products(
    df: pd.DataFrame,
    user_skin_type: Optional[str] = None,
    user_concerns: Optional[List[str]] = None,
    user_category: Optional[str] = None,
    user_budget: Optional[float] = None,
    preferred_ingredients: Optional[List[str]] = None,
    content_similarities: Optional[pd.Series] = None,
    preference_weights: Optional[Dict[str, float]] = None,
    hybrid_weights: Optional[Dict[str, float]] = None
) -> pd.DataFrame:
    """
    Rank products by hybrid score.
    
    Returns DataFrame sorted by score descending with all score components.
    """
    ranked = df.copy()
    
    # Compute preference score
    compute_preference_score(
        ranked,
        user_skin_type=user_skin_type,
        user_concerns=user_concerns,
        user_category=user_category,
        user_budget=user_budget,
        preferred_ingredients=preferred_ingredients,
        weights=preference_weights
    )
    
    # Compute hybrid score if content similarities provided
    if content_similarities is not None:
        # Align content similarities with ranked DataFrame
        content_aligned = content_similarities.reindex(ranked.index).fillna(0)
        compute_hybrid_score(
            ranked,
            content_aligned,
            preference_weights=preference_weights,
            hybrid_weights=hybrid_weights
        )
        score_col = '_hybrid_score'
    else:
        score_col = '_preference_score'
    
    # Sort by score descending
    ranked = ranked.sort_values(score_col, ascending=False).reset_index(drop=True)
    
    return ranked


def get_score_breakdown(row: pd.Series) -> Dict[str, float]:
    """Extract score breakdown for a product row."""
    breakdown = {}
    for col in ['_skin_type_score', '_concern_score', '_ingredient_score', 
                '_category_score', '_budget_score', '_rating_score', 
                '_popularity_score', '_content_score', '_preference_score', '_hybrid_score']:
        if col in row:
            breakdown[col.replace('_', '').replace('score', '')] = round(float(row[col]), 3)
    return breakdown