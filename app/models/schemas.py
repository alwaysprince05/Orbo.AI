"""
Pydantic models/schemas for Orbo Beauty AI Recommendation System API.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator
from enum import Enum


class SkinType(str, Enum):
    DRY = "dry"
    OILY = "oily"
    COMBINATION = "combination"
    NORMAL = "normal"
    SENSITIVE = "sensitive"


class ProductCategory(str, Enum):
    CLEANSER = "cleanser"
    MOISTURIZER = "moisturizer"
    SERUM = "serum"
    SUNSCREEN = "sunscreen"
    TONER = "toner"
    EXFOLIATOR = "exfoliator"
    MASK = "mask"
    EYE_CARE = "eye_care"
    LIP_CARE = "lip_care"
    FACE_OIL = "face_oil"
    BODY_OIL = "body_oil"
    OTHER = "other"


class SkinConcern(str, Enum):
    HYDRATION = "hydration"
    ACNE = "acne"
    AGING = "aging"
    PIGMENTATION = "pigmentation"
    SENSITIVITY = "sensitivity"
    TEXTURE = "texture"
    SUN_PROTECTION = "sun_protection"


class RecommendationRequest(BaseModel):
    """Request model for personalized recommendations."""
    skin_type: Optional[SkinType] = Field(None, description="User's skin type")
    concerns: List[SkinConcern] = Field(default_factory=list, description="Skin concerns to address")
    category: Optional[ProductCategory] = Field(None, description="Product category")
    budget: Optional[float] = Field(None, ge=0, le=1000, description="Maximum budget in USD")
    preferred_ingredients: List[str] = Field(default_factory=list, description="Preferred ingredients")
    avoid_ingredients: List[str] = Field(default_factory=list, description="Ingredients to avoid")
    top_k: int = Field(5, ge=1, le=20, description="Number of recommendations to return")
    
    @field_validator('preferred_ingredients', 'avoid_ingredients', mode='before')
    @classmethod
    def clean_ingredients(cls, v):
        if isinstance(v, str):
            return [ing.strip() for ing in v.split(',') if ing.strip()]
        return v


class MatchingAttributes(BaseModel):
    """Matched attributes between user profile and product."""
    skin_type: Optional[bool] = None
    concerns_matched: List[str] = Field(default_factory=list)
    concerns_total: List[str] = Field(default_factory=list)
    category: Optional[bool] = None
    budget: Optional[bool] = None
    preferred_ingredients_matched: List[str] = Field(default_factory=list)
    preferred_ingredients_total: List[str] = Field(default_factory=list)


class ScoreBreakdown(BaseModel):
    """Detailed score breakdown for explainability."""
    skin_type: Optional[float] = None
    concern: Optional[float] = None
    ingredient: Optional[float] = None
    category: Optional[float] = None
    budget: Optional[float] = None
    rating: Optional[float] = None
    popularity: Optional[float] = None
    content: Optional[float] = None
    preference: Optional[float] = None
    hybrid: Optional[float] = None


class RecommendationResponse(BaseModel):
    """Single product recommendation."""
    product_id: str
    name: str
    brand: str
    category: str
    price: float
    rating: float
    review_count: int
    score: float
    match_percentage: int
    reasons: List[str]
    warnings: List[str]
    matching_attributes: MatchingAttributes
    score_breakdown: ScoreBreakdown
    ingredients: List[str]
    skin_types: List[str]
    skin_concerns: List[str]


class RecommendationsResponse(BaseModel):
    """Full recommendations response."""
    recommendations: List[RecommendationResponse]
    filter_info: Dict[str, Any]
    user_profile: Dict[str, Any]
    total_candidates: int
    is_fallback: bool
    fallback_message: Optional[str] = None
    message: str


class ProductResponse(BaseModel):
    """Product details response."""
    product_id: str
    name: str
    brand: str
    category: str
    price: float
    rating: float
    review_count: int
    ingredients: List[str]
    skin_types: List[str]
    skin_concerns: List[str]
    description: str


class ProductsListResponse(BaseModel):
    """List of products response."""
    products: List[ProductResponse]
    total: int
    page: int
    page_size: int


class MetadataResponse(BaseModel):
    """Metadata about available filter options."""
    categories: List[str]
    skin_types: List[str]
    concerns: List[str]
    brands: List[str]
    top_ingredients: List[str]
    price_range: Dict[str, float]
    rating_range: Dict[str, float]
    total_products: int


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    version: str
    model_loaded: bool
    products_loaded: int