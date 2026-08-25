"""
Tests for fallback behavior.
"""

import pytest
import sys

sys.path.insert(0, '/Users/princemaurya/orbo-beauty-recommender')


class TestFallbackBehavior:
    """Tests for fallback behavior when hard filters exclude too many products."""
    
    def test_extremely_low_budget_fallback(self, recommender):
        """Test fallback when budget is extremely low."""
        result = recommender.recommend(
            skin_type='dry',
            concerns=['hydration'],
            budget=1.0,
            top_k=5
        )
        
        # Should either have recommendations or gracefully handle empty
        assert 'recommendations' in result
        assert 'is_fallback' in result
        assert 'message' in result
        
        if result['is_fallback']:
            assert result.get('fallback_message') is not None
    
    def test_barely_no_matches_fallback(self, recommender):
        """Test fallback with very restrictive constraints."""
        result = recommender.recommend(
            skin_type='dry',
            concerns=['hydration', 'acne'],
            category='moisturizer',
            budget=5,
            preferred_ingredients=['ceramide', 'hyaluronic acid'],
            top_k=5
        )
        
        assert 'recommendations' in result
    
    def test_unknown_ingredient_avoidance(self, recommender):
        """Test with avoiding common ingredients."""
        result = recommender.recommend(
            skin_type='dry',
            concerns=['hydration'],
            category='moisturizer',
            budget=50,
            avoid_ingredients=['fragrance', 'alcohol', 'essential oil', 'paraben'],
            top_k=5
        )
        
        assert 'recommendations' in result
        # Should still return some results even with many exclusions
        assert 'total_candidates' in result
    
    def test_all_ingredients_avoided(self, recommender):
        """Test with avoiding all common ingredients."""
        result = recommender.recommend(
            skin_type='dry',
            concerns=['hydration'],
            category='moisturizer',
            budget=50,
            avoid_ingredients=[
                'fragrance', 'alcohol', 'essential oil', 'paraben',
                'sulfate', 'silicone', 'mineral oil', 'ceramide',
                'hyaluronic acid', 'glycerin', 'niacinamide'
            ],
            top_k=5
        )
        
        # Should gracefully handle - either empty or fallback
        assert 'recommendations' in result
        assert 'message' in result
    
    def test_impossible_constraints_returns_empty(self, recommender):
        """Test that impossible constraints return empty recommendations."""
        result = recommender.recommend(
            skin_type='dry',
            budget=0.01,  # Impossibly low
            top_k=5
        )
        
        assert 'recommendations' in result
        assert len(result['recommendations']) == 0
        assert 'message' in result
    
    def test_fallback_preserves_hard_constraints(self, recommender):
        """Test that fallback never violates avoid_ingredients."""
        avoid_list = ['paraben', 'fragrance']
        
        result = recommender.recommend(
            skin_type='dry',
            concerns=['hydration'],
            category='moisturizer',
            budget=50,
            avoid_ingredients=avoid_list,
            top_k=5
        )
        
        # Verify no recommended product contains avoided ingredients
        for rec in result['recommendations']:
            ingredients = [str(i).lower() for i in rec.get('ingredients', [])]
            for avoided in avoid_list:
                assert avoided not in ingredients, \
                    f"Product {rec['name']} contains avoided ingredient {avoided}"
    
    def test_min_candidates_threshold(self, recommender):
        """Test min_candidates parameter."""
        result = recommender.recommend(
            skin_type='dry',
            concerns=['hydration'],
            category='moisturizer',
            budget=50,
            top_k=5,
            min_candidates=50
        )
        
        assert 'recommendations' in result
        assert result['total_candidates'] >= 50 or result.get('is_fallback', False)