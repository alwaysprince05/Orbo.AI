"""
Tests for API endpoints.
"""

import pytest


class TestHealthEndpoint:
    """Tests for health endpoint."""
    
    def test_health(self, client):
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data['status'] == 'healthy'
        assert 'version' in data
        assert 'model_loaded' in data
        assert 'products_loaded' in data


class TestRecommendEndpoint:
    """Tests for recommendation endpoint."""
    
    def test_recommend_basic(self, client):
        """Test basic recommendation request."""
        payload = {
            "skin_type": "dry",
            "concerns": ["hydration"],
            "category": "moisturizer",
            "budget": 50,
            "preferred_ingredients": ["ceramide"],
            "avoid_ingredients": ["fragrance"],
            "top_k": 5
        }
        
        response = client.post("/api/v1/recommend", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert 'recommendations' in data
        assert 'filter_info' in data
        assert 'message' in data
    
    def test_recommend_with_empty_profile(self, client):
        """Test recommendation with empty profile."""
        payload = {
            "skin_type": None,
            "concerns": [],
            "category": None,
            "budget": None,
            "preferred_ingredients": [],
            "avoid_ingredients": [],
            "top_k": 5
        }
        
        response = client.post("/api/v1/recommend", json=payload)
        assert response.status_code == 200
    
    def test_recommend_invalid_category(self, client):
        """Test recommendation with invalid category returns validation error."""
        payload = {
            "skin_type": "dry",
            "concerns": ["hydration"],
            "category": "invalid_category",
            "top_k": 5
        }
        
        response = client.post("/api/v1/recommend", json=payload)
        assert response.status_code == 422  # Validation error
    
    def test_recommend_invalid_skin_type(self, client):
        """Test recommendation with invalid skin type."""
        payload = {
            "skin_type": "greasy",
            "concerns": ["hydration"],
            "top_k": 5
        }
        
        response = client.post("/api/v1/recommend", json=payload)
        assert response.status_code == 422  # Validation error
    
    def test_recommend_exceeds_top_k(self, client):
        """Test that top_k is capped."""
        payload = {
            "skin_type": "dry",
            "top_k": 100  # Exceeds max
        }
        
        response = client.post("/api/v1/recommend", json=payload)
        assert response.status_code == 422  # Validation error


class TestProductsEndpoint:
    """Tests for products endpoint."""
    
    def test_list_products(self, client):
        """Test listing products."""
        response = client.get("/api/v1/products")
        assert response.status_code == 200
        
        data = response.json()
        assert 'products' in data
        assert 'total' in data
        assert 'page' in data
        assert 'page_size' in data
    
    def test_list_products_with_pagination(self, client):
        """Test list products with pagination."""
        response = client.get("/api/v1/products?page=1&page_size=10")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data['products']) <= 10
    
    def test_list_products_with_filters(self, client):
        """Test list products with filters."""
        response = client.get("/api/v1/products?category=moisturizer&min_price=10&max_price=50")
        assert response.status_code == 200


class TestMetadataEndpoints:
    """Tests for metadata endpoints."""
    
    def test_categories(self, client):
        response = client.get("/api/v1/categories")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
    
    def test_skin_types(self, client):
        response = client.get("/api/v1/skin-types")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_concerns(self, client):
        response = client.get("/api/v1/concerns")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_metadata(self, client):
        response = client.get("/api/v1/metadata")
        assert response.status_code == 200
        
        data = response.json()
        assert 'categories' in data
        assert 'skin_types' in data
        assert 'concerns' in data
        assert 'brands' in data
        assert 'top_ingredients' in data
        assert 'price_range' in data
        assert 'rating_range' in data
        assert 'total_products' in data


class TestRootEndpoint:
    """Tests for root endpoint."""
    
    def test_root(self, client):
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert 'name' in data
        assert 'docs' in data