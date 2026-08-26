"""
Main recommender engine for Orbo Beauty AI Recommendation System.

Orchestrates the full recommendation pipeline:
1. Candidate generation (hard filtering)
2. Content similarity (TF-IDF)
3. Preference scoring
4. Hybrid ranking
5. Diversity
6. Explanation generation
"""

import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
import logging
from pathlib import Path

def _to_list(val):
    """Convert numpy array or other iterable to list."""
    if val is None:
        return []
    if isinstance(val, np.ndarray):
        return val.tolist()
    if isinstance(val, list):
        return val
    try:
        return list(val)
    except (TypeError, ValueError):
        return []

from app.recommender.candidate_generation import (
    get_candidate_pool,
    apply_hard_filters,
    apply_soft_filters
)
from app.recommender.content_model import ContentModel, load_content_model
from app.recommender.ranking import (
    rank_products,
    compute_preference_score,
    compute_hybrid_score,
    DEFAULT_WEIGHTS
)
from app.recommender.diversity import apply_diversity, simple_deduplicate
from app.recommender.explanations import generate_explanation, format_explanation_for_ui

logger = logging.getLogger(__name__)


class BeautyRecommender:
    """Main recommendation engine for beauty products."""
    
    def __init__(
        self,
        products_df: pd.DataFrame,
        content_model: ContentModel,
        preference_weights: Optional[Dict[str, float]] = None,
        hybrid_weights: Optional[Dict[str, float]] = None,
        diversity_lambda: float = 0.7,
        diversity_top_k: int = 20
    ):
        self.products_df = products_df
        self.content_model = content_model
        self.preference_weights = preference_weights or DEFAULT_WEIGHTS['preference']
        self.hybrid_weights = hybrid_weights or DEFAULT_WEIGHTS['hybrid']
        self.diversity_lambda = diversity_lambda
        self.diversity_top_k = diversity_top_k
        
        # Create product ID to index mapping
        self.product_id_to_idx = {pid: idx for idx, pid in enumerate(products_df['product_id'])}
    
    def recommend(
        self,
        skin_type: Optional[str] = None,
        concerns: Optional[List[str]] = None,
        category: Optional[str] = None,
        budget: Optional[float] = None,
        preferred_ingredients: Optional[List[str]] = None,
        avoid_ingredients: Optional[List[str]] = None,
        top_k: int = 5,
        min_candidates: int = 20
    ) -> Dict[str, Any]:
        """
        Generate personalized recommendations.
        
        Returns dict with recommendations, filter info, and metadata.
        """
        user_profile = {
            'skin_type': skin_type,
            'concerns': concerns or [],
            'category': category,
            'budget': budget,
            'preferred_ingredients': preferred_ingredients or [],
            'avoid_ingredients': avoid_ingredients or []
        }
        
        logger.info(f"Generating recommendations for profile: {user_profile}")
        
        # Step 1: Candidate generation with fallback
        candidates, filter_info = get_candidate_pool(
            self.products_df,
            skin_type=skin_type,
            concerns=concerns,
            category=category,
            max_budget=budget,
            preferred_ingredients=preferred_ingredients,
            avoid_ingredients=avoid_ingredients,
            min_candidates=min_candidates
        )
        
        if len(candidates) == 0:
            logger.warning("No candidates found after all fallbacks")
            return {
                'recommendations': [],
                'filter_info': filter_info,
                'user_profile': user_profile,
                'total_candidates': 0,
                'is_fallback': False,
                'fallback_message': None,
                'message': 'No products match your criteria. Try relaxing your preferences.'
            }
        
        # Step 2: Content similarity
        user_profile_text = self.content_model.build_user_profile_text(
            skin_type=skin_type,
            concerns=concerns,
            category=category,
            preferred_ingredients=preferred_ingredients,
            avoid_ingredients=avoid_ingredients
        )
        user_vector = self.content_model.transform_user_profile(user_profile_text)
        
        # Get content similarities for candidates
        candidate_indices = [self.product_id_to_idx[pid] for pid in candidates['product_id']]
        _, content_scores = self.content_model.get_top_similar(
            user_vector,
            top_k=len(candidates),
            candidate_indices=candidate_indices
        )
        
        # Align content scores with candidates
        content_series = pd.Series(content_scores, index=candidates.index)
        
        # Step 3: Hybrid ranking
        ranked = rank_products(
            candidates,
            user_skin_type=skin_type,
            user_concerns=concerns,
            user_category=category,
            user_budget=budget,
            preferred_ingredients=preferred_ingredients,
            content_similarities=content_series,
            preference_weights=self.preference_weights,
            hybrid_weights=self.hybrid_weights
        )
        
        # Step 4: Diversity
        diverse = apply_diversity(
            ranked,
            score_column='_hybrid_score',
            top_k=self.diversity_top_k,
            lambda_param=self.diversity_lambda
        )
        
        # Step 5: Final top-k
        final = diverse.head(top_k).copy()
        
        # Step 6: Generate explanations
        recommendations = []
        for idx, row in final.iterrows():
            # Get content score for this product
            content_score = row.get('_content_score', 0)
            
            # Get score breakdown
            score_breakdown = {}
            for col in ['_skin_type_score', '_concern_score', '_ingredient_score', 
                        '_category_score', '_budget_score', '_rating_score', 
                        '_popularity_score', '_content_score', '_preference_score', '_hybrid_score']:
                if col in row:
                    key = col.strip('_')
                    if key.endswith('_score'):
                        key = key[: -len('_score')]
                    score_breakdown[key] = round(float(row[col]), 3)
            
            explanation = generate_explanation(
                row,
                user_profile,
                content_score=content_score,
                score_breakdown=score_breakdown
            )
            
            rec = {
                'product_id': row['product_id'],
                'name': row['product_name'],
                'brand': row['brand'],
                'category': row['category'],
                'price': round(float(row['price_usd']), 2),
                'rating': round(float(row['rating']), 1),
                'review_count': int(row['review_count']) if pd.notna(row['review_count']) else 0,
                'score': round(float(row['_hybrid_score']), 3),
                'match_percentage': round(float(row['_hybrid_score']) * 100),
                'reasons': explanation['reasons'],
                'warnings': explanation['warnings'],
                'matching_attributes': explanation['matching_attributes'],
                'score_breakdown': explanation['score_breakdown'],
                'ingredients': _to_list(row['ingredients_normalized'])[:10],
                'skin_types': _to_list(row['skin_types']),
                'skin_concerns': _to_list(row['skin_concerns'])
            }
            recommendations.append(rec)
        
        # Determine if fallback was used
        is_fallback = filter_info.get('is_fallback', False)
        fallback_message = None
        if is_fallback:
            fallback_message = f"Showing alternative matches. Relaxed constraints: {', '.join(filter_info['fallbacks_used'])}"
        
        return {
            'recommendations': recommendations,
            'filter_info': filter_info,
            'user_profile': user_profile,
            'total_candidates': len(candidates),
            'is_fallback': is_fallback,
            'fallback_message': fallback_message,
            'message': fallback_message or f"Found {len(recommendations)} personalized recommendations"
        }
    
    def get_product_by_id(self, product_id: str) -> Optional[Dict[str, Any]]:
        """Get product details by ID."""
        matches = self.products_df[self.products_df['product_id'] == product_id]
        if len(matches) == 0:
            return None
        row = matches.iloc[0]
        return {
            'product_id': row['product_id'],
            'name': row['product_name'],
            'brand': row['brand'],
            'category': row['category'],
            'price': round(float(row['price_usd']), 2),
            'rating': round(float(row['rating']), 1),
            'review_count': int(row['review_count']) if pd.notna(row['review_count']) else 0,
            'ingredients': _to_list(row['ingredients_normalized']),
            'skin_types': _to_list(row['skin_types']),
            'skin_concerns': _to_list(row['skin_concerns']),
            'description': row.get('description', '')
        }
    
    def get_categories(self) -> List[str]:
        """Get all available categories."""
        cats = self.products_df['category'].dropna().unique().tolist()
        return sorted([c for c in cats if isinstance(c, str)])
    
    def get_skin_types(self) -> List[str]:
        """Get all available skin types."""
        all_types = set()
        for st_list in self.products_df['skin_types']:
            if isinstance(st_list, list):
                all_types.update(st_list)
        return sorted([t for t in all_types if t != 'all' and isinstance(t, str)])
    
    def get_concerns(self) -> List[str]:
        """Get all available skin concerns."""
        all_concerns = set()
        for c_list in self.products_df['skin_concerns']:
            if isinstance(c_list, list):
                all_concerns.update(c_list)
        return sorted([c for c in all_concerns if isinstance(c, str)])
    
    def get_brands(self) -> List[str]:
        """Get all available brands."""
        brands = self.products_df['brand'].dropna().unique().tolist()
        return sorted([b for b in brands if isinstance(b, str)])
    
    def get_ingredients(self, top_n: int = 100) -> List[str]:
        """Get most common ingredients."""
        all_ingredients = []
        for ing_list in self.products_df['ingredients_normalized']:
            if isinstance(ing_list, list):
                all_ingredients.extend([str(i).lower() for i in ing_list if isinstance(i, str)])
        return pd.Series(all_ingredients).value_counts().head(top_n).index.tolist()


