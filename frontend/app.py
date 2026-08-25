"""
Streamlit frontend for Orbo Beauty AI Recommendation System.
"""

import streamlit as st
import pandas as pd
import requests
import json
from pathlib import Path

# Configuration
API_URL = "http://localhost:8000/api/v1"

st.set_page_config(
    page_title="Orbo Beauty AI - Personalized Skincare Recommendations",
    page_icon="✨",
    layout="wide"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        text-align: center;
        margin-bottom: 1rem;
        background: linear-gradient(90deg, #FF6B6B, #4ECDC4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .subtitle {
        text-align: center;
        color: #666;
        margin-bottom: 2rem;
    }
    .product-card {
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 1rem;
        background-color: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .match-score {
        font-size: 1.5rem;
        font-weight: bold;
        color: #4ECDC4;
    }
    .reason-item {
        margin: 0.25rem 0;
        padding-left: 1rem;
    }
    .warning-item {
        margin: 0.25rem 0;
        padding-left: 1rem;
        color: #f39c12;
    }
</style>
""", unsafe_allow_html=True)

# Header
st.markdown('<h1 class="main-header">Orbo Beauty AI</h1>', unsafe_allow_html=True)
st.markdown('<p class="subtitle">Personalized Beauty Product Recommendation Engine</p>', unsafe_allow_html=True)
st.markdown("---")

# Sidebar for inputs
with st.sidebar:
    st.header("Your Preferences")
    
    # Get metadata
    try:
        metadata = requests.get(f"{API_URL}/metadata", timeout=10).json()
        categories = metadata.get('categories', [])
        skin_types = metadata.get('skin_types', [])
        concerns = metadata.get('concerns', [])
    except:
        categories = ['moisturizer', 'cleanser', 'serum', 'sunscreen', 'toner', 'exfoliator', 'mask', 'eye_care', 'lip_care', 'face_oil', 'body_oil']
        skin_types = ['dry', 'oily', 'combination', 'normal', 'sensitive']
        concerns = ['hydration', 'acne', 'aging', 'pigmentation', 'sensitivity', 'texture', 'sun_protection']
    
    # Skin Type
    skin_type = st.selectbox(
        "Skin Type",
        options=[None] + skin_types,
        format_func=lambda x: "Not specified" if x is None else x.capitalize()
    )
    
    # Concerns (multi-select)
    selected_concerns = st.multiselect(
        "Skin Concerns",
        options=concerns,
        help="Select all concerns you want to address"
    )
    
    # Category
    category = st.selectbox(
        "Product Category",
        options=[None] + categories,
        format_func=lambda x: "All categories" if x is None else x.replace('_', ' ').title()
    )
    
    # Budget
    budget = st.number_input(
        "Maximum Budget (USD)",
        min_value=0,
        max_value=1000,
        value=0,
        step=10,
        help="Set to 0 for no budget limit"
    )
    budget = None if budget == 0 else budget
    
    # Preferred ingredients
    preferred_ingredients = st.text_input(
        "Preferred Ingredients (comma-separated)",
        value="",
        help="e.g., ceramide, hyaluronic acid, salicylic acid"
    )
    preferred_ingredients = [ing.strip() for ing in preferred_ingredients.split(',') if ing.strip()] if preferred_ingredients else []
    
    # Avoid ingredients
    avoid_ingredients = st.text_input(
        "Ingredients to Avoid (comma-separated)",
        value="",
        help="e.g., fragrance, alcohol, essential oils"
    )
    avoid_ingredients = [ing.strip() for ing in avoid_ingredients.split(',') if ing.strip()] if avoid_ingredients else []
    
    # Top K
    top_k = st.slider(
        "Number of Recommendations",
        min_value=1,
        max_value=20,
        value=5
    )

# Main content
st.header("Get Personalized Recommendations")

if st.button("✨ Get Recommendations", type="primary", use_container_width=True):
    # Build request
    request_data = {
        "skin_type": skin_type,
        "concerns": selected_concerns,
        "category": category,
        "budget": budget,
        "preferred_ingredients": preferred_ingredients,
        "avoid_ingredients": avoid_ingredients,
        "top_k": top_k
    }
    
    with st.spinner("Finding your perfect products..."):
        try:
            response = requests.post(f"{API_URL}/recommend", json=request_data, timeout=30)
            response.raise_for_status()
            result = response.json()
            
            # Show message
            if result.get('is_fallback'):
                st.info(f"ℹ️ {result.get('fallback_message', 'Showing alternative matches')}")
            
            st.success(f"{result.get('message', 'Recommendations found!')} (from {result.get('total_candidates', 0)} candidates)")
            
            # Display recommendations
            recommendations = result.get('recommendations', [])
            
            if not recommendations:
                st.warning("No recommendations found. Try relaxing your preferences.")
            else:
                # Show top recommendations as cards
                for i, rec in enumerate(recommendations, 1):
                    with st.container():
                        st.markdown(f'<div class="product-card">', unsafe_allow_html=True)
                        
                        # Header row
                        col1, col2, col3 = st.columns([3, 1, 1])
                        
                        with col1:
                            st.subheader(f"{i}. {rec['name']}")
                            st.markdown(f"**{rec['brand']}** | {rec['category'].replace('_', ' ').title()}")
                        
                        with col2:
                            st.markdown(f'<div class="match-score">{rec["match_percentage"]}%</div>', unsafe_allow_html=True)
                            st.caption("Match Score")
                        
                        with col3:
                            st.markdown(f"**${rec['price']:.2f}**")
                            st.markdown(f"⭐ {rec['rating']}/5 ({rec['review_count']} reviews)")
                        
                        # Reasons
                        if rec.get('reasons'):
                            st.markdown("**Why recommended:**")
                            for reason in rec['reasons']:
                                st.markdown(f'<div class="reason-item">✓ {reason}</div>', unsafe_allow_html=True)
                        
                        # Warnings
                        if rec.get('warnings'):
                            st.markdown("**Notes:**")
                            for warning in rec['warnings']:
                                st.markdown(f'<div class="warning-item">⚠️ {warning}</div>', unsafe_allow_html=True)
                        
                        # Score breakdown (collapsible)
                        with st.expander("Score Breakdown"):
                            breakdown = rec.get('score_breakdown', {})
                            if breakdown:
                                for key, value in breakdown.items():
                                    st.metric(key.replace('_', ' ').title(), f"{value:.1%}")
                        
                        st.markdown('</div>', unsafe_allow_html=True)
                        
                        if i < len(recommendations):
                            st.markdown("---")
                            
        except requests.exceptions.ConnectionError:
            st.error("⚠️ Could not connect to the API. Please make sure the backend is running.")
            st.info("Run: `uvicorn app.main:app --reload`")
        except Exception as e:
            st.error(f"Error: {str(e)}")

# About section
with st.expander("About Orbo Beauty AI"):
    st.markdown("""
    ## Orbo Beauty AI - Personalized Recommendation Engine
    
    This is an AI-powered personalized beauty product recommendation system that helps you
    discover skincare products tailored to your unique needs.
    
    ### How it works:
    1. **Hybrid Filtering**: We filter products based on your hard constraints (budget, ingredients to avoid)
    2. **Content-Based Similarity**: TF-IDF + cosine similarity to match your preferences with product formulations
    3. **Preference Scoring**: Multiple factor scoring including skin type, concerns, ingredients, and budget fit
    4. **Diversity**: Maximal Marginal Relevance (MMR) ensures varied brand and ingredient selection
    5. **Explainability**: Every recommendation comes with clear explanations of why it matches
    
    ### Technology Stack:
    - FastAPI backend
    - TF-IDF + Cosine Similarity for content matching
    - Weighted hybrid scoring
    - Streamlit for the user interface
    
    ### Note:
    Recommendations are for product discovery purposes and are not medical advice.
    """)

# Footer
st.markdown("---")
st.caption("Orbo Beauty AI - Built for the Orbo AI Technical Assignment")