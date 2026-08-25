"""
Content-based recommendation model using TF-IDF and cosine similarity.

This module handles:
- TF-IDF vectorization of product text representations
- User profile vectorization
- Cosine similarity computation
- Model persistence
"""

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
import logging

logger = logging.getLogger(__name__)


class ContentModel:
    """TF-IDF based content similarity model for beauty products."""
    
    def __init__(
        self,
        max_features: int = 5000,
        ngram_range: Tuple[int, int] = (1, 2),
        min_df: int = 2,
        max_df: float = 0.95
    ):
        self.max_features = max_features
        self.ngram_range = ngram_range
        self.min_df = min_df
        self.max_df = max_df
        
        self.vectorizer = TfidfVectorizer(
            max_features=max_features,
            ngram_range=ngram_range,
            min_df=min_df,
            max_df=max_df,
            stop_words='english',
            lowercase=True,
            strip_accents='unicode'
        )
        
        self.product_vectors = None
        self.product_ids = None
        self.is_fitted = False
    
    def fit(self, products_df: pd.DataFrame, text_column: str = 'text_representation') -> 'ContentModel':
        """Fit the TF-IDF vectorizer on product text representations."""
        logger.info(f"Fitting TF-IDF on {len(products_df)} products...")
        
        texts = products_df[text_column].fillna('').astype(str).tolist()
        self.product_ids = products_df['product_id'].tolist()
        
        self.product_vectors = self.vectorizer.fit_transform(texts)
        self.is_fitted = True
        
        logger.info(f"TF-IDF fitted. Vocabulary size: {len(self.vectorizer.vocabulary_)}")
        logger.info(f"Product vectors shape: {self.product_vectors.shape}")
        
        return self
    
    def transform_user_profile(self, user_profile_text: str) -> np.ndarray:
        """Transform user profile text to TF-IDF vector."""
        if not self.is_fitted:
            raise ValueError("Model must be fitted before transforming user profile")
        
        user_vector = self.vectorizer.transform([user_profile_text])
        return user_vector
    
    def compute_similarities(self, user_vector: np.ndarray) -> np.ndarray:
        """Compute cosine similarities between user vector and all products."""
        if not self.is_fitted:
            raise ValueError("Model must be fitted before computing similarities")
        
        similarities = cosine_similarity(user_vector, self.product_vectors).flatten()
        return similarities
    
    def get_top_similar(
        self, 
        user_vector: np.ndarray, 
        top_k: int = 100,
        candidate_indices: Optional[List[int]] = None
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Get top-k most similar products.
        
        Args:
            user_vector: User profile TF-IDF vector
            top_k: Number of top products to return
            candidate_indices: Optional indices to restrict search (for filtered candidates)
        
        Returns:
            Tuple of (indices, scores)
        """
        similarities = self.compute_similarities(user_vector)
        
        if candidate_indices is not None:
            # Restrict to candidate indices
            candidate_similarities = similarities[candidate_indices]
            top_indices_local = np.argsort(candidate_similarities)[::-1][:top_k]
            top_indices = np.array(candidate_indices)[top_indices_local]
            top_scores = candidate_similarities[top_indices_local]
        else:
            top_indices = np.argsort(similarities)[::-1][:top_k]
            top_scores = similarities[top_indices]
        
        return top_indices, top_scores
    
    def build_user_profile_text(
        self,
        skin_type: Optional[str] = None,
        concerns: Optional[List[str]] = None,
        category: Optional[str] = None,
        preferred_ingredients: Optional[List[str]] = None,
        avoid_ingredients: Optional[List[str]] = None
    ) -> str:
        """Build user profile text for TF-IDF vectorization."""
        parts = []
        
        if skin_type:
            parts.append(skin_type.lower())
            parts.append(f"{skin_type} skin")
        
        if concerns:
            parts.extend([c.lower() for c in concerns])
            parts.extend([f"{c} concern" for c in concerns])
        
        if category:
            parts.append(category.lower())
            parts.append(f"{category} product")
        
        if preferred_ingredients:
            parts.extend([ing.lower() for ing in preferred_ingredients])
            parts.extend([f"contains {ing.lower()}" for ing in preferred_ingredients])
        
        # Avoid ingredients are NOT added to user profile (they're handled in filtering)
        
        return ' '.join(parts)
    
    def save(self, filepath: str):
        """Save model to disk."""
        Path(filepath).parent.mkdir(parents=True, exist_ok=True)
        joblib.dump({
            'vectorizer': self.vectorizer,
            'product_vectors': self.product_vectors,
            'product_ids': self.product_ids,
            'is_fitted': self.is_fitted,
            'max_features': self.max_features,
            'ngram_range': self.ngram_range,
            'min_df': self.min_df,
            'max_df': self.max_df
        }, filepath)
        logger.info(f"Model saved to {filepath}")
    
    @classmethod
    def load(cls, filepath: str) -> 'ContentModel':
        """Load model from disk."""
        data = joblib.load(filepath)
        model = cls(
            max_features=data['max_features'],
            ngram_range=data['ngram_range'],
            min_df=data['min_df'],
            max_df=data['max_df']
        )
        model.vectorizer = data['vectorizer']
        model.product_vectors = data['product_vectors']
        model.product_ids = data['product_ids']
        model.is_fitted = data['is_fitted']
        logger.info(f"Model loaded from {filepath}")
        return model


def create_content_model(products_df: pd.DataFrame, model_path: str) -> ContentModel:
    """Create and save content model."""
    model = ContentModel()
    model.fit(products_df)
    model.save(model_path)
    return model


def load_content_model(model_path: str) -> ContentModel:
    """Load content model."""
    return ContentModel.load(model_path)