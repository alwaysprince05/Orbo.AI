"""
Data preprocessing pipeline for Orbo Beauty AI Recommendation System.

This module handles:
- Loading raw datasets
- Cleaning and normalizing data
- Feature engineering (skin_type, skin_concerns, etc.)
- Creating unified product catalog
- Saving processed artifacts for recommendation engine
"""

import pandas as pd
import numpy as np
import re
import json
import ast
from pathlib import Path
from typing import List, Dict, Any, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Skin type keywords for inference from text
SKIN_TYPE_KEYWORDS = {
    'dry': ['dry', 'dehydrat', 'nourish', 'rich cream', 'emollient', 'tight', 'flaky', 'rough'],
    'oily': ['oily', 'oil-control', 'mattify', 'sebum', 'oil-free', 'shine', 'greasy', 'excess oil'],
    'combination': ['combination', 'balanced', 'normal to oily', 'normal to dry', 't-zone', 'combo'],
    'sensitive': ['sensitive', 'soothing', 'calm', 'gentle', 'fragrance-free', 'hypoallergenic', 'reactive', 'irritated', 'redness'],
    'normal': ['normal', 'all skin types', 'daily', 'maintain', 'balance', 'healthy']
}

# Skin concern keywords for inference from text
SKIN_CONCERN_KEYWORDS = {
    'hydration': ['hydrat', 'moistur', 'dehydrat', 'dry', 'dryness', 'tight', 'flaky'],
    'acne': ['acne', 'blemish', 'breakout', 'pimple', 'oil-control', 'purify', 'congestion', 'blackhead', 'whitehead', 'pore'],
    'aging': ['anti-ag', 'wrinkl', 'fine line', 'firm', 'elastic', 'lift', 'sagging', 'elasticity', 'mature'],
    'pigmentation': ['brighten', 'dark spot', 'hyperpigment', 'discolor', 'uneven tone', 'melasma', 'sun spot', 'post-acne'],
    'sensitivity': ['sensitive', 'redness', 'rosacea', 'irritat', 'sooth', 'calm', 'barrier', 'repair', 'reactive'],
    'texture': ['texture', 'pore', 'smooth', 'refine', 'exfoli', 'rough', 'uneven'],
    'sun_protection': ['spf', 'sunscreen', 'uv', 'sun protect', 'broad spectrum', 'uvb', 'uva']
}

# Ingredient-based skin type inference rules
INGREDIENT_SKIN_TYPE_RULES = {
    'oily': ['salicylic acid', 'niacinamide', 'clay', 'charcoal', 'zinc', 'witch hazel', 'tea tree', 'glycolic acid', 'lactic acid', 'mandelic acid', 'sulfur'],
    'dry': ['ceramide', 'hyaluronic acid', 'shea butter', 'squalane', 'glycerin', 'panthenol', 'urea', 'jojoba oil', 'avocado oil', 'rosehip oil', 'marula oil', 'argan oil', 'coconut oil', 'olive oil'],
    'sensitive': ['centella asiatica', 'aloe vera', 'allantoin', 'colloidal oatmeal', 'ceramide', 'panthenol', 'bisabolol', 'chamomile', 'calendula', 'licorice', 'azelaic acid'],
    'combination': ['niacinamide', 'hyaluronic acid', 'glycerin', 'squalane', 'jojoba oil']
}

# Ingredient-based concern inference rules
INGREDIENT_CONCERN_RULES = {
    'acne': ['salicylic acid', 'benzoyl peroxide', 'tea tree', 'niacinamide', 'clay', 'charcoal', 'sulfur', 'zinc', 'retinol', 'azelaic acid', 'glycolic acid'],
    'hydration': ['hyaluronic acid', 'glycerin', 'sodium pca', 'panthenol', 'urea', 'ceramide', 'squalane', 'sodium hyaluronate', 'panthenol', 'hyaluronic'],
    'aging': ['retinol', 'retinal', 'retinaldehyde', 'peptide', 'collagen', 'vitamin c', 'antioxidant', 'coenzyme q10', 'resveratrol', 'ferulic acid', 'bakuchiol', 'growth factor', 'epidermal growth factor', 'niacinamide'],
    'pigmentation': ['vitamin c', 'niacinamide', 'alpha arbutin', 'tranexamic acid', 'kojic acid', 'licorice', 'azelaic acid', 'retinol', 'glycolic acid', 'lactic acid', 'mandelic acid', 'arbutin', 'glabridin'],
    'sensitivity': ['centella asiatica', 'aloe vera', 'allantoin', 'ceramide', 'panthenol', 'bisabolol', 'chamomile', 'calendula', 'licorice', 'oat', 'colloidal oatmeal'],
    'texture': ['glycolic acid', 'lactic acid', 'mandelic acid', 'salicylic acid', 'retinol', 'retinal', 'pha', 'gluconolactone', 'lactobionic acid', 'enzyme', 'papaya', 'pumpkin', 'bha', 'aha'],
    'sun_protection': ['zinc oxide', 'titanium dioxide', 'avobenzone', 'octinoxate', 'octocrylene', 'homosalate', 'octisalate', 'mexoryl', 'tinosorb', 'uv filter', 'sunscreen']
}

