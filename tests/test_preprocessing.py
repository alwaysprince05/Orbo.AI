"""
Tests for preprocessing pipeline.
"""

import pytest
import sys

sys.path.insert(0, '/Users/princemaurya/orbo-beauty-recommender')

from app.utils.preprocessing import (
    normalize_category,
    normalize_ingredients,
    parse_price,
    infer_skin_types_from_ingredients,
    infer_skin_concerns_from_ingredients,
    extract_brand_from_name
)


class TestNormalizeCategory:
    """Tests for category normalization."""
    
    def test_moisturizer_variants(self):
        assert normalize_category("moisturiser") == "moisturizer"
        assert normalize_category("moisturizing") == "moisturizer"
        assert normalize_category("face cream") == "moisturizer"
    
    def test_cleanser_variants(self):
        assert normalize_category("cleansing") == "cleanser"
        assert normalize_category("face wash") == "cleanser"
        assert normalize_category("cleanser") == "cleanser"
    
    def test_serum_variants(self):
        assert normalize_category("serum") == "serum"
        assert normalize_category("treatment") == "serum"
        assert normalize_category("essence") == "serum"
    
    def test_sunscreen_variants(self):
        assert normalize_category("sunscreen") == "sunscreen"
        assert normalize_category("spf") == "sunscreen"
    
    def test_unknown_category(self):
        assert normalize_category("unknown") == "other"
    
    def test_none_category(self):
        assert normalize_category(None) == "other"


class TestNormalizeIngredients:
    """Tests for ingredient normalization."""
    
    def test_vitamin_c_variants(self):
        result = normalize_ingredients(["ascorbic acid"])
        assert "vitamin c" in result
    
    def test_hyaluronic_acid_variants(self):
        result = normalize_ingredients(["sodium hyaluronate"])
        assert "hyaluronic acid" in result
    
    def test_ceramide_variants(self):
        result = normalize_ingredients(["ceramide np", "ceramide ap"])
        assert "ceramide" in result
    
    def test_empty_list(self):
        assert normalize_ingredients([]) == []
    
    def test_none_input(self):
        assert normalize_ingredients(None) == []
    
    def test_string_input(self):
        result = normalize_ingredients("glycerin, water")
        assert len(result) > 0


class TestParsePrice:
    """Tests for price parsing."""
    
    def test_gbp_price(self):
        result = parse_price("£5.20")
        assert result == 5.20
    
    def test_usd_price(self):
        result = parse_price("$10.99")
        assert result == 10.99
    
    def test_plain_number(self):
        result = parse_price("25")
        assert result == 25
    
    def test_none_price(self):
        assert parse_price(None) is None
    
    def test_empty_string(self):
        assert parse_price("") is None


class TestSkinTypeInference:
    """Tests for skin type inference from ingredients."""
    
    def test_oily_skin_ingredients(self):
        result = infer_skin_types_from_ingredients(["salicylic acid", "niacinamide"])
        assert "oily" in result
    
    def test_dry_skin_ingredients(self):
        result = infer_skin_types_from_ingredients(["ceramide", "hyaluronic acid"])
        assert "dry" in result
    
    def test_sensitive_skin_ingredients(self):
        result = infer_skin_types_from_ingredients(["centella asiatica", "aloe vera"])
        assert "sensitive" in result
    
    def test_empty_ingredients(self):
        result = infer_skin_types_from_ingredients([])
        assert result == []


class TestConcernInference:
    """Tests for concern inference from ingredients."""
    
    def test_acne_ingredients(self):
        result = infer_skin_concerns_from_ingredients(["salicylic acid", "zinc"])
        assert "acne" in result
    
    def test_hydration_ingredients(self):
        result = infer_skin_concerns_from_ingredients(["hyaluronic acid", "glycerin"])
        assert "hydration" in result
    
    def test_aging_ingredients(self):
        result = infer_skin_concerns_from_ingredients(["retinol", "peptide"])
        assert "aging" in result
    
    def test_empty_ingredients(self):
        result = infer_skin_concerns_from_ingredients([])
        assert result == []


class TestBrandExtraction:
    """Tests for brand extraction from product name."""
    
    def test_known_brand(self):
        result = extract_brand_from_name("The Ordinary Natural Moisturising Factors")
        assert result == "The Ordinary"
    
    def test_cerave_brand(self):
        result = extract_brand_from_name("CeraVe Moisturising Cream 454g")
        assert result == "Cerave"
    
    def test_unknown_brand(self):
        result = extract_brand_from_name("Some Unknown Product")
        assert result is not None
    
    def test_empty_name(self):
        result = extract_brand_from_name("")
        assert result is not None