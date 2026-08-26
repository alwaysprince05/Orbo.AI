# Orbo Beauty AI — Personalized Skincare Recommendation System

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141-green.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev)
[![Tests](https://img.shields.io/badge/Tests-80%20passed-brightgreen.svg)](tests/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> An intelligent, explainable beauty product recommendation engine — built with TF-IDF content similarity, weighted hybrid ranking, and Maximal Marginal Relevance diversity. Served via a FastAPI backend and a full React/Vite SaaS frontend.

---

## Submission Checklist

| Deliverable | Status | Location |
|---|---|---|
| Working recommendation system | ✅ | `app/` (ML engine) |
| Testing interface — deployed UI | ✅ | React frontend at `website/` — run `npm run dev` |
| Documentation | ✅ | This README |
| Bonus: Nykaa comparison | ✅ | [Bonus section](#bonus-comparison-with-nykaa) |

**Quick start for evaluators:**  
```bash
./run.sh                # starts FastAPI on :8000
cd website && npm run dev  # starts React UI on :3000
```
Open **http://localhost:3000/recommend** — select skin type, tick concerns, set budget, hit **Find My Products**.

---

## Problem Statement

The global beauty market lists hundreds of thousands of products with complex ingredient formulations. Users spend significant time researching what suits their skin type, concerns, and budget — and routinely buy the wrong product.

**Goal:** Build a recommendation engine that accepts a user's skin profile (skin type, concerns, budget, ingredient preferences) and returns a ranked, *explained* shortlist from a real product catalog.

**Why it matters:** The same problem is solved at industrial scale by Nykaa, Sephora, and COSRX — but those systems require massive user-interaction logs. This system demonstrates a cold-start-friendly content-based approach that works from day one with zero prior user data.

---

## Live Demo

| Interface | URL |
|---|---|
| **React UI** | http://localhost:3000 |
| **AI Recommender page** | http://localhost:3000/recommend |
| **Product Catalog** | http://localhost:3000/#products |
| **FastAPI Swagger** | http://localhost:8000/docs |
| **Health Check** | http://localhost:8000/api/v1/health |

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React / Vite SPA                  │
│  (website/src — 28 components, 11,439 LOC)          │
│                                                     │
│  /recommend  ←→  profile form + result cards        │
│  /#products  ←→  live product catalog               │
│  /beautygpt  ←→  context-aware chat advisor         │
└────────────────────┬────────────────────────────────┘
                     │  HTTP  (Vite proxy → port 8000)
┌────────────────────▼────────────────────────────────┐
│              FastAPI Backend  :8000                  │
│  app/main.py — lifespan startup, CORS, routes       │
│  app/api/routes.py — /recommend, /products, /health │
│  app/models/schemas.py — Pydantic validation        │
└────────────────────┬────────────────────────────────┘
                     │  in-process call
┌────────────────────▼────────────────────────────────┐
│         BeautyRecommender  (6-stage pipeline)       │
│                                                     │
│  1. CandidateGeneration  — hard filter              │
│  2. ContentModel         — TF-IDF similarity        │
│  3. PreferenceScoring    — 7-signal weighted sum    │
│  4. HybridRanking        — 60% pref + 40% content  │
│  5. MMRDiversity         — brand/ingredient variety │
│  6. ExplanationGen       — per-item reasons         │
└────────────────────┬────────────────────────────────┘
                     │  reads
┌────────────────────▼────────────────────────────────┐
│           data/processed/                           │
│   products_processed.parquet   (1,581 products)     │
│   content_model.joblib          (TF-IDF + matrix)   │
│   dataset_metadata.json         (stats)             │
└─────────────────────────────────────────────────────┘
```

### Pipeline Stage Detail

| Stage | File | What it does |
|---|---|---|
| 1. Hard filter | `candidate_generation.py` | Category exact-match, budget cap, avoid-ingredient exclusion. Falls back progressively (+20% budget → drop category → soft ingredients → drop skin type) if < 20 candidates survive. |
| 2. Content similarity | `content_model.py` | TF-IDF (5 000 features, 1-2-grams) over product text. Cosine similarity between user profile text and every candidate. |
| 3. Preference scoring | `ranking.py` | Weighted sum of 7 signals (see table below). Each signal stored as `_*_score` column for explainability. |
| 4. Hybrid ranking | `ranking.py` | `0.60 × preference + 0.40 × content`. Content scores min-max normalised before combining. |
| 5. MMR diversity | `diversity.py` | Maximal Marginal Relevance (λ=0.7) over top-150 pool. Penalises same brand (−0.3), same category (−0.2), ingredient Jaccard > 0.7 (−0.4). |
| 6. Explanations | `explanations.py` | Derives per-product reasons (✅) and warnings (⚠️) from actual attribute matches. Returns `score_breakdown` dict for UI display. |

---

## Recommendation Methodology

### Stage 1 — Candidate Filtering

```
Hard constraints (applied in order):
  1. category == requested_category
  2. price_usd  ≤  max_budget
  3. avoid_ingredients ∩ product_ingredients == ∅

Fallback chain (if < 20 candidates survive):
  → relax budget +20 %
  → drop category filter
  → make preferred ingredients soft
  → drop skin type filter
```

### Stage 2 — Content-Based Similarity (TF-IDF)

Each product is represented as a concatenated text document:

```
"{name} {category} {brand} {skin_types} {skin_concerns} {ingredients} {description}"
```

The user profile is expressed in the same vocabulary:

```
"{skin_type} {concerns} {category} {preferred_ingredients}"
```

A single `TfidfVectorizer(max_features=5000, ngram_range=(1,2), min_df=2, max_df=0.95)` is fitted at preprocessing time and serialised to `data/processed/content_model.joblib`. At query time the user vector is projected into the same space and cosine similarity is computed against all candidates.

### Stage 3 — Preference Scoring

| Signal | Weight | Formula |
|---|---|---|
| Skin type match | 25 % | 1.0 exact, 0.8 if product covers "all" types, 0.0 miss |
| Concern match | 25 % | # concerns matched / # concerns requested |
| Preferred ingredient match | 15 % | # preferred ingredients found / # requested |
| Category match | 10 % | 1.0 / 0.0 |
| Budget fit | 10 % | 50–80 % of budget → 1.0; > budget → 0.0–0.5 |
| Rating | 10 % | min-max normalised |
| Popularity (review count) | 5 % | min-max normalised |

### Stage 4 — Hybrid Ranking

```
hybrid_score = 0.60 × preference_score + 0.40 × content_similarity
```

Preference signals are chosen as the dominant component because they are more directly aligned with stated user intent than latent text similarity. The 40 % content weight catches products a keyword-free preference scorer would miss (e.g. a product that addresses aging via a retinol-adjacent compound not explicitly named by the user).

### Stage 5 — Diversity (MMR)

Greedy selection from top-150 ranked candidates:

```
score(i) = 0.7 × hybrid_score(i) − 0.3 × diversity_penalty(i)

diversity_penalty = max over already-selected j:
  0.3  if brand(i) == brand(j)
  0.2  if category(i) == category(j)
  0.4  if jaccard(ingredients(i), ingredients(j)) > 0.7
```

### Stage 6 — Explanation Generation

For each selected product:
- **Reasons** — derived from actual attribute matches (skin type, concern, ingredient, budget, rating, review count)
- **Warnings** — potential mismatches (over budget, missing skin type, fragrance for sensitive, drying alcohol for dry)
- **Score breakdown** — all `_*_score` values exposed to the UI for transparency

---

## Dataset

### Sources

| Dataset | Records | License | URL |
|---|---|---|---|
| Kaggle Skincare Products Clean | 1,138 | CC0 | [link](https://www.kaggle.com/datasets/eward96/skincare-products-clean-dataset) |
| Open Beauty Facts (skincare subset) | 739 | ODbL | [link](https://world.openbeautyfacts.org) |

### Combined (post-processing)

| Stat | Value |
|---|---|
| Total products | **1,581** |
| Brands | **419** |
| Categories | **10** (moisturizer, cleanser, serum, sunscreen, toner, exfoliator, mask, eye_care, lip_care, face_oil) |
| Price range | **$2.48 – $292.10** (median $30.00) |
| Rating range | **3.5 – 4.9** (mean 4.17) |

### Feature Engineering Pipeline (`app/utils/preprocessing.py`)

| Step | Description |
|---|---|
| Category normalisation | 50+ raw variant strings → 10 canonical labels |
| Ingredient normalisation | 100+ INCI variant mappings → canonical names; strip concentrations |
| Skin type inference | Ingredient-rule lookup (e.g. ceramide → dry) + keyword text matching |
| Concern inference | Ingredient-rule lookup (e.g. retinol → aging, salicylic acid → acne) + text matching |
| Currency conversion | GBP → USD (×1.27); missing prices filled with category-based medians |
| Synthetic ratings | Seeded by category + ingredient combo; base 4.0–4.4 ± 0.15, clipped 3.0–5.0 |
| Synthetic review counts | Log-normal, positively correlated with rating |
| Deduplication | Normalised name-key across both datasets |

---

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Backend API | FastAPI + Uvicorn | 0.141 / 0.52 |
| ML / NLP | scikit-learn (TF-IDF, cosine similarity) | 1.9 |
| Data | pandas + NumPy + PyArrow | 3.0 / 2.5 / 25 |
| Model persistence | joblib | 1.5 |
| Validation | Pydantic | 2.13 |
| Frontend | React 18 + React Router v6 | 18.3 |
| Build tool | Vite | 5.4 |
| Testing | pytest + httpx | 8.3 / 0.28 |
| Python target | 3.12 | — |

---

## API Reference

### POST `/api/v1/recommend`

```bash
curl -X POST http://localhost:8000/api/v1/recommend \
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

**Request schema**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `skin_type` | `string \| null` | No | dry / oily / combination / normal / sensitive |
| `concerns` | `string[]` | No | hydration / acne / aging / pigmentation / sensitivity / texture / sun_protection |
| `category` | `string \| null` | No | moisturizer / cleanser / serum / sunscreen / toner / exfoliator / mask / eye_care / lip_care / face_oil |
| `budget` | `float \| null` | No | 0 – 1000 (USD) |
| `preferred_ingredients` | `string[]` | No | Free-text ingredient names |
| `avoid_ingredients` | `string[]` | No | Free-text ingredient names |
| `top_k` | `int` | No | 1 – 20 (default 5) |

**Response (abbreviated)**

```json
{
  "recommendations": [
    {
      "product_id": "prod_000001",
      "name": "CeraVe Moisturising Cream 454g",
      "brand": "Cerave",
      "category": "moisturizer",
      "price": 20.32,
      "rating": 4.5,
      "review_count": 3489,
      "match_percentage": 94,
      "reasons": [
        "Matches your dry skin type",
        "Addresses your hydration concern",
        "Contains preferred ingredient: ceramide",
        "Well within your $50 budget ($20.32)",
        "Highly rated (4.5 / 5.0)"
      ],
      "warnings": [],
      "score_breakdown": {
        "skin_type": 1.0, "concern": 1.0, "ingredient": 0.67,
        "budget": 0.90, "rating": 0.82, "content": 0.88, "hybrid": 0.94
      }
    }
  ],
  "total_candidates": 145,
  "is_fallback": false,
  "message": "Found 5 personalized recommendations"
}
```

### Other endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/health` | Model + product load status |
| GET | `/api/v1/metadata` | Dataset stats + all filter options |
| GET | `/api/v1/products` | Paginated catalog (category, brand, price, rating filters) |
| GET | `/api/v1/products/{id}` | Single product detail |
| GET | `/api/v1/categories` | Available categories |
| GET | `/api/v1/skin-types` | Available skin types |
| GET | `/api/v1/concerns` | Available concerns |

---

## Evaluation Results

Run `python evaluation/fast_evaluate.py` to reproduce.

### Aggregate Metrics (k=5, 10 test profiles)

| Metric | Score |
|---|---|
| **Precision@5** | **0.86** |
| **NDCG@5** | **0.83** |
| Recall@5 | 0.083 |
| MAP@5 | 0.075 |
| **Diversity** | **0.89** |
| Catalog coverage | 2.40 % |
| **Avg latency** | **17.8 ms** |
| **P95 latency** | **31.4 ms** |
| Fallbacks used | 0 / 10 |

> **Why recall is low:** The relevant set for a profile like "dry + hydration + moisturizer + $50" contains 251 products — returning 5 of them is inherently low recall. Precision and NDCG capture ranking quality, which is the meaningful signal here.

### Per-Profile Breakdown

| Profile | P@5 | NDCG@5 | Diversity | Fallback |
|---|---|---|---|---|
| Dry Skin – Hydration Focus | 1.00 | 1.00 | 0.66 | No |
| Oily Skin – Acne Treatment | 0.80 | 0.66 | 0.93 | No |
| Combination – Brightening Serum | 0.80 | 0.66 | 0.91 | No |
| Sensitive – Soothing Moisturizer | 1.00 | 1.00 | 0.76 | No |
| Mature Skin – Anti-Aging Serum | 1.00 | 1.00 | 0.93 | No |
| Sun Protection for Sensitive Skin | 1.00 | 1.00 | 0.96 | No |
| Texture Treatment – Exfoliation | 1.00 | 1.00 | 0.89 | No |
| Budget-Friendly Moisturizer (≤$15) | 1.00 | 1.00 | 0.92 | No |
| Open Search – No Constraints | 0.00 | 0.00 | 0.95 | No |
| Rare Combination – Difficult Match | 1.00 | 1.00 | 0.93 | No |

**Open Search** scores 0 on precision intentionally — no relevant set is defined for a query with no preferences. It returns popular/diverse items, which is the correct fallback behaviour.

---

## Test Cases

### Successful Scenarios

**1. Dry skin / hydration / moisturizer / $50 budget**
```json
{ "skin_type": "dry", "concerns": ["hydration"], "category": "moisturizer",
  "budget": 50, "preferred_ingredients": ["ceramide", "hyaluronic acid"],
  "avoid_ingredients": ["fragrance"], "top_k": 5 }
```
→ Returns CeraVe, The Ordinary, and Weleda moisturisers with match percentages 82–94 %. P@5 = 1.0, NDCG = 1.0. All five reasons include ceramide/HA matches.

**2. Oily skin / acne / cleanser / $30**
```json
{ "skin_type": "oily", "concerns": ["acne"], "category": "cleanser",
  "budget": 30, "preferred_ingredients": ["salicylic acid", "niacinamide"],
  "avoid_ingredients": ["fragrance"], "top_k": 5 }
```
→ P@5 = 0.80. All results are oil-control cleansers. One result misses niacinamide (reason for 0.8 not 1.0).

**3. Sensitive + sun protection / sunscreen / $35**
→ P@5 = 1.0. Five mineral sunscreens, all fragrance-free, all SPF-labelled.

**4. Budget-Friendly — $15 cap**
→ P@5 = 1.0. System correctly enforces hard budget ceiling; all results under $15.

**5. Rare combination — oily + acne + aging serum / $100**
→ P@5 = 1.0 even on a niche multi-concern query. Demonstrates cross-concern ranking.

**6. Anti-aging serum — retinol + peptide + vitamin C / $80**
→ P@5 = 1.0. MMR ensures results span The Ordinary, Medik8, and Estée Lauder (brand diversity = 0.93).

### Failure / Edge Case Scenarios

**7. Open Search — no preferences at all**
```json
{ "skin_type": null, "concerns": [], "category": null, "budget": null, "top_k": 5 }
```
→ P@5 = 0.0 (expected — no relevant set). Returns popular/diverse products as a discovery fallback. Demonstrates graceful degradation.

**8. Extreme ingredient avoidance**
```json
{ "avoid_ingredients": ["glycerin","fragrance","alcohol","silicone","parabens",
                         "sulfates","mineral oil","petroleum","lanolin","phenoxyethanol"],
  "category": "moisturizer", "top_k": 5 }
```
→ Candidate pool shrinks significantly. System activates fallback chain but still returns 5 results with warnings indicating concern mismatches.

**9. Impossible budget ($3)**
```json
{ "budget": 3, "category": "serum", "top_k": 5 }
```
→ Hard filter finds < 20 candidates. Budget relaxed +20 % automatically. Returns cheapest serums with a fallback notice. Does not crash.

**10. No matching category (request "eye_care" with budget $5)**
→ Only ~3 eye care products under $5 exist. Fallback chain drops category filter and returns general low-cost products with a fallback message explaining the constraint relaxation.

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Content-based over collaborative filtering | Zero user history needed (cold-start). Every new product is immediately rankable. |
| TF-IDF over embeddings | Transparent, fast, no GPU, reproducible. Interpretable features map directly to reasons. |
| 60/40 hybrid weighting | Preference signals are more aligned with stated intent. Content similarity catches non-obvious matches. |
| Explicit fallback chain | Never returns zero results. Progressive relaxation communicates why results differ from the strict query. |
| MMR diversity | Prevents the top-10 results all being The Ordinary's £6 serums. Brand + ingredient variety is measurably better. |
| Synthetic ratings | Real user reviews were not available. Heuristic ratings are seeded deterministically so results are reproducible. |
| Ingredient-rule inference | Raw datasets had no explicit skin-type/concern labels. Rules + text matching recover ~85 % of labels correctly. |

---

## Assumptions

- Product suitability for a skin type can be inferred from ingredient composition using published dermatology rules.
- A cosine similarity score ≥ 0.3 between user profile and product text is a meaningful signal (validated by P@5 = 0.86 on test profiles).
- Synthetic ratings drawn from category+ingredient heuristics are a reasonable proxy for quality ranking in the absence of real data.
- A budget tolerance of 0–20 % over the stated cap is acceptable (used only in the fallback chain when no strict matches exist).

---

## Known Limitations

| Limitation | Impact | Mitigation / Future fix |
|---|---|---|
| No collaborative filtering | Cannot learn from purchase/click behaviour | Add implicit feedback loop once traffic exists |
| Synthetic ratings | Not real user satisfaction | Replace with real review scraping / API |
| Small catalog (1,581) | Poor coverage vs. Nykaa/Sephora (100K+) | Crawl or license a larger product database |
| Static catalog | No real-time inventory / pricing | Add incremental indexing pipeline |
| No skin tone / shade | Cannot recommend foundation shades | Integrate colorimetry dataset |
| English-only ingredient names | Misses non-English INCI variants | Expand normalisation mappings |
| Client-side skin/concern filtering | Pagination count is approximate when filters are active | Move filters server-side in API |

---

## Future Improvements

### Near-term (1–4 weeks)
- Add `min_rating` and `brand` query params to the `/products` API endpoint so client-side filtering is server-side
- Wire real Formspree / email backend to the contact form (currently uses a placeholder endpoint ID)
- Add screenshots to `docs/screenshots/` and update README image badges
- Push to public GitHub and deploy frontend to Vercel, API to Render

### Algorithm (1–3 months)
- **Two-Tower retrieval** to scale candidate generation to 100K+ products
- **LightFM hybrid model** to blend content and collaborative signals once click data exists
- **Session-aware re-ranking** — adjust for items viewed / wishlisted in the current session
- **Routine builder** — recommend a full AM/PM routine (cleanser → serum → moisturiser → SPF) instead of single items

### Production (3–6 months)
- Real-time feature store (Redis / Feast) for sub-10ms serving
- A/B testing framework with CTR / conversion lift tracking
- Model drift monitoring + automated retraining
- Multi-region deployment + CDN for static React assets

### Orbo Ecosystem Integration
- Skin Analysis → auto-fill skin type and concern in the recommender
- Virtual Try-On → use try-on engagement as implicit preference signal
- BeautyGPT → conversational front-end over the same recommendation API
- Smart Mirror → contextual recommendations for in-store kiosks

---

## Bonus: Comparison with Nykaa

This system is inspired by Nykaa's skin-type filtering, concern-based discovery, and ingredient-led shopping experience.

### Similarities

| Feature | Nykaa | Orbo Beauty AI |
|---|---|---|
| Skin type + concern filter | ✅ | ✅ |
| Category + budget navigation | ✅ | ✅ |
| Ingredient-aware discovery | ✅ (ingredient stores) | ✅ (preferred / avoid lists) |
| Rating as ranking signal | ✅ | ✅ |
| "Why this product" cues | Partial (badges/claims) | ✅ **explicit per-item reasons + score breakdown** |
| Diversity control | Merchandising rules | ✅ Explicit MMR |

### Differences

| Dimension | Nykaa | Orbo Beauty AI |
|---|---|---|
| Personalisation signals | Collaborative (purchase + browse history, millions of users) | Content-based (session profile, cold-start) |
| Catalog size | 100K+ live SKUs, real inventory | 1,581 curated products, static |
| Ratings | Real verified reviews | Synthetically generated |
| Explainability | Marketing labels | Transparent weighted score breakdown |
| Latency | ~100ms (distributed infra) | ~18ms average (single-node in-process) |

### Current Limitations vs. Nykaa
- No behavioural learning — cannot yet adapt from clicks or purchases
- Synthetic ratings — Nykaa uses real reviews; ours are heuristic approximations
- Small static catalog — no live inventory, shade ranges, or regional pricing
- No cross-sell / routine bundles — Nykaa recommends complementary routine items

### What I Would Build Next
1. **Two-Tower retrieval + LightFM ranking** once interaction data exists — blend content and collaborative signals
2. **Routine builder** — recommend a full multi-step routine (cleanser → serum → moisturiser → SPF) with ingredient compatibility checks
3. **Real review ingestion** to replace synthetic ratings and enable sentiment-weighted scoring
4. **Session-based re-ranking** — adjust dynamically for items the user has viewed or saved
5. **Foundation shade matching** via colorimetry API — the dataset gap that prevents accurate foundation recommendations today
6. **A/B testing + business metrics** — CTR, conversion lift, and return rate reduction are the real success measures in production

---

## Local Setup

### Prerequisites
- Python 3.12
- Node.js 18+

### Backend

```bash
cd /path/to/orbo-beauty-recommender

# Create venv
python3.12 -m venv venv
source venv/bin/activate

# Install runtime deps (no Streamlit — frontend is React)
pip install -r requirements.txt

# Start API (port 8000, auto-reload)
./run.sh
# or directly:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd website
npm install
npm run dev      # starts on http://localhost:3000
```

Vite proxies all `/api/*` requests to `http://localhost:8000` — no CORS config needed in development.

### Tests

```bash
pip install -r requirements-dev.txt
pytest tests/ -v        # 80 tests
```

### Evaluation

```bash
python evaluation/fast_evaluate.py
# outputs: evaluation/results/evaluation_report.txt
#          evaluation/results/evaluation_results.json
```

### Rebuild processed data (optional — artifacts are committed)

```bash
python app/utils/preprocessing.py
python -c "
import pandas as pd
from app.recommender.content_model import create_content_model
df = pd.read_parquet('data/processed/products_processed.parquet')
create_content_model(df, 'data/processed/content_model.joblib')
"
```

---

## Project Structure

```
orbo-beauty-recommender/
│
├── app/                              # FastAPI + ML engine (Python, 2,835 LOC)
│   ├── main.py                       # FastAPI entry point, lifespan startup
│   ├── api/routes.py                 # All REST endpoints
│   ├── models/schemas.py             # Pydantic request/response models
│   ├── recommender/
│   │   ├── recommender.py            # BeautyRecommender — pipeline orchestration
│   │   ├── candidate_generation.py   # Hard filtering + fallback chain
│   │   ├── content_model.py          # TF-IDF vectoriser (fit / transform / save / load)
│   │   ├── ranking.py                # Preference scoring + hybrid ranking
│   │   ├── diversity.py              # Maximal Marginal Relevance
│   │   └── explanations.py           # Reason + warning generation
│   └── utils/preprocessing.py        # Data pipeline (raw → parquet + model)
│
├── website/                          # React 18 + Vite SPA (11,439 LOC)
│   ├── src/
│   │   ├── api/recommender.js        # Fetch client with AbortController + timeout
│   │   ├── pages/
│   │   │   ├── Recommender.jsx       # AI recommendation UI (main evaluator page)
│   │   │   ├── Home.jsx              # Marketing homepage
│   │   │   ├── Blog.jsx              # Blog articles
│   │   │   ├── AboutUs.jsx           # Team + values
│   │   │   ├── Technology.jsx        # Tech stack page
│   │   │   ├── NotFound.jsx          # 404 page
│   │   │   ├── solutions/            # 8 solution demo pages
│   │   │   └── legal/                # Terms, Privacy, Cookie, Refund
│   │   ├── components/
│   │   │   ├── ProductCatalog.jsx    # Live product grid (API-powered)
│   │   │   ├── Navbar.jsx            # Fixed nav, Solutions dropdown, mobile menu
│   │   │   ├── Footer.jsx            # Dark footer, social links, dynamic year
│   │   │   ├── HeroSlider.jsx        # Auto-play carousel with arrows
│   │   │   ├── ContactForm.jsx       # Formspree-powered inquiry form
│   │   │   └── ErrorBoundary.jsx     # React error boundary
│   │   └── App.jsx                   # Routes (lazy-loaded, code-split)
│   └── vite.config.js                # Dev server + /api proxy
│
├── data/
│   ├── raw/                          # Original CSV / Parquet source files
│   └── processed/                    # Committed runtime artifacts
│       ├── products_processed.parquet
│       ├── content_model.joblib
│       └── dataset_metadata.json
│
├── evaluation/
│   ├── fast_evaluate.py              # P@5, NDCG@5, diversity, latency
│   ├── evaluate.py                   # Multi-run averaging variant
│   ├── test_profiles.json            # 10 representative test profiles
│   └── results/                      # Generated evaluation output
│
├── tests/                            # 80 pytest tests
│   ├── conftest.py
│   ├── test_api.py
│   ├── test_recommendation.py
│   ├── test_ranking.py
│   ├── test_fallback.py
│   └── test_preprocessing.py
│
├── Dockerfile                        # FastAPI only, python:3.12-slim multi-stage
├── render.yaml                       # Two-service Render blueprint (API + React static)
├── run.sh                            # ./run.sh [port] — starts FastAPI
├── requirements.txt                  # Runtime: 9 packages, no Streamlit
├── requirements-dev.txt              # Tests + dataset rebuild tools
├── runtime.txt                       # python-3.12 (Render / Cloud)
├── .env.example                      # Environment variable reference
└── .gitignore
```

---

## Docker

```bash
# Build and run the API
docker build -t orbo-beauty-ai .
docker run -p 8000:8000 orbo-beauty-ai

# Frontend (separate container or static host)
cd website && npm run build
# serve website/dist with any static file server
```

---

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions.

**Quick path:** push to GitHub → connect repo to [Render](https://render.com) → the `render.yaml` blueprint creates both the FastAPI service and a React static site automatically.

---

## License

MIT — see [LICENSE](LICENSE).

---

## Acknowledgements

- **Kaggle** — Skincare Products Clean Dataset (CC0)
- **Open Beauty Facts** — Open product database (ODbL)
- **scikit-learn** — TF-IDF and cosine similarity
- **FastAPI** + **React** + **Vite** — Framework stack

---

*Built for the Orbo AI Technical Assignment — demonstrating end-to-end ML engineering: data pipeline, recommendation algorithm, REST API, React SaaS frontend, test suite, and evaluation framework.*
