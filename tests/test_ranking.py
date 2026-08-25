"""
Tests for ranking module.
"""

import pytest
import pandas as pd
import numpy as np
import sys

sys.path.insert(0, '/Users/princemaurya/orbo-beauty-recommender')

from app.recommender.ranking import (
    normalize_series,
    compute_skin_type_score,
    compute_concern_score,
    compute_ingredient_score,
    compute_category_score,
    compute_budget_score,
    compute_rating_score,
    compute_popularity_score,
    compute_preference_score,
    rank_products
)


class TestNormalizeSeries:
    """Tests for series normalization."""
    
    def test_minmax_normalization(self):
        series = pd.Series([1, 2, 3, 4, 5])
        normalized = normalize_series(series, 'minmax')
        assert normalized.min() == 0.0
        assert normalized.max() == 1.0
    
    def test_zscore_normalization(self):
        series = pd.Series([1, 2, 3, 4, 5])
        normalized = normalize_series(series, 'zscore')
        assert all(normalized >= 0)
        assert all(normalized <= 1)
    
    def test_single_value(self):
        series = pd.Series([5])
        normalized = normalize_series(series, 'minmax')
        assert normalized.iloc[0] == 0.5
    
    def test_all_same_values(self):
        series = pd.Series([5, 5, 5])
        normalized = normalize_series(series, 'minmax')
        assert all(normalized == 0.5)


class TestComponentScores:
    """Tests for individual score components."""
    
    @pytest.fixture
    def sample_df(self):
        return pd.DataFrame({
            'skin_types': [['dry', 'sensitive'], ['oily'], ['all'], ['dry']],
            'skin_concerns': [['hydration'], ['acne'], ['hydration', 'aging'], ['texture']],
            'ingredients_normalized': [['ceramide', 'hyaluronic acid'], ['salicylic acid'], [], ['glycerin']],
            'category': ['moisturizer', 'cleanser', 'serum', 'moisturizer'],
            'price_usd': [30.0, 20.0, 50.0, 25.0],
            'rating': [4.5, 4.0, 4.8, 3.9],
            'review_count': [100, 200, 500, 50]
        })
    
    def test_skin_type_score(self, sample_df):
        scores = compute_skin_type_score(sample_df, 'dry')
        assert all(scores >= 0)
        assert all(scores <= 1)
        # First row with 'dry' should get full match
        assert scores.iloc[0] == 1.0
        # 'all' skin types should get partial match
        assert scores.iloc[2] == 0.8
    
    def test_concern_score(self, sample_df):
        scores = compute_concern_score(sample_df, ['hydration'])
        assert all(scores >= 0)
        assert all(scores <= 1)
        # Products with 'hydration' concern should score higher
        assert scores.iloc[0] == 1.0
    
    def test_ingredient_score(self, sample_df):
        scores = compute_ingredient_score(sample_df, ['ceramide'])
        assert all(scores >= 0)
        assert all(scores <= 1)
        # Product with 'ceramide' should get full score
        assert scores.iloc[0] == 1.0
    
    def test_category_score(self, sample_df):
        scores = compute_category_score(sample_df, 'moisturizer')
        assert all((scores == 0) | (scores == 1))
        assert scores.iloc[0] == 1.0  # First row is moisturizer
        assert scores.iloc[1] == 0.0  # Second row is cleanser
    
    def test_budget_score_within_budget(self, sample_df):
        scores = compute_budget_score(sample_df, 100)
        # All products are within budget, should get high scores
        assert all(scores > 0)
    
    def test_budget_score_over_budget(self, sample_df):
        scores = compute_budget_score(sample_df, 10)
        # All products are over budget $10
        assert scores.iloc[2] == 0.0  # $50 product is way over
    
    def test_rating_score(self, sample_df):
        scores = compute_rating_score(sample_df)
        assert all(scores >= 0)
        assert all(scores <= 1)
        # Highest rated should have highest score
        assert scores.iloc[2] == 1.0  # 4.8 is highest
    
    def test_popularity_score(self, sample_df):
        scores = compute_popularity_score(sample_df)
        assert all(scores >= 0)
        assert all(scores <= 1)
        # Most reviewed should have highest score
        assert scores.iloc[2] == 1.0  # 500 is most


class TestPreferenceScore:
    """Tests for preference score combination."""
    
    @pytest.fixture
    def sample_df(self):
        return pd.DataFrame({
            'skin_types': [['dry'], ['oily'], ['all']],
            'skin_concerns': [['hydration'], ['acne'], ['hydration', 'acne']],
            'ingredients_normalized': [['ceramide'], ['salicylic acid'], ['glycerin']],
            'category': ['moisturizer', 'cleanser', 'serum'],
            'price_usd': [30.0, 20.0, 50.0],
            'rating': [4.5, 4.0, 4.3],
            'review_count': [100, 200, 150]
        })
    
    def test_preference_score_range(self, sample_df):
        scores = compute_preference_score(
            sample_df,
            user_skin_type='dry',
            user_concerns=['hydration'],
            user_category='moisturizer',
            user_budget=50,
            preferred_ingredients=['ceramide']
        )
        assert all(scores >= 0)
        assert all(scores <= 1)
    
    def test_preference_score_matching(self, sample_df):
        scores = compute_preference_score(
            sample_df,
            user_skin_type='dry',
            user_concerns=['hydration'],
            user_category='moisturizer',
            user_budget=50,
            preferred_ingredients=['ceramide']
        )
        # First product matches all criteria best
        assert scores.iloc[0] == scores.max()


class TestRankProducts:
    """Tests for product ranking."""
    
    @pytest.fixture
    def sample_df(self):
        return pd.DataFrame({
            'product_id': ['p1', 'p2', 'p3'],
            'skin_types': [['dry'], ['oily'], ['all']],
            'skin_concerns': [['hydration'], ['acne'], ['hydration']],
            'ingredients_normalized': [['ceramide'], ['salicylic acid'], ['glycerin']],
            'category': ['moisturizer', 'cleanser', 'moisturizer'],
            'price_usd': [30.0, 20.0, 25.0],
            'rating': [4.5, 4.0, 4.2],
            'review_count': [100, 200, 150]
        })
    
    def test_ranking_order(self, sample_df):
        ranked = rank_products(
            sample_df,
            user_skin_type='dry',
            user_concerns=['hydration'],
            user_category='moisturizer'
        )
        # First product should be ranked highest
        assert ranked.iloc[0]['product_id'] == 'p1'
    
    def test_ranking_deterministic(self, sample_df):
        """Test that ranking is deterministic."""
        ranked1 = rank_products(
            sample_df,
            user_skin_type='dry',
            user_concerns=['hydration']
        )
        ranked2 = rank_products(
            sample_df,
            user_skin_type='dry',
            user_concerns=['hydration']
        )
        assert ranked1['product_id'].tolist() == ranked2['product_id'].tolist()
    
    def test_ranking_with_content_similarity(self, sample_df):
        """Test ranking with content similarity provided."""
        content_similarities = pd.Series([0.9, 0.5, 0.7], index=sample_df.index)
        
        ranked = rank_products(
            sample_df,
            user_skin_type='dry',
            user_concerns=['hydration'],
            content_similarities=content_similarities
        )
        
        assert '_hybrid_score' in ranked.columns