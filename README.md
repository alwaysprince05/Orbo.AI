# Orbo Beauty AI — Skincare Recommendation Engine

> Personalized beauty product recommendations powered by TF-IDF content similarity, weighted hybrid ranking, and Maximal Marginal Relevance diversity.

[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141-green.svg)](https://fastapi.tiangolo.com)
[![React 18](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev)
[![Tests](https://img.shields.io/badge/Tests-80%20passed-brightgreen.svg)](tests/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Live Demo

| Interface | URL |
|---|---|
| **Frontend** | https://orbo-frontend-j0cg.onrender.com |
| **AI Recommender** | https://orbo-frontend-j0cg.onrender.com/recommend |
| **BeautyGPT Advisor** | https://orbo-frontend-j0cg.onrender.com/beautygpt |
| **Product Catalog** | https://orbo-frontend-j0cg.onrender.com/#products |
| **API (Swagger)** | https://orbo-api.onrender.com/docs |
| **GitHub** | https://github.com/alwaysprince05/Orbo.AI |

---

## Problem

The global beauty market has hundreds of thousands of products. Users struggle to find what suits their skin type, concerns, and budget — and routinely buy the wrong product.

**Goal:** Accept a user's skin profile and return a ranked, *explained* shortlist from a real product catalog. Cold-start friendly — no user history needed.

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
| 3. **Preference Scoring** | 7 weighted signals: skin type (25%), concerns (25%), ingredients (15%), etc. |
| 4. **Hybrid Ranking** | `0.60 × preference + 0.40 × content` |
| 5. **MMR Diversity** | Brand/ingredient variety penalty (λ=0.7) |
| 6. **Explanations** | Per-product reasons and warnings |

### API

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

## Dataset

| Stat | Value |
|---|---|
| Total products | **1,581** |
| Brands | **419** |
| Categories | **10** (moisturizer, cleanser, serum, sunscreen, toner, etc.) |
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

Run `python evaluation/fast_evaluate.py` to reproduce.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | FastAPI + Uvicorn |
| ML/NLP | scikit-learn (TF-IDF, cosine similarity) |
| Data | pandas + NumPy + PyArrow |
| Frontend | React 18 + React Router + Vite |
| Testing | pytest (80 tests) |
| Deploy | Render (Blueprint) |

---

## Local Setup

```bash
# Backend
./run.sh                              # FastAPI on :8000

# Frontend (separate terminal)
cd website && npm run dev             # React on :3000

# Tests
pip install -r requirements-dev.txt
pytest tests/ -v                      # 80 tests
```

---

## Project Structure

```
├── app/                    # FastAPI + ML engine
│   ├── api/routes.py       # REST endpoints
│   ├── recommender/        # 6-stage pipeline
│   └── utils/preprocessing.py
├── website/                # React 18 + Vite SPA
│   └── src/pages/          # Recommender, BeautyGPT, Home, etc.
├── data/processed/         # Product catalog + TF-IDF model
├── evaluation/             # Metrics + test profiles
├── tests/                  # 80 pytest tests
├── render.yaml             # Deployment blueprint
└── Dockerfile
```

---

## Bonus: Nykaa Comparison

| Dimension | Nykaa | Orbo Beauty AI |
|---|---|---|
| Personalization | Collaborative (millions of users) | Content-based (cold-start) |
| Catalog | 100K+ live SKUs | 1,581 curated products |
| Ratings | Real reviews | Synthetic (heuristic) |
| Explainability | Marketing labels | Transparent score breakdown |
| Latency | ~100ms (distributed) | ~18ms (single-node) |

---

## License

MIT