# Category normalization mapping
CATEGORY_NORMALIZATION = {
    'moisturiser': 'moisturizer',
    'moisturising': 'moisturizer',
    'moisturizing': 'moisturizer',
    'cream': 'moisturizer',
    'lotion': 'moisturizer',
    'hydrat': 'moisturizer',
    'face cream': 'moisturizer',
    'face lotion': 'moisturizer',
    'body cream': 'moisturizer',
    'body lotion': 'moisturizer',
    'hand cream': 'moisturizer',
    'cleanser': 'cleanser',
    'cleansing': 'cleanser',
    'face wash': 'cleanser',
    'foam': 'cleanser',
    'gel cleanser': 'cleanser',
    'oil cleanser': 'cleanser',
    'makeup remover': 'cleanser',
    'micellar': 'cleanser',
    'serum': 'serum',
    'treatment': 'serum',
    'essence': 'serum',
    'ampoule': 'serum',
    'concentrate': 'serum',
    'sunscreen': 'sunscreen',
    'spf': 'sunscreen',
    'sun protect': 'sunscreen',
    'sun cream': 'sunscreen',
    'toner': 'toner',
    'tonic': 'toner',
    'essence toner': 'toner',
    'exfoli': 'exfoliator',
    'peel': 'exfoliator',
    'scrub': 'exfoliator',
    'mask': 'mask',
    'masque': 'mask',
    'eye cream': 'eye_care',
    'eye serum': 'eye_care',
    'eye treatment': 'eye_care',
    'lip balm': 'lip_care',
    'lip treatment': 'lip_care',
    'oil': 'face_oil',
    'face oil': 'face_oil',
    'body oil': 'body_oil'
}

# Ingredient normalization - map variations to canonical names
INGREDIENT_NORMALIZATION = {
    'vitamin c': ['ascorbic acid', 'l-ascorbic acid', 'sodium ascorbyl phosphate', 'magnesium ascorbyl phosphate', 'ascorbyl glucoside', 'tetrahexyldecyl ascorbate'],
    'niacinamide': ['nicotinamide', 'vitamin b3'],
    'hyaluronic acid': ['sodium hyaluronate', 'hydrolyzed hyaluronic acid', 'hyaluronate'],
    'retinol': ['retinal', 'retinaldehyde', 'retinyl palmitate', 'retinyl acetate', 'vitamin a', 'retinoid'],
    'ceramide': ['ceramide np', 'ceramide ap', 'ceramide eop', 'ceramide ng', 'ceramide ns', 'phytosphingosine'],
    'peptide': ['copper peptide', 'palmitoyl tripeptide', 'palmitoyl pentapeptide', 'acetyl hexapeptide', 'matrixyl'],
    'salicylic acid': ['bha', 'beta hydroxy acid', 'willow bark extract'],
    'glycolic acid': ['aha', 'alpha hydroxy acid'],
    'lactic acid': ['aha', 'alpha hydroxy acid'],
    'azelaic acid': [],
    'tranexamic acid': [],
    'alpha arbutin': ['arbutin'],
    'centella asiatica': ['cica', 'gotu kola', 'centella', 'asiaticoside', 'madecassoside'],
    'aloe vera': ['aloe barbadensis', 'aloe'],
    'shea butter': ['butyrospermum parkii'],
    'squalane': ['squalene'],
    'glycerin': ['glycerol'],
    'panthenol': ['provitamin b5', 'dexpanthenol'],
    'allantoin': [],
    'colloidal oatmeal': ['avena sativa', 'oat kernel extract'],
    'green tea': ['camellia sinensis', 'egcg'],
    'vitamin e': ['tocopherol', 'tocopheryl acetate'],
    'zinc oxide': [],
    'titanium dioxide': [],
    'fragrance': ['parfum', 'perfume', 'aroma'],
    'essential oil': ['lavender oil', 'tea tree oil', 'rose oil', 'citrus oil'],
    'alcohol': ['denatured alcohol', 'ethanol', 'isopropyl alcohol', 'sd alcohol'],
    'paraben': ['methylparaben', 'propylparaben', 'butylparaben', 'ethylparaben'],
    'sulfate': ['sodium lauryl sulfate', 'sodium laureth sulfate', 'sls', 'sles'],
    'silicone': ['dimethicone', 'cyclomethicone', 'cyclohexasiloxane', 'phenyl trimethicone'],
    'mineral oil': ['paraffinum liquidum', 'petrolatum'],
    'urea': ['hydroxyethyl urea'],
    'lactobionic acid': ['pha'],
    'gluconolactone': ['pha'],
    'bakuchiol': [],
    'snail mucin': ['snail secretion filtrate'],
    'propolis': [],
    'honey': [],
    'rice extract': ['rice water', 'oryza sativa'],
    'licorice root': ['glycyrrhiza glabra', 'glabridin'],
    'kojic acid': [],
    'mandelic acid': ['aha'],
    'polyglutamic acid': [],
    'beta glucan': [],
    'madecassoside': [],
    'asiaticoside': [],
    'epigallocatechin gallate': ['egcg', 'green tea extract'],
    'resveratrol': [],
    'ferulic acid': [],
    'coenzyme q10': ['ubiquinone'],
    'astaxanthin': [],
    'marine collagen': ['collagen', 'hydrolyzed collagen'],
    'elastin': [],
    'growth factors': [],
    'stem cells': [],
    'exosomes': []
}

