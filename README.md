# Orbo Beauty AI

Personalized skincare recommendation engine with a full-stack web application — from product discovery to checkout.

[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141-green.svg)](https://fastapi.tiangolo.com)
[![React 18](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev)
[![Tests](https://img.shields.io/badge/Tests-80%20passed-brightgreen.svg)](tests/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Live Demo

| Interface | URL |
|---|---|
| **Home** | [orbo-frontend-j0cg.onrender.com](https://orbo-frontend-j0cg.onrender.com) |
| **AI Recommender** | [/recommend](https://orbo-frontend-j0cg.onrender.com/recommend) |
| **BeautyGPT Advisor** | [/beautygpt](https://orbo-frontend-j0cg.onrender.com/beautygpt) |
| **Product Catalog** | [/](https://orbo-frontend-j0cg.onrender.com/#products) |
| **API Docs (Swagger)** | [orbo-api.onrender.com/docs](https://orbo-api.onrender.com/docs) |

---

## Problem

The beauty market has hundreds of thousands of products. Users struggle to find what suits their skin type, concerns, and budget — and routinely buy the wrong product.

**Goal:** Accept a user's skin profile and return a ranked, explained shortlist from a real product catalog. Cold-start friendly — no user history needed.

---

## How It Works

### 6-Stage Recommendation Pipeline

```
User Profile → Hard Filter → TF-IDF Similarity → Preference Scoring
              → Hybrid Ranking (60/40) → MMR Diversity → Explanations
```

| Stage | What It Does |
|---|---|
| 1. **Candidate Generation** | Category, budget, avoid-ingredient filters with progressive fallback |
| 2. **Content Similarity** | TF-IDF (5K features, 1-2 ngrams) cosine similarity |
| 3. **Preference Scoring** | 7 weighted signals: skin type (25%), concerns (25%), ingredients (15%) |
| 4. **Hybrid Ranking** | `0.60 × preference + 0.40 × content` |
| 5. **MMR Diversity** | Brand/ingredient variety penalty (λ=0.7) |
| 6. **Explanations** | Per-product reasons and warnings |

### API Example

```bash
curl -X POST https://orbo-api.onrender.com/api/v1/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "skin_type": "dry",
    "concerns": ["hydration", "aging"],
    "category": "moisturizer",
    "budget": 50,
    "preferred_ingredients": ["ceramide", "hyaluronic acid"],
    "avoid_ingredients": ["fragrance"],
    "top_k": 5
  }'
```

---

## Features

### Frontend (React 18 + Vite)

| Feature | Description |
|---|---|
| **AI Recommender** | 2-column form + ranked results with match %, reasons, and score breakdown |
| **BeautyGPT** | AI chat advisor for skincare questions — powered by the recommendation engine |
| **Product Catalog** | 1,581+ products with skin type, concern, budget, and sort filters |
| **Product Detail** | Full product page with ingredients, ratings, delivery info, and similar products |
| **Shopping Cart** | Add/remove items, order summary, order confirmation modal |
| **Interactive Beauty Canvas** | Drag-and-drop makeup try-on with real-time rendering |
| **7 Solution Pages** | Virtual Makeup, Hair Color, Hair Styling, Facial Attributes, Foundation Shade Finder, Smart Skin Analysis, Smart Beauty Mirror |
| **Hero Slider** | Auto-rotating slides with internal navigation |
| **Responsive Design** | Mobile-first with collapsible nav and adapted layouts |

### Backend (FastAPI + scikit-learn)

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/recommend` | POST | Full recommendation pipeline |
| `/api/v1/products` | GET | Paginated product catalog with filters |
| `/api/v1/metadata` | GET | Available skin types, concerns, categories, price range |
| `/api/v1/health` | GET | Health check (used by UptimeRobot keep-alive) |
| `/docs` | GET | Interactive Swagger documentation |

---

## Dataset

| Stat | Value |
|---|---|
| Total products | **1,581** |
| Brands | **419** |
| Categories | **10** (moisturizer, cleanser, serum, sunscreen, toner, masks, exfoliators, face oils, eye care, lip care) |
| Price range | ₹206 – ₹24,244 |

**Sources:** Kaggle Skincare Products (CC0) + Open Beauty Facts (ODbL)

---

## Evaluation

| Metric | Score |
|---|---|
| **Precision@5** | **0.86** |
| **NDCG@5** | **0.83** |
| **Diversity** | **0.89** |
| **Avg Latency** | **17.8ms** |

```bash
python evaluation/fast_evaluate.py   # Reproduce metrics
```

**Test profiles:** 10 representative skin profiles covering dry, oily, combination, sensitive, and normal skin types with varied concerns (acne, aging, pigmentation, hydration, sensitivity).

---

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | FastAPI + Uvicorn |
| ML/NLP | scikit-learn (TF-IDF, cosine similarity) |
| Data | pandas + NumPy + PyArrow |
| Frontend | React 18 + React Router + Vite |
| State | React Context (cart management) |
| Styling | CSS Modules (per-component) |
| Testing | pytest (80 tests) |
| Deployment | Render (Blueprint: API + Frontend) |
| Keep-Alive | UptimeRobot (5-minute health pings) |

---

## Local Setup

```bash
# Clone
git clone https://github.com/alwaysprince05/Orbo.AI.git
cd Orbo.AI

# Backend
./run.sh                              # FastAPI on :8000

# Frontend (separate terminal)
cd website && npm install && npm run dev   # React on :5173

# Tests
pip install -r requirements-dev.txt
pytest tests/ -v                      # 80 tests
```

---

## Project Structure

```
Orbo.AI/
├── app/                          # FastAPI + ML engine
│   ├── api/routes.py             # REST endpoints
│   ├── recommender/              # 6-stage pipeline
│   │   ├── candidate_generation.py
│   │   ├── content_model.py      # TF-IDF
│   │   ├── ranking.py            # Hybrid scoring
│   │   ├── diversity.py          # MMR
│   │   ├── explanations.py       # Per-product reasons
│   │   └── recommender.py        # Orchestrator
│   └── utils/preprocessing.py
├── website/                      # React 18 + Vite SPA
│   └── src/
│       ├── pages/                # Home, Recommender, Cart, ProductDetail, etc.
│       │   └── solutions/        # 7 AI solution demo pages
│       ├── components/           # HeroSlider, ProductCatalog, Navbar, etc.
│       ├── context/CartContext.jsx
│       ├── api/recommender.js    # API client with retry logic
│       └── utils/formatPrice.js  # USD → ₹ conversion
├── data/processed/               # Product catalog + TF-IDF model
├── evaluation/                   # Metrics + test profiles
├── tests/                        # 80 pytest tests
├── render.yaml                   # Deployment blueprint
├── Dockerfile
└── requirements.txt
```

---

## Bonus: Nykaa Comparison

| Dimension | Nykaa | Orbo Beauty AI |
|---|---|---|
| Personalization | Collaborative filtering (millions of users) | Content-based (cold-start, no history needed) |
| Catalog | 100K+ live SKUs | 1,581 curated products |
| Ratings | Real user reviews | Synthetic (heuristic-based) |
| Explainability | Marketing labels | Transparent score breakdown per product |
| Latency | ~100ms (distributed infra) | ~18ms (single-node) |
| UI | E-commerce focused | Recommendation-first with guided profiling |

**What we'd build next with more time:**
- Collaborative filtering with user interaction data
- Real-time product ingestion from Nykaa/Amazon APIs
- Image-based skin analysis via computer vision
- A/B testing framework for ranking experiments
- Multi-language support for Indian regional languages

---

## License

MIT
