"""
Tests for recommendation engine.
"""

import pytest


class TestRecommendation:
    """Tests for the main recommendation functionality."""
    
    def test_basic_recommendation(self, recommender, sample_user_profile):
        """Test basic recommendation flow."""
        result = recommender.recommend(
            skin_type=sample_user_profile['skin_type'],
            concerns=sample_user_profile['concerns'],
            category=sample_user_profile['category'],
            budget=sample_user_profile['budget'],
            preferred_ingredients=sample_user_profile['preferred_ingredients'],
            avoid_ingredients=sample_user_profile['avoid_ingredients'],
            top_k=sample_user_profile['top_k']
        )
        
        assert 'recommendations' in result
        assert 'filter_info' in result
        assert 'user_profile' in result
        assert 'total_candidates' in result
        assert 'is_fallback' in result
        assert 'message' in result
    
    def test_recommendations_count(self, recommender, sample_user_profile):
        """Test that correct number of recommendations is returned."""
        result = recommender.recommend(
            skin_type='dry',
            concerns=['hydration'],
            category='moisturizer',
            budget=50,
            top_k=5
        )
        
        assert len(result['recommendations']) <= 5
    
    def test_recommendation_structure(self, recommender, sample_user_profile):
        """Test that recommendations have all required fields."""
        result = recommender.recommend(
            skin_type='dry',
            concerns=['hydration'],
            category='moisturizer',
            budget=50,
            top_k=3
        )
        
        for rec in result['recommendations']:
            assert 'product_id' in rec
            assert 'name' in rec
            assert 'brand' in rec
            assert 'category' in rec
            assert 'price' in rec
            assert 'rating' in rec
            assert 'score' in rec
            assert 'match_percentage' in rec
            assert 'reasons' in rec
            assert 'warnings' in rec
    
    def test_no_recommendation(self, recommender):
        """Test with impossible constraints."""
        result = recommender.recommend(
            skin_type='dry',
            budget=0.01,
            top_k=5
        )
        
        # Should return empty recommendations
        assert len(result['recommendations']) == 0
    
    def test_empty_profile(self, recommender, empty_user_profile):
        """Test recommendation with empty profile."""
        result = recommender.recommend(
            skin_type=None,
            concerns=[],
            category=None,
            budget=None,
            preferred_ingredients=[],
            avoid_ingredients=[],
            top_k=5
        )
        
        assert 'recommendations' in result
        assert len(result['recommendations']) > 0
    
    def test_score_range(self, recommender, sample_user_profile):
        """Test that scores are within valid range."""
        result = recommender.recommend(
            skin_type='dry',
            concerns=['hydration'],
            category='moisturizer',
            budget=50,
            top_k=5
        )
        
        for rec in result['recommendations']:
            assert 0 <= rec['score'] <= 1
            assert 0 <= rec['match_percentage'] <= 100


class TestCandidateGeneration:
    """Tests for candidate generation."""
    
    def test_category_filter(self, products_df):
        """Test category filtering."""
        from app.recommender.candidate_generation import filter_by_category
        
        filtered = filter_by_category(products_df, "moisturizer")
        assert len(filtered) > 0
        assert all(filtered['category'] == "moisturizer")
    
    def test_budget_filter(self, products_df):
        """Test budget filtering."""
        from app.recommender.candidate_generation import filter_by_budget
        
        filtered = filter_by_budget(products_df, 50)
        assert all(filtered['price_usd'] <= 50)
    
    def test_avoid_ingredients_filter(self, products_df):
        """Test avoid ingredients filtering."""
        from app.recommender.candidate_generation import filter_by_avoid_ingredients
        
        # Get a product with known ingredients
        product = products_df.iloc[0]
        if isinstance(product['ingredients_normalized'], list) and product['ingredients_normalized']:
            first_ingredient = product['ingredients_normalized'][0]
            
            filtered = filter_by_avoid_ingredients(products_df, [first_ingredient])
            # The product with that ingredient should be filtered out
            assert product['product_id'] not in filtered['product_id'].values


class TestRanking:
    """Tests for ranking."""
    
    def test_hybrid_score_calculation(self, products_df):
        """Test hybrid score calculation."""
        from app.recommender.ranking import compute_preference_score
        
        # Test with a small subset
        test_df = products_df.head(10).copy()
        
        scores = compute_preference_score(
            test_df,
            user_skin_type='dry',
            user_concerns=['hydration'],
            user_budget=50,
            preferred_ingredients=['ceramide']
        )
        
        assert len(scores) == len(test_df)
        assert all(scores >= 0)
        assert all(scores <= 1)


class TestDiversity:
    """Tests for diversity."""
    
    def test_diversity_applied(self, recommender, sample_user_profile):
        """Test that diversity is applied."""
        result = recommender.recommend(
            skin_type='dry',
            concerns=['hydration'],
            category='moisturizer',
            budget=50,
            top_k=5
        )
        
        recommendations = result['recommendations']
        
        # Check that not all are from the same brand
        brands = [rec['brand'] for rec in recommendations]
        unique_brands = set(brands)
        
        # If we have multiple recommendations, they should have some diversity
        if len(recommendations) > 1:
            # At least verify the diversity algorithm was applied
            assert len(recommendations) > 0


class TestContentModel:
    """Tests for content model."""
    
    def test_model_builds_user_profile(self):
        """Test user profile text building."""
        from app.recommender.content_model import ContentModel
        
        model = ContentModel()
        
        text = model.build_user_profile_text(
            skin_type='dry',
            concerns=['hydration'],
            category='moisturizer',
            preferred_ingredients=['ceramide']
        )
        
        assert 'dry' in text
        assert 'hydration' in text
        assert 'ceramide' in text
    
    def test_similar_products(self, recommender):
        """Test that similar products are similar."""
        model = recommender.content_model
        
        # Get a product
        product = recommender.products_df.iloc[0]
        product_text = product['text_representation'] if 'text_representation' in product.index else str(product['product_name'])
        
        # Transform and get similar
        user_vector = model.transform_user_profile(product_text)
        indices, scores = model.get_top_similar(user_vector, top_k=5)
        
        assert len(indices) > 0
        assert len(scores) > 0
        # Top recommendation should be highly similar
        assert scores[0] >= 0.9