# Build reverse mapping for ingredient normalization
INGREDIENT_CANONICAL = {}
for canonical, variants in INGREDIENT_NORMALIZATION.items():
    INGREDIENT_CANONICAL[canonical.lower()] = canonical.lower()
    for v in variants:
        INGREDIENT_CANONICAL[v.lower()] = canonical.lower()


def infer_skin_types_from_ingredients(ingredients: List[str]) -> List[str]:
    """Infer skin types from ingredient list."""
    if not isinstance(ingredients, list) or not ingredients:
        return []
    
    ing_lower = [str(i).lower() for i in ingredients]
    matched = set()
    
    for skin_type, rule_ingredients in INGREDIENT_SKIN_TYPE_RULES.items():
        for rule_ing in rule_ingredients:
            if any(rule_ing in ing for ing in ing_lower):
                matched.add(skin_type)
                break
    
    return list(matched)


def infer_skin_concerns_from_ingredients(ingredients: List[str]) -> List[str]:
    """Infer skin concerns from ingredient list."""
    if not isinstance(ingredients, list) or not ingredients:
        return []
    
    ing_lower = [str(i).lower() for i in ingredients]
    matched = set()
    
    for concern, rule_ingredients in INGREDIENT_CONCERN_RULES.items():
        for rule_ing in rule_ingredients:
            if any(rule_ing in ing for ing in ing_lower):
                matched.add(concern)
                break
    
    return list(matched)


def infer_skin_types_from_text(text: str) -> List[str]:
    """Infer skin types from product text (name, description, ingredients)."""
    if pd.isna(text):
        return ['all']
    text = str(text).lower()
    matched = []
    for skin_type, keywords in SKIN_TYPE_KEYWORDS.items():
        if any(kw in text for kw in keywords):
            matched.append(skin_type)
    return matched if matched else ['all']


def infer_skin_concerns_from_text(text: str) -> List[str]:
    """Infer skin concerns from product text."""
    if pd.isna(text):
        return []
    text = str(text).lower()
    matched = []
    for concern, keywords in SKIN_CONCERN_KEYWORDS.items():
        if any(kw in text for kw in keywords):
            matched.append(concern)
    return matched


def normalize_category(category: str) -> str:
    """Normalize product category to standard categories."""
    if pd.isna(category):
        return 'other'
    category = str(category).lower().strip()
    for canonical, keywords in CATEGORY_NORMALIZATION.items():
        if canonical in category or category in canonical:
            return keywords
    # Check if any keyword matches
    for keyword, canonical in CATEGORY_NORMALIZATION.items():
        if keyword in category:
            return canonical
    return 'other'


