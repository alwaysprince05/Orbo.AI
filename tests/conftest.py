"""
Pytest fixtures for Orbo Beauty AI tests.
"""

import pytest
import pandas as pd
import numpy as np
from pathlib import Path
import sys

sys.path.insert(0, '/Users/princemaurya/orbo-beauty-recommender')

from fastapi.testclient import TestClient
from app.main import app
import app.api.routes as routes_module
from app.recommender import build_recommender


@pytest.fixture(scope="session")
def products_df():
    """Load processed products."""
    from evaluation.fast_evaluate import load_products_with_lists
    return load_products_with_lists('data/processed/products_processed.csv')


@pytest.fixture(scope="session")
def recommender():
    """Build recommender instance."""
    return build_recommender(
        'data/processed/products_processed.parquet',
        'data/processed/content_model.joblib'
    )


@pytest.fixture(scope="session")
def client(recommender):
    """Create test client with initialized recommender."""
    routes_module.recommender = recommender
    return TestClient(app)


@pytest.fixture
def sample_user_profile():
    """Sample user profile for testing."""
    return {
        'skin_type': 'dry',
        'concerns': ['hydration'],
        'category': 'moisturizer',
        'budget': 50,
        'preferred_ingredients': ['ceramide', 'hyaluronic acid'],
        'avoid_ingredients': ['fragrance'],
        'top_k': 5
    }


@pytest.fixture
def empty_user_profile():
    """Empty user profile for testing."""
    return {
        'skin_type': None,
        'concerns': [],
        'category': None,
        'budget': None,
        'preferred_ingredients': [],
        'avoid_ingredients': [],
        'top_k': 5
    }