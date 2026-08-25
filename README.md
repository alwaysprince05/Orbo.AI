# Orbo Beauty AI — Personalized Beauty Product Recommendation Engine

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141+-green.svg)](https://fastapi.tiangolo.com)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.62+-red.svg)](https://streamlit.io)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-60%20passed-brightgreen.svg)](tests/)

> **An intelligent, explainable recommendation system for beauty and skincare products** — built with TF-IDF content similarity, weighted hybrid ranking, and maximal marginal relevance diversity.

---

## 🎯 Overview

**Orbo Beauty AI** is a production-oriented recommendation engine that helps users discover personalized beauty and skincare products based on their unique skin profile, concerns, preferences, and budget.

**Problem**: The beauty market has thousands of products with complex ingredient lists. Users struggle to find products matching their skin type, concerns, and preferences without extensive research.

**Solution**: An AI-powered recommendation system that accepts user preferences (skin type, concerns, category, budget, preferred/avoided ingredients) and returns ranked, explained product recommendations with measurable relevance scores.

---

## 🚀 Live Demo

> **Note**: For evaluation purposes, the system runs locally. See [Local Setup](#-local-setup) for instructions.

| Interface | URL |
|-----------|-----|
| **Streamlit UI** | `http://localhost:8501` |
| **FastAPI Docs** | `http://localhost:8000/docs` |
| **Health Check** | `http://localhost:8000/api/v1/health` |

---

## 📸 Screenshots

### Streamlit Frontend
![Streamlit UI](docs/screenshots/streamlit_ui.png)

### API Documentation
![FastAPI Docs](docs/screenshots/fastapi_docs.png)

---

## 🏗 System Architecture

```mermaid
graph TD
    A[User Input] --> B[FastAPI / Streamlit]
    B --> C[Input Validation]
    C --> D[User Profile Construction]
    D --> E[Hard Candidate Filtering]
    E --> F[Content Similarity (TF-IDF)]
    F --> G[Preference Scoring]
    G --> H[Hybrid Ranking]
    H --> I[Diversity (MMR)]
    I --> J[Explanation Generation]
    J --> K[Top-K Recommendations]
```

### Pipeline Stages

1. **Input Validation** — Pydantic schemas validate all user inputs
2. **User Profile Construction** — Normalized text representation from preferences
3. **Hard Filtering** — Category, budget, avoid-ingredients (strict constraints)
4. **Content Similarity** — TF-IDF + Cosine similarity against product corpus
5. **Preference Scoring** — Weighted combination of 7 factors
6. **Hybrid Ranking** — 60% Preference + 40% Content similarity
7. **Diversity** — Maximal Marginal Relevance (MMR) for brand/ingredient variety
8. **Explanation Generation** — Human-readable reasons from actual matches

---

## 🧠 Recommendation Methodology

### Candidate Filtering (Hard Constraints)
| Filter | Type | Description |
|--------|------|-------------|
| Category | Exact | Product must match requested category |
| Budget | Upper bound | Price ≤ max_budget |
| Avoid Ingredients | Exclusion | Products containing avoided ingredients removed |

### Content-Based Similarity
- **TF-IDF Vectorization**: 5,000 features, n-grams (1,2), min_df=2, max_df=0.95
- **Product Representation**: name + category + brand + skin_types + concerns + ingredients
- **User Profile**: Constructed from same vocabulary (skin_type, concerns, category, preferred_ingredients)
- **Similarity**: Cosine similarity between user and product vectors

### Preference Scoring (Weighted Components)

| Component | Weight | Description |
|-----------|--------|-------------|
| Skin Type Match | 25% | Exact match (1.0), "all" types (0.8), no match (0.0) |
| Concern Match | 25% | Fraction of user concerns addressed by product |
| Ingredient Match | 15% | Fraction of preferred ingredients present |
| Category Match | 10% | Exact category match (1.0/0.0) |
| Budget Compatibility | 10% | Within budget (0.8-1.0), near budget (0.5-0.9), over (0.0-0.25) |
| Product Rating | 10% | Normalized rating (min-max) |
| Popularity | 5% | Normalized review count (min-max) |

### Hybrid Score
```
Final Score = 0.60 × Preference Score + 0.40 × Content Similarity
```

### Diversity (MMR)
- **λ = 0.7** (relevance-diversity tradeoff)
- Brand penalty: 0.3
- Category penalty: 0.2
- Ingredient similarity penalty (Jaccard > 0.7): 0.4

---

## 📊 Dataset

### Sources
| Dataset | Records | Source | License |
|---------|---------|--------|---------|
| **Kaggle Clean Skincare** | 1,138 | [eward96/skincare-products-clean-dataset](https://www.kaggle.com/datasets/eward96/skincare-products-clean-dataset) | CC0 |
| **Open Beauty Facts (skincare subset)** | 739 | [Open Beauty Facts](https://world.openbeautyfacts.org) | ODbL |

### Combined Statistics
- **Total Products**: 1,581 (after deduplication)
- **Categories**: 10 (moisturizer, cleanser, serum, sunscreen, toner, exfoliator, mask, eye_care, lip_care, face_oil, body_oil)
- **Brands**: 419
- **Price Range**: $2.48 – $292.10 (median: $25.40)
- **Rating Range**: 3.5 – 4.9 (median: 4.3)

### Feature Engineering
| Feature | Source | Method |
|---------|--------|--------|
| Skin Types | Ingredients + Text | Keyword + Ingredient-rule inference |
| Skin Concerns | Ingredients + Text | Keyword + Ingredient-rule inference |
| Categories | Original | Normalization mapping (50+ variants → 10 canonical) |
| Ingredients | Raw lists | Canonical INCI normalization (100+ mappings) |
| Prices | GBP → USD | 1.27× conversion + category defaults |
| Ratings | Synthetic | Category base + ingredient bonus + noise |

### Limitations
- **No real user interactions** — Cold-start only (content-based)
- **Synthetic ratings** — Generated from category/ingredient heuristics
- **Limited coverage** — 1,581 products vs. 100K+ in production
- **No skin tone support** — Dataset lacks shade/foundation data

---

## 🛠 Technology Stack

| Layer | Technology |
|-------|------------|
| **Backend** | FastAPI 0.141, Python 3.11 |
| **ML** | scikit-learn 1.9 (TF-IDF, Cosine Similarity) |
| **Data** | pandas 3.0, NumPy 2.5 |
| **Frontend** | Streamlit 1.62 |
| **Validation** | Pydantic 2.13 |
| **Testing** | pytest 8.3 |
| **Serialization** | joblib, Parquet |

---

## 📡 API Reference

### Health Check
```bash
GET /api/v1/health
```

### Get Recommendations
```bash
POST /api/v1/recommend
Content-Type: application/json

{
  "skin_type": "dry",
  "concerns": ["hydration", "aging"],
  "category": "moisturizer",
  "budget": 50,
  "preferred_ingredients": ["ceramide", "hyaluronic acid"],
  "avoid_ingredients": ["fragrance", "alcohol"],
  "top_k": 5
}
```

### Response
```json
{
  "recommendations": [
    {
      "product_id": "prod_000123",
      "name": "CeraVe Moisturising Cream",
      "brand": "Cerave",
      "category": "moisturizer",
      "price": 20.32,
      "rating": 4.6,
      "review_count": 2981,
      "score": 0.650,
      "match_percentage": 65,
      "reasons": [
        "Matches your dry skin type",
        "Addresses your hydration concern",
        "Contains preferred ingredient: ceramide",
        "Within your budget ($20 vs $50)",
        "Highly rated (4.6/5.0)"
      ],
      "warnings": [],
      "matching_attributes": {
        "skin_type": true,
        "concerns_matched": ["hydration"],
        "category": true,
        "budget": true,
        "preferred_ingredients_matched": ["ceramide"]
      },
      "score_breakdown": {
        "skin_type": 1.0,
        "concern": 1.0,
        "ingredient": 0.67,
        "category": 1.0,
        "budget": 0.9,
        "rating": 0.85,
        "content": 0.88,
        "hybrid": 0.65
      }
    }
  ],
  "filter_info": {...},
  "total_candidates": 251,
  "is_fallback": false,
  "message": "Found 5 personalized recommendations"
}
```

### Other Endpoints
| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/categories` | List all categories |
| `GET /api/v1/skin-types` | List all skin types |
| `GET /api/v1/concerns` | List all concerns |
| `GET /api/v1/metadata` | Dataset statistics |
| `GET /api/v1/products` | Paginated product listing |

---

## 📈 Evaluation Results

*Tested on 10 diverse user profiles (2 runs each, k=5)*

| Metric | Score |
|--------|-------|
| **Precision@5** | 0.6600 |
| **Recall@5** | 0.0585 |
| **NDCG@5** | 0.6806 |
| **MAP@5** | 0.0549 |
| **Diversity (1 - avg ingredient Jaccard)** | 0.9142 |
| **Catalog Coverage** | 2.34% |
| **Avg Latency** | 7,901 ms |
| **P95 Latency** | 29,862 ms |

### Per-Profile Results
| Profile | Precision@5 | NDCG@5 | Diversity |
|---------|-------------|--------|-----------|
| Dry Skin - Hydration | 1.000 | 1.000 | 0.867 |
| Oily Skin - Acne | 0.000 | 0.000 | 0.902 |
| Combination - Pigmentation | 0.400 | 0.345 | 0.949 |
| Sensitive - Soothing | 1.000 | 1.000 | 0.865 |
| Anti-Aging Serum | 0.800 | 0.869 | 0.959 |
| Sunscreen - Sensitive | 0.800 | 0.869 | 0.976 |
| Texture - Exfoliation | 1.000 | 1.000 | 0.811 |
| Budget Moisturizer | 1.000 | 1.000 | 0.916 |
| Open Search | 0.000 | 0.000 | 0.947 |
| Rare Combination | 0.600 | 0.723 | 0.950 |

---

## 🧪 Test Cases

### Successful Cases (5+)
1. ✅ Dry skin + hydration + moisturizer + $50 budget
2. ✅ Oily skin + acne + cleanser + $30 budget
3. ✅ Combination skin + pigmentation + serum + $60 budget
4. ✅ Sensitive skin + sensitivity + moisturizer + $40 budget
5. ✅ Anti-aging + serum + $80 budget
6. ✅ Sensitive + sun protection + sunscreen + $35 budget

### Failure/Edge Cases (5+)
1. ✅ **Impossible budget** ($0.01) → Returns empty with explanation
2. ✅ **Extreme ingredient avoidance** (10+ ingredients) → Graceful degradation
3. ✅ **Unknown skin type** → Uses "all" fallback
4. ✅ **No preferences specified** → Returns diverse popular products
5. ✅ **Rare combination** (oily + acne + aging + serum) → Works with fallback

---

## ⚙️ Local Setup

### Prerequisites
- Python 3.11+
- Git

### Installation
```bash
# Clone repository
git clone <repository-url>
cd orbo-beauty-recommender

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download and process data (one-time)
python3 app/utils/preprocessing.py

# Build content model (one-time)
python3 -c "
import pandas as pd
from app.recommender.content_model import create_content_model
df = pd.read_parquet('data/processed/products_processed.parquet')
create_content_model(df, 'data/processed/content_model.joblib')
"
```

### Run Backend
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Run Frontend
```bash
streamlit run frontend/app.py --server.port 8501
```

### Run Tests
```bash
pytest tests/ -v
```

---

## 🐳 Docker Deployment

```bash
# Build image
docker build -t orbo-beauty-ai .

# Run container
docker run -p 8000:8000 -p 8501:8501 orbo-beauty-ai
```

Or use docker-compose:
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "8000:8000"
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000
  
  frontend:
    build: .
    ports:
      - "8501:8501"
    command: streamlit run frontend/app.py --server.port 8501 --server.address 0.0.0.0
```

---

## 📁 Project Structure

```
orbo-beauty-recommender/
├── app/
│   ├── main.py                 # FastAPI entry point
│   ├── api/
│   │   ├── routes.py           # API endpoints
│   │   └── __init__.py
│   ├── recommender/
│   │   ├── recommender.py      # Main orchestration
│   │   ├── candidate_generation.py
│   │   ├── content_model.py    # TF-IDF model
│   │   ├── ranking.py          # Hybrid scoring
│   │   ├── diversity.py        # MMR diversity
│   │   ├── explanations.py     # Explanation generation
│   │   └── __init__.py
│   ├── models/
│   │   └── schemas.py          # Pydantic models
│   └── utils/
│       └── preprocessing.py    # Data pipeline
├── data/
│   ├── raw/                    # Original datasets
│   ├── processed/              # Processed artifacts
│   └── sample/                 # Sample for repo
├── evaluation/
│   ├── test_profiles.json      # 10 test profiles
│   ├── fast_evaluate.py        # Evaluation script
│   └── results/                # Generated reports
├── frontend/
│   └── app.py                  # Streamlit UI
├── tests/
│   ├── conftest.py
│   ├── test_preprocessing.py
│   ├── test_recommendation.py
│   ├── test_ranking.py
│   ├── test_fallback.py
│   └── test_api.py
├── requirements.txt
├── Dockerfile
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🔬 Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Content-based over CF** | Cold-start support; no user history needed |
| **TF-IDF over embeddings** | Interpretable, fast, no GPU needed |
| **Hybrid (60/40)** | Preference signals more reliable than pure content |
| **MMR diversity** | Prevents brand/ingredient monoculture |
| **Synthetic ratings** | No real interaction data available |
| **Ingredient-rule inference** | Dataset lacks explicit skin type/concern labels |
| **Category defaults for price** | Many products lack price data |

---

## ⚠️ Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| **No collaborative filtering** | Cannot learn from user behavior | Future: add implicit feedback |
| **Synthetic ratings** | Not real user satisfaction | Replace with real reviews |
| **Small catalog (1,581)** | Limited coverage | Scale to 50K+ products |
| **Static catalog** | No real-time updates | Add incremental indexing |
| **No skin tone/shade** | Cannot recommend foundation | Integrate shade finder |
| **Single-language (EN)** | Limited global reach | Multi-lingual ingredient mapping |

---

## 🚀 Future Improvements

### Phase 1: Data & Feedback
- [ ] Collect implicit feedback (clicks, dwell time)
- [ ] Add explicit rating collection
- [ ] Expand catalog to 50K+ products
- [ ] Add shade/foundation data

### Phase 2: Algorithm
- [ ] Collaborative filtering (ALS, LightFM)
- [ ] Hybrid deep models (Two-Tower, SASRec)
- [ ] Session-based/sequential recommendations
- [ ] Context-aware ranking (season, location)

### Phase 3: Production
- [ ] A/B testing framework
- [ ] Real-time feature store
- [ ] Online learning / model refresh
- [ ] Monitoring & alerting (drift, latency)
- [ ] Multi-region deployment

### Phase 4: Orbo Ecosystem Integration
- [ ] Skin analysis → preference inference
- [ ] Virtual try-on → recommendation feedback
- [ ] BeautyGPT → conversational recommendations
- [ ] Smart mirror → contextual suggestions

---

## 📜 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **Kaggle** — Clean skincare dataset (CC0)
- **Open Beauty Facts** — Product database (ODbL)
- **scikit-learn** — TF-IDF and similarity implementations
- **FastAPI/Streamlit** — Excellent framework ecosystems

---

## 📞 Contact

For questions or contributions, please open an issue or submit a pull request.

> **Built for the Orbo AI Technical Assignment** — Demonstrating end-to-end ML engineering: data engineering, recommendation algorithms, API design, frontend, testing, and documentation.