def normalize_ingredients(ingredients) -> List[str]:
    """Normalize ingredient list to canonical names."""
    if ingredients is None:
        return []
    if isinstance(ingredients, (list, tuple)) and len(ingredients) == 0:
        return []
    
    # Handle pandas NA
    try:
        if pd.isna(ingredients) and not isinstance(ingredients, (list, tuple, np.ndarray)):
            return []
    except (ValueError, TypeError):
        pass
    
    # Handle different input formats
    if isinstance(ingredients, str):
        # Try to parse as list literal
        try:
            ingredients = ast.literal_eval(ingredients)
        except (ValueError, SyntaxError):
            # Split by common delimiters
            ingredients = re.split(r'[,;|]', ingredients)
    elif not isinstance(ingredients, (list, tuple)):
        return []
    
    normalized = []
    for ing in ingredients:
        if pd.isna(ing):
            continue
        ing_clean = str(ing).lower().strip()
        # Remove concentration info in parentheses
        ing_clean = re.sub(r'\([^)]*\)', '', ing_clean).strip()
        # Remove numbers and special chars at start/end
        ing_clean = re.sub(r'^[0-9\s\-\.]+|[0-9\s\-\.]+$', '', ing_clean)
        if not ing_clean:
            continue
        # Map to canonical
        canonical = INGREDIENT_CANONICAL.get(ing_clean, ing_clean)
        normalized.append(canonical)
    
    # Deduplicate while preserving order
    seen = set()
    result = []
    for ing in normalized:
        if ing not in seen:
            seen.add(ing)
            result.append(ing)
    return result


def parse_price(price) -> Optional[float]:
    """Parse price to USD float."""
    if price is None:
        return None
    price_str = str(price).strip()
    if not price_str:
        return None
    # Remove currency symbols and text
    price_str = re.sub(r'[^0-9\.]', '', price_str)
    # Extract first number
    match = re.search(r'([0-9]+\.?[0-9]*)', price_str)
    if match:
        return float(match.group(1))
    return None


def estimate_price_usd(price_gbp: Optional[float], category: str) -> float:
    """Estimate USD price from GBP or use category-based defaults."""
    if price_gbp is not None:
        return round(price_gbp * 1.27, 2)  # Approximate GBP to USD
    
    # Category-based default prices (USD)
    defaults = {
        'cleanser': 25.0,
        'moisturizer': 35.0,
        'serum': 45.0,
        'sunscreen': 30.0,
        'toner': 20.0,
        'exfoliator': 30.0,
        'mask': 25.0,
        'eye_care': 40.0,
        'lip_care': 15.0,
        'face_oil': 40.0,
        'body_oil': 25.0,
        'other': 30.0
    }
    return defaults.get(category, 30.0)


def generate_synthetic_rating(category: str, ingredients: List[str]) -> float:
    """Generate a realistic synthetic rating based on category and ingredients."""
    # Handle non-list ingredients
    if not isinstance(ingredients, list):
        ingredients = []
    
    np.random.seed(hash(str(category) + str(sorted(ingredients)[:5])) % 2**32)
    
    # Base rating by category
    base_ratings = {
        'cleanser': 4.2,
        'moisturizer': 4.3,
        'serum': 4.4,
        'sunscreen': 4.1,
        'toner': 4.0,
        'exfoliator': 4.2,
        'mask': 4.1,
        'eye_care': 4.3,
        'lip_care': 4.2,
        'face_oil': 4.2,
        'body_oil': 4.1,
        'other': 4.0
    }
    base = base_ratings.get(category, 4.0)
    
    # Bonus for beneficial ingredients
    beneficial = ['ceramide', 'hyaluronic acid', 'niacinamide', 'retinol', 'vitamin c', 'peptide', 'centella asiatica']
    bonus = sum(0.05 for ing in ingredients if any(b in ing for b in beneficial))
    
    # Small random variation
    rating = base + bonus + np.random.normal(0, 0.15)
    return round(np.clip(rating, 3.0, 5.0), 1)


def generate_synthetic_review_count(rating: float) -> int:
    """Generate synthetic review count correlated with rating."""
    np.random.seed(int(rating * 1000) % 2**32)
    # Higher rated products tend to have more reviews
    base = 100 + (rating - 3.0) * 500
    count = int(base * np.random.lognormal(0, 1))
    return min(max(count, 10), 10000)


