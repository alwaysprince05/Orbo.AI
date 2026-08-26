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
from typing import List
import logging

logger = logging.getLogger(__name__)


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

    brands = candidates_df['brand'].tolist()
    categories = candidates_df['category'].tolist()
    ingredient_sets = []
    for raw in candidates_df['ingredients_normalized'].tolist():
        if isinstance(raw, list) and raw:
            ingredient_sets.append({str(i).lower() for i in raw})
        else:
            ingredient_sets.append(set())

    selected = [int(np.argmax(relevance_scores))]
    remaining = set(range(n_candidates)) - {selected[0]}

    for _ in range(top_k - 1):
        if not remaining:
            break

        selected_brands = {brands[i] for i in selected}
        selected_categories = {categories[i] for i in selected}
        selected_ingredients = [ingredient_sets[i] for i in selected]

        best_mmr = -np.inf
        best_idx = None

        for idx in remaining:
            penalty = 0.0

            if brands[idx] in selected_brands:
                penalty += brand_weight
            if categories[idx] in selected_categories:
                penalty += category_weight

            candidate_ingredients = ingredient_sets[idx]
            if candidate_ingredients:
                max_similarity = 0.0
                for selected_ingredients_i in selected_ingredients:
                    if not selected_ingredients_i:
                        continue
                    intersection = len(candidate_ingredients & selected_ingredients_i)
                    union = len(candidate_ingredients) + len(selected_ingredients_i) - intersection
                    if union > 0:
                        similarity = intersection / union
                        if similarity > max_similarity:
                            max_similarity = similarity
                        if max_similarity > ingredient_threshold:
                            break
                if max_similarity > ingredient_threshold:
                    penalty += ingredient_weight

            mmr_score = (
                lambda_param * relevance_scores[idx]
                - (1 - lambda_param) * penalty
            )

            if mmr_score > best_mmr:
                best_mmr = mmr_score
                best_idx = idx

        if best_idx is None:
            break
        selected.append(best_idx)
        remaining.discard(best_idx)

    return selected


def apply_diversity(
    ranked_df: pd.DataFrame,
    score_column: str = '_hybrid_score',
    top_k: int = 10,
    lambda_param: float = 0.7,
    brand_weight: float = 0.3,
    ingredient_weight: float = 0.4,
    category_weight: float = 0.2,
    ingredient_threshold: float = 0.7,
    pool_size: int = 150
) -> pd.DataFrame:
    """
    Apply diversity to ranked results using MMR.

    MMR runs over only the top `pool_size` ranked candidates. Items ranked
    below the pool have negligible relevance at lambda=0.7 and would never
    surface, so pooling keeps selection quality while bounding latency.

    Returns top-k diverse products.
    """
    if len(ranked_df) == 0:
        return ranked_df

    pool = ranked_df.head(pool_size) if pool_size and len(ranked_df) > pool_size else ranked_df

    relevance_scores = pool[score_column].values

    selected_indices = mmr_select(
        pool,
        relevance_scores,
        top_k=top_k,
        lambda_param=lambda_param,
        brand_weight=brand_weight,
        ingredient_weight=ingredient_weight,
        category_weight=category_weight,
        ingredient_threshold=ingredient_threshold
    )

    diverse_results = pool.iloc[selected_indices].copy().reset_index(drop=True)
    diverse_results['_mmr_rank'] = range(1, len(diverse_results) + 1)

    logger.info(f"Diversity applied: {len(ranked_df)} -> {len(diverse_results)} products")

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
