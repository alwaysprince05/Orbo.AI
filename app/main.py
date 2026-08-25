"""
Main FastAPI application for Orbo Beauty AI Recommendation System.
"""

import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router, set_recommender
from app.recommender import build_recommender

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Configuration
PRODUCTS_PATH = os.getenv("PRODUCTS_PATH", "data/processed/products_processed.parquet")
MODEL_PATH = os.getenv("MODEL_PATH", "data/processed/content_model.joblib")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    global recommender
    
    # Startup
    logger.info("Starting Orbo Beauty AI Recommendation System...")
    logger.info(f"Loading products from {PRODUCTS_PATH}")
    logger.info(f"Loading model from {MODEL_PATH}")
    
    try:
        recommender = build_recommender(PRODUCTS_PATH, MODEL_PATH)
        set_recommender(recommender)
        logger.info("Recommender initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize recommender: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down...")


app = FastAPI(
    title="Orbo Beauty AI - Personalized Beauty Product Recommendation Engine",
    description="AI-powered personalized beauty product recommendations based on skin type, concerns, preferences, and budget.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router, prefix="/api/v1")


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "Orbo Beauty AI Recommendation Engine",
        "version": "1.0.0",
        "description": "Personalized beauty product recommendations",
        "docs": "/docs",
        "health": "/api/v1/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)