def create_product_text_representation(row: pd.Series) -> str:
    """Create normalized text representation for TF-IDF."""
    parts = []
    
    # Product name
    if pd.notna(row.get('product_name')):
        parts.append(str(row['product_name']).lower())
    
    # Category
    if pd.notna(row.get('category')):
        parts.append(str(row['category']).lower())
    
    # Brand
    if pd.notna(row.get('brand')):
        parts.append(str(row['brand']).lower())
    
    # Skin types
    skin_types = row.get('skin_types')
    if skin_types is not None:
        if isinstance(skin_types, list):
            parts.extend([str(s).lower() for s in skin_types])
        else:
            parts.append(str(skin_types).lower())
    
    # Skin concerns
    skin_concerns = row.get('skin_concerns')
    if skin_concerns is not None:
        if isinstance(skin_concerns, list):
            parts.extend([str(s).lower() for s in skin_concerns])
        else:
            parts.append(str(skin_concerns).lower())
    
    # Ingredients
    ingredients = row.get('ingredients_normalized')
    if ingredients is not None:
        if isinstance(ingredients, list):
            parts.extend([str(s).lower() for s in ingredients])
        else:
            parts.append(str(ingredients).lower())
    
    # Description
    if pd.notna(row.get('description')):
        parts.append(str(row['description']).lower())
    
    return ' '.join(parts)