LIST_COLUMNS = ['ingredients_normalized', 'skin_types', 'skin_concerns']


def normalize_list_columns(products_df: pd.DataFrame) -> pd.DataFrame:
    """
    Parquet round-trips Python list columns into numpy arrays, and CSV stores
    them as string reprs like "['a', 'b']". Downstream scoring/filtering checks
    `isinstance(x, list)`, so both forms must be converted back to real lists
    or matching silently degrades to zero.
    """
    import ast

    def _as_list(val):
        if isinstance(val, list):
            return val
        if isinstance(val, np.ndarray):
            return val.tolist()
        if isinstance(val, str) and val.strip():
            try:
                parsed = ast.literal_eval(val)
                return parsed if isinstance(parsed, list) else []
            except (ValueError, SyntaxError):
                return []
        return []

    for col in LIST_COLUMNS:
        if col in products_df.columns:
            products_df[col] = products_df[col].map(_as_list)
    return products_df


def build_recommender(
    products_path: str,
    model_path: str,
    preference_weights: Optional[Dict[str, float]] = None,
    hybrid_weights: Optional[Dict[str, float]] = None
) -> BeautyRecommender:
    """Factory function to build recommender from saved artifacts."""
    if products_path.endswith('.parquet'):
        products_df = pd.read_parquet(products_path)
    else:
        products_df = pd.read_csv(products_path)
    products_df = normalize_list_columns(products_df)
    logger.info(f"Loaded {len(products_df)} products from {products_path}")
    
    # Load content model
    content_model = load_content_model(model_path)
    
    # Create recommender
    recommender = BeautyRecommender(
        products_df=products_df,
        content_model=content_model,
        preference_weights=preference_weights,
        hybrid_weights=hybrid_weights
    )
    
    return recommender