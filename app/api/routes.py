"""
FastAPI routes for Orbo Beauty AI Recommendation System.
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional, Dict, Any
import logging
import pandas as pd

from app.models.schemas import (
    RecommendationRequest,
    RecommendationsResponse,
    RecommendationResponse,
    MatchingAttributes,
    ScoreBreakdown,
    ProductResponse,
    ProductsListResponse,
    MetadataResponse,
    HealthResponse
)
from app.recommender import BeautyRecommender

logger = logging.getLogger(__name__)

router = APIRouter()

# Global recommender instance (set during startup)
recommender: Optional[BeautyRecommender] = None


def get_recommender() -> BeautyRecommender:
    """Dependency to get recommender instance."""
    if recommender is None:
        raise HTTPException(status_code=503, detail="Recommender not initialized")
    return recommender


def set_recommender(rec: BeautyRecommender):
    """Set global recommender instance."""
    global recommender
    recommender = rec


@router.get("/health", response_model=HealthResponse)
async def health_check(rec: BeautyRecommender = Depends(get_recommender)):
    """Health check endpoint."""
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        model_loaded=rec.content_model.is_fitted,
        products_loaded=len(rec.products_df)
    )


@router.post("/recommend", response_model=RecommendationsResponse)
async def get_recommendations(
    request: RecommendationRequest,
    rec: BeautyRecommender = Depends(get_recommender)
):
    """
    Get personalized beauty product recommendations.
    
    Accepts user preferences and returns ranked product recommendations
    with explanations.
    """
    try:
        result = rec.recommend(
            skin_type=request.skin_type.value if request.skin_type else None,
            concerns=[c.value for c in request.concerns] if request.concerns else None,
            category=request.category.value if request.category else None,
            budget=request.budget,
            preferred_ingredients=request.preferred_ingredients,
            avoid_ingredients=request.avoid_ingredients,
            top_k=request.top_k
        )
        
        # Convert to response models
        recommendations = []
        for rec_data in result['recommendations']:
            matching_attrs = MatchingAttributes(
                skin_type=rec_data['matching_attributes'].get('skin_type'),
                concerns_matched=rec_data['matching_attributes'].get('concerns_matched', []),
                concerns_total=rec_data['matching_attributes'].get('concerns_total', []),
                category=rec_data['matching_attributes'].get('category'),
                budget=rec_data['matching_attributes'].get('budget'),
                preferred_ingredients_matched=rec_data['matching_attributes'].get('preferred_ingredients_matched', []),
                preferred_ingredients_total=rec_data['matching_attributes'].get('preferred_ingredients_total', [])
            )
            
            score_breakdown = ScoreBreakdown(**rec_data['score_breakdown'])
            
            recommendations.append(RecommendationResponse(
                product_id=rec_data['product_id'],
                name=rec_data['name'],
                brand=rec_data['brand'],
                category=rec_data['category'],
                price=rec_data['price'],
                rating=rec_data['rating'],
                review_count=rec_data['review_count'],
                score=rec_data['score'],
                match_percentage=rec_data['match_percentage'],
                reasons=rec_data['reasons'],
                warnings=rec_data['warnings'],
                matching_attributes=matching_attrs,
                score_breakdown=score_breakdown,
                ingredients=rec_data['ingredients'],
                skin_types=rec_data['skin_types'],
                skin_concerns=rec_data['skin_concerns']
            ))
        
        return RecommendationsResponse(
            recommendations=recommendations,
            filter_info=result['filter_info'],
            user_profile=result['user_profile'],
            total_candidates=result['total_candidates'],
            is_fallback=result['is_fallback'],
            fallback_message=result.get('fallback_message'),
            message=result['message']
        )
    
    except Exception as e:
        logger.error(f"Error generating recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/products", response_model=ProductsListResponse)
async def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    min_rating: Optional[float] = Query(None, ge=0, le=5),
    rec: BeautyRecommender = Depends(get_recommender)
):
    """List products with optional filtering and pagination."""
    df = rec.products_df.copy()
    
    # Apply filters
    if category:
        df = df[df['category'] == category]
    if brand:
        df = df[df['brand'].str.lower() == brand.lower()]
    if min_price is not None:
        df = df[df['price_usd'] >= min_price]
    if max_price is not None:
        df = df[df['price_usd'] <= max_price]
    if min_rating is not None:
        df = df[df['rating'] >= min_rating]
    
    total = len(df)
    
    # Pagination
    start = (page - 1) * page_size
    end = start + page_size
    df_page = df.iloc[start:end]
    
    products = []
    for _, row in df_page.iterrows():
        products.append(ProductResponse(
            product_id=row['product_id'],
            name=row['product_name'],
            brand=row['brand'],
            category=row['category'],
            price=round(float(row['price_usd']), 2),
            rating=round(float(row['rating']), 1),
            review_count=int(row['review_count']) if pd.notna(row['review_count']) else 0,
            ingredients=row['ingredients_normalized'] if isinstance(row['ingredients_normalized'], list) else [],
            skin_types=row['skin_types'] if isinstance(row['skin_types'], list) else [],
            skin_concerns=row['skin_concerns'] if isinstance(row['skin_concerns'], list) else [],
            description=row.get('description', '')
        ))
    
    return ProductsListResponse(
        products=products,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: str,
    rec: BeautyRecommender = Depends(get_recommender)
):
    """Get detailed product information by ID."""
    product = rec.get_product_by_id(product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return ProductResponse(**product)


@router.get("/categories", response_model=List[str])
async def get_categories(rec: BeautyRecommender = Depends(get_recommender)):
    """Get all available product categories."""
    return rec.get_categories()


@router.get("/skin-types", response_model=List[str])
async def get_skin_types(rec: BeautyRecommender = Depends(get_recommender)):
    """Get all available skin types."""
    return rec.get_skin_types()


@router.get("/concerns", response_model=List[str])
async def get_concerns(rec: BeautyRecommender = Depends(get_recommender)):
    """Get all available skin concerns."""
    return rec.get_concerns()


@router.get("/metadata", response_model=MetadataResponse)
async def get_metadata(rec: BeautyRecommender = Depends(get_recommender)):
    """Get metadata about available filter options and dataset statistics."""
    df = rec.products_df
    
    return MetadataResponse(
        categories=rec.get_categories(),
        skin_types=rec.get_skin_types(),
        concerns=rec.get_concerns(),
        brands=rec.get_brands(),
        top_ingredients=rec.get_ingredients(50),
        price_range={
            'min': round(float(df['price_usd'].min()), 2),
            'max': round(float(df['price_usd'].max()), 2),
            'mean': round(float(df['price_usd'].mean()), 2),
            'median': round(float(df['price_usd'].median()), 2)
        },
        rating_range={
            'min': round(float(df['rating'].min()), 1),
            'max': round(float(df['rating'].max()), 1),
            'mean': round(float(df['rating'].mean()), 1),
            'median': round(float(df['rating'].median()), 1)
        },
        total_products=len(df)
    )