def extract_brand_from_name(product_name: str) -> str:
    """Extract brand from product name (first word or known brands)."""
    known_brands = [
        'cerave', 'the ordinary', 'la roche-posay', 'la roche posay', 'vichy', 'avene', 'eucerin',
        'neutrogena', 'clinique', 'origins', 'kiehls', "kiehl's",
        'drunk elephant', 'glow recipe', 'tatcha', 'farmacy', 'herbivore',
        "paula's choice", 'paulas choice', 'skinceuticals', 'skinmedica',
        'dermalogica', 'peter thomas roth', 'ole henriksen',
        'fresh', 'belif', 'first aid beauty', 'biossance', 'youth to the people',
        'versio', 'niod', 'deciem', 'hylamide', 'the inkey list', 'inkey list',
        'good molecules', 'naturium', 'maelove', 'geologie',
        'curology', 'apostrophe', 'hims', 'hers', 'yves rocher',
        'embryolisse', 'bioderma', 'uriage', 'svr', 'filorga', 'nuxe', 'caudalie',
        'clarins', 'sisley', 'chantecaille', 'dior', 'chanel', 'lancome', 'shiseido',
        'sulwhasoo', 'laneige', 'innisfree', 'etude house',
        'cosrx', 'dear klairs', 'klairs', 'some by mi', 'benton', 'purito',
        'iunik', 'mizon', 'secret key', 'tonymoly', 'tony moly',
        'missha', 'nature republic', 'holika holika', 'skinfood',
        'the face shop', 'face shop', 'etude',
        'hadalabo', 'rada labo', 'rohto', 'mentholatum',
        'kose', 'sekka', 'albion', 'kanebo', 'suqqu', 'cle de peau',
        'anessa', 'biore', 'kao', 'suntory', 'dove', 'nivea', 'aveeno',
        'cetaphil', 'aquaphor', 'lubriderm', 'jergens', 'st. ives',
        'clean and clear', 'olay', 'ponds', "pond's", 'loreal', "l'oreal", 'loreal paris', 'maybelline', 'nyx', 'revlon',
        'covergirl', 'elf', 'e.l.f.', 'wet n wild', 'bh cosmetics',
        'colourpop', 'anastasia beverly hills', 'huda beauty',
        'fenty beauty', 'rare beauty', 'kylie cosmetics',
        'too faced', 'urban decay', 'benefit',
        'tarte', 'it cosmetics', 'bareminerals', 'laura mercier',
        'hourglass', 'charlotte tilbury', 'pat mcgrath', 'vieve', 'victoria beckham',
        'rose inc', 'merit', 'jones road', 'ilk', 'glossier',
        'milk makeup', 'tower 28', 'kosas', 'saie', 'westman atelier',
        'summer fridays', 'dr. barbara sturm', 'augustinus bader', 'bader', '111skin',
        'natura bisse', 'valmont', 'la mer', 'la prairie',
        'sisley', 'chantecaille', 'dior', 'chanel', 'guerlain', 'givenchy', 'ysl',
        'armani beauty', 'tom ford', 'bobbi brown', 'trish mcevoy', 'laura geller',
        'jane iredale', 'mineral fusion', 'physicians formula',
        'almay', 'cover fx', 'juice beauty', 'iliam',
        'rms beauty', 'kjaer weis', 'erborian',
        'touch in sol', 'peach slices',
        'revolution', 'makeup revolution', 'essence', 'catrice',
        'garnier', 'burts bees', 'burts',
        'the body shop', 'lush', 'mac', 'm.a.c.',
        'smashbox', 'bare minerals',
        'bareminerals', 'smash', 'smashbox',
        'dior', 'chanel', 'dior', 'chanel',
        'drunk elephant', 'drunk', 'glow recipe', 'glow',
        'tatcha', 'farmacy', 'herbivore',
        'paulas choice', 'skinceuticals', 'skinmedica',
        'obagi', 'revision', 'sente', 'isclinical',
        'dermalogica', 'peter thomas roth', 'ole henriksen',
        'fresh', 'belif', 'first aid beauty', 'biossance', 'youth to the people',
        'verso', 'niod', 'deciem', 'hylamide', 'the inkey list',
        'good molecules', 'naturium', 'maelove', 'geologie',
        'curology', 'apostrophe', 'hims', 'hers',
        'yves rocher', 'embryolisse', 'bioderma', 'uriage',
        'svr', 'filorga', 'nuxe', 'caudalie',
        'clarins', 'sisley', 'chantecaille', 'dior',
        'sulwhasoo', 'laneige', 'innisfree', 'etude house',
        'cosrx', 'dear klairs', 'klairs', 'some by mi', 'benton', 'purito',
        'iunik', 'mizon', 'secret key', 'tonymoly', 'tony moly',
        'missha', 'nature republic', 'holika holika', 'skinfood',
        'the face shop', 'face shop', 'etude',
        'hadalabo', 'rada labo', 'rohto', 'mentholatum',
        'kose', 'sekka', 'albion', 'kanebo', 'suqqu', 'cle de peau',
        'anessa', 'biore', 'kao', 'suntory',
        'dove', 'nivea', 'aveeno', 'cetaphil',
        'aquaphor', 'lubriderm', 'jergens', 'st. ives',
        'clean and clear', 'neutrogena', 'olay', 'ponds', "pond's",
        'loreal', "l'oreal", 'loreal paris', 'vichy', 'la roche posay',
        'la roche-posay', 'cerave', 'cera ve', 'cetaphil', 'eucerin',
        'aquaphor', 'aveeno', 'neutrogena', 'olay', 'ponds', "pond's",
        'nivea', 'dove', 'jergens', 'lubriderm', 'st. ives',
        'clean and clear', 'burts bees', 'burts',
        'the body shop', 'lush', 'mac', 'm.a.c.',
        'smashbox', 'smash', 'benefit',
        'too faced', 'urban decay', 'tarte', 'it cosmetics',
        'bareminerals', 'bare minerals', 'laura mercier', 'laura',
        'hourglass', 'charlotte tilbury', 'charlotte', 'pat mcgrath', 'pat',
        'vieve', 'victoria beckham', 'victoria', 'rose inc', 'rose',
        'merit', 'jones road', 'jones', 'ilk', 'glossier',
        'milk makeup', 'milk', 'tower 28', 'tower', 'kosas', 'saie',
        'westman atelier', 'westman', 'summer fridays', 'summer',
        'dr. barbara sturm', 'dr barbara sturm', 'barbara sturm',
        'augustinus bader', 'augustinus', 'bader', '111skin', '111 skin',
        'natura bisse', 'valmont', 'la mer', 'la prairie', 'la prairie',
        'sisley', 'chantecaille', 'dior', 'chanel', 'guerlain', 'givenchy',
        'ysl', 'ysl beauty', 'armani beauty', 'armani', 'tom ford',
        'tom ford beauty', 'bobbi brown', 'bobbi', 'trish mcevoy', 'trish',
        'laura geller', 'laura', 'jane iredale', 'jane', 'mineral fusion', 'mineral',
        'physicians formula', 'physicians', 'almay', 'cover fx', 'juice beauty', 'juice',
        'iliam', 'rms beauty', 'rms', 'kjaer weis', 'kjaer', 'erborian',
        'touch in sol', 'touch', 'peach slices', 'peach',
        'revolution', 'makeup revolution', 'essence', 'catrice'
    ]
    
    name_lower = str(product_name).lower()
    for brand in sorted(known_brands, key=len, reverse=True):
        if brand in name_lower:
            return brand.title()
    
    # Fallback: first word
    words = name_lower.split()
    if words:
        return words[0].title()
    return 'Unknown'


def infer_skin_types_combined(product_name: str, ingredients: List[str], categories: str = '') -> List[str]:
    """Combine multiple sources for skin type inference."""
    # Start with ingredient-based inference (most reliable)
    ing_types = infer_skin_types_from_ingredients(ingredients)
    
    # Add text-based inference
    text = f"{product_name} {categories}"
    text_types = infer_skin_types_from_text(text)
    
    # Combine
    all_types = set(ing_types) | set(text_types)
    return list(all_types) if all_types else ['all']


def infer_skin_concerns_combined(product_name: str, ingredients: List[str], categories: str = '') -> List[str]:
    """Combine multiple sources for concern inference."""
    # Start with ingredient-based inference (most reliable)
    ing_concerns = infer_skin_concerns_from_ingredients(ingredients)
    
    # Add text-based inference
    text = f"{product_name} {categories}"
    text_concerns = infer_skin_concerns_from_text(text)
    
    # Combine
    all_concerns = set(ing_concerns) | set(text_concerns)
    return list(all_concerns)


def load_and_process_kaggle(filepath: str) -> pd.DataFrame:
    """Load and process Kaggle clean skincare dataset."""
    logger.info(f"Loading Kaggle dataset from {filepath}")
    df = pd.read_csv(filepath)
    
    processed = pd.DataFrame()
    processed['product_id'] = [f"kaggle_{i}" for i in range(len(df))]
    processed['product_name'] = df['product_name']
    processed['brand'] = df['product_name'].apply(extract_brand_from_name)
    processed['category'] = df['product_type'].apply(normalize_category)
    processed['price_usd'] = df['price'].apply(parse_price).apply(lambda x: estimate_price_usd(x, 'moisturizer'))
    processed['ingredients_raw'] = df['clean_ingreds']
    processed['ingredients_normalized'] = df['clean_ingreds'].apply(normalize_ingredients)
    processed['source'] = 'kaggle'
    
    # Infer skin types and concerns from ingredients and product name
    processed['skin_types'] = processed.apply(
        lambda r: infer_skin_types_combined(r['product_name'], r['ingredients_normalized'], r['category']), axis=1
    )
    processed['skin_concerns'] = processed.apply(
        lambda r: infer_skin_concerns_combined(r['product_name'], r['ingredients_normalized'], r['category']), axis=1
    )
    
    # Generate synthetic ratings and review counts
    processed['rating'] = processed.apply(lambda r: generate_synthetic_rating(r['category'], r['ingredients_normalized']), axis=1)
    processed['review_count'] = processed['rating'].apply(generate_synthetic_review_count)
    
    # Create description from ingredients
    processed['description'] = processed.apply(
        lambda r: f"This {r['category']} contains {', '.join(r['ingredients_normalized'][:10])}" if isinstance(r['ingredients_normalized'], list) and len(r['ingredients_normalized']) > 0 else "",
        axis=1
    )
    
    # Create text representation for TF-IDF
    processed['text_representation'] = processed.apply(create_product_text_representation, axis=1)
    
    logger.info(f"Processed {len(processed)} products from Kaggle")
    return processed


def load_and_process_obf(filepath: str) -> pd.DataFrame:
    """Load and process Open Beauty Facts skincare dataset."""
    logger.info(f"Loading OBF dataset from {filepath}")
    df = pd.read_csv(filepath, sep='\t', low_memory=False)
    
    # Filter products with ingredients
    df = df[df['ingredients_text'].notna()].copy()
    
    processed = pd.DataFrame()
    processed['product_id'] = [f"obf_{i}" for i in range(len(df))]
    processed['product_name'] = df['product_name']
    processed['brand'] = df['brands'].fillna('Unknown').apply(lambda x: str(x).split(',')[0].strip().title())
    processed['category'] = df['main_category'].apply(normalize_category)
    processed['price_usd'] = df.apply(lambda r: estimate_price_usd(None, r['main_category']), axis=1)
    processed['ingredients_raw'] = df['ingredients_text']
    processed['ingredients_normalized'] = df['ingredients_text'].apply(normalize_ingredients)
    processed['source'] = 'openbeautyfacts'
    
    # Infer skin types and concerns from categories and ingredients
    processed['skin_types'] = processed.apply(
        lambda r: infer_skin_types_combined(r['product_name'], r['ingredients_normalized'], r['category']), axis=1
    )
    processed['skin_concerns'] = processed.apply(
        lambda r: infer_skin_concerns_combined(r['product_name'], r['ingredients_normalized'], r['category']), axis=1
    )
    
    # Generate synthetic ratings
    processed['rating'] = processed.apply(lambda r: generate_synthetic_rating(r['category'], r['ingredients_normalized']), axis=1)
    processed['review_count'] = processed['rating'].apply(generate_synthetic_review_count)
    
    # Description from categories
    processed['description'] = df['categories_en'].fillna('').apply(lambda x: str(x).replace(',', ' '))
    
    # Create text representation
    processed['text_representation'] = processed.apply(create_product_text_representation, axis=1)
    
    logger.info(f"Processed {len(processed)} products from OBF")
    return processed


def merge_datasets(kaggle_df: pd.DataFrame, obf_df: pd.DataFrame) -> pd.DataFrame:
    """Merge and deduplicate datasets."""
    logger.info("Merging datasets...")
    
    # Combine
    combined = pd.concat([kaggle_df, obf_df], ignore_index=True)
    
    # Deduplicate by product name similarity (simple approach)
    combined['name_key'] = combined['product_name'].str.lower().str.replace(r'[^a-z0-9]', '', regex=True)
    combined = combined.drop_duplicates(subset='name_key', keep='first')
    combined = combined.drop(columns=['name_key'])
    
    # Reset product IDs
    combined['product_id'] = [f"prod_{i:06d}" for i in range(len(combined))]
    
    logger.info(f"Merged dataset size: {len(combined)}")
    return combined


def save_processed_data(df: pd.DataFrame, output_dir: str):
    """Save processed data and artifacts."""
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Save full processed dataset
    df.to_parquet(output_path / 'products_processed.parquet', index=False)
    df.to_csv(output_path / 'products_processed.csv', index=False)
    
    # Save sample for repository
    sample = df.head(100)
    sample.to_csv(output_path / 'sample_100.csv', index=False)
    
    # Save metadata
    metadata = {
        'total_products': len(df),
        'categories': df['category'].value_counts().to_dict(),
        'brands': df['brand'].value_counts().head(50).to_dict(),
        'skin_types_distribution': {},
        'skin_concerns_distribution': {},
        'price_stats': {
            'min': float(df['price_usd'].min()),
            'max': float(df['price_usd'].max()),
            'mean': float(df['price_usd'].mean()),
            'median': float(df['price_usd'].median())
        },
        'rating_stats': {
            'min': float(df['rating'].min()),
            'max': float(df['rating'].max()),
            'mean': float(df['rating'].mean()),
            'median': float(df['rating'].median())
        },
        'sources': df['source'].value_counts().to_dict()
    }
    
    # Calculate skin type/concern distributions
    all_skin_types = []
    all_concerns = []
    for _, row in df.iterrows():
        if isinstance(row['skin_types'], list):
            all_skin_types.extend(row['skin_types'])
        if isinstance(row['skin_concerns'], list):
            all_concerns.extend(row['skin_concerns'])
    
    metadata['skin_types_distribution'] = pd.Series(all_skin_types).value_counts().to_dict()
    metadata['skin_concerns_distribution'] = pd.Series(all_concerns).value_counts().to_dict()
    
    with open(output_path / 'dataset_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    logger.info(f"Saved processed data to {output_path}")


def main():
    """Main preprocessing pipeline."""
    raw_dir = Path('/Users/princemaurya/orbo-beauty-recommender/data/raw')
    processed_dir = Path('/Users/princemaurya/orbo-beauty-recommender/data/processed')
    
    # Load and process both datasets
    kaggle_df = load_and_process_kaggle(raw_dir / 'skincare_products_clean.csv')
    obf_df = load_and_process_obf(raw_dir / 'openbeautyfacts_skincare.csv')
    
    # Merge
    combined_df = merge_datasets(kaggle_df, obf_df)
    
    # Save
    save_processed_data(combined_df, processed_dir)
    
    print(f"\n✅ Preprocessing complete!")
    print(f"Total products: {len(combined_df)}")
    print(f"Categories: {combined_df['category'].nunique()}")
    print(f"Brands: {combined_df['brand'].nunique()}")
    print(f"Price range: ${combined_df['price_usd'].min():.2f} - ${combined_df['price_usd'].max():.2f}")
    print(f"Rating range: {combined_df['rating'].min():.1f} - {combined_df['rating'].max():.1f}")
    print(f"\nSkin types distribution:")
    all_st = []
    for st in combined_df['skin_types']:
        if isinstance(st, list):
            all_st.extend(st)
    print(pd.Series(all_st).value_counts().to_string())
    print(f"\nSkin concerns distribution:")
    all_sc = []
    for sc in combined_df['skin_concerns']:
        if isinstance(sc, list):
            all_sc.extend(sc)
    print(pd.Series(all_sc).value_counts().to_string())


if __name__ == '__main__':
    main()
