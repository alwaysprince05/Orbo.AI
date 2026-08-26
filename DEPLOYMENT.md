# Deployment Guide — Orbo Beauty AI

The system has two parts: a **FastAPI backend** (Python) and a **React/Vite frontend** (static SPA).
They are independent and can be deployed separately or together.

---

## Option A — Render Blueprint (recommended, single command)

`render.yaml` in the repo root defines both services as a Render Blueprint.

### Steps

1. Push this repository to a **public GitHub repository**.

2. Go to [render.com](https://render.com) → **New** → **Blueprint** → connect the repo.

3. Render reads `render.yaml` and creates:
   - `orbo-api` → FastAPI on `https://orbo-api-xxxx.onrender.com`
   - `orbo-frontend` → React static site on `https://orbo-frontend-xxxx.onrender.com`

4. **After the API is live**, open the `orbo-frontend` service → **Environment** → add:
   ```
   VITE_API_BASE_URL = https://orbo-api-xxxx.onrender.com
   ```
   Then click **Manual Deploy → Deploy latest commit**.

5. Open the frontend URL and go to `/recommend`.

> Render free instances sleep after 15 min of inactivity. The first request after a cold start takes ~30–60 s. Subsequent requests answer in < 30 ms.

---

## Option B — Separate deploys

### Backend — any Python host

```bash
# Build command
pip install -r requirements.txt

# Start command
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Health check path: `/api/v1/health`

Works on: Render, Railway, Fly.io, AWS Lambda (with Mangum adapter), Google Cloud Run.

### Frontend — any static host

```bash
cd website
VITE_API_BASE_URL=https://your-api-url.com npm run build
# deploy website/dist to Vercel, Netlify, Cloudflare Pages, or S3
```

For client-side React Router to work, configure your host to rewrite all paths to `index.html`:
- **Vercel / Netlify**: automatic for SPA projects
- **Cloudflare Pages**: add `_redirects` with `/* /index.html 200`
- **Nginx**: `try_files $uri /index.html`

---

## Option C — Local / Docker

### Local (fastest)

```bash
# Backend
./run.sh                        # FastAPI on :8000

# Frontend (separate terminal)
cd website && npm run dev       # Vite on :3000
```

Open http://localhost:3000 — Vite proxies `/api/*` to `:8000` automatically.

### Docker (API only)

```bash
docker build -t orbo-beauty-ai .
docker run -p 8000:8000 orbo-beauty-ai
```

Frontend can be served separately:
```bash
cd website && npm run build
npx serve website/dist -p 3000
```

---

## Environment Variables

| Variable | Default | Service | Notes |
|---|---|---|---|
| `PRODUCTS_PATH` | `data/processed/products_processed.parquet` | API | Path to product catalog |
| `MODEL_PATH` | `data/processed/content_model.joblib` | API | Fitted TF-IDF model |
| `VITE_API_BASE_URL` | _(empty = use Vite proxy)_ | Frontend build | Set to live API URL for production builds |
| `PORT` | 8000 | API | Injected by platform (Render, Railway, etc.) |

See [`.env.example`](.env.example) for a local copy template.

---

## Smoke Test After Deploy

```bash
# 1. Health check
curl https://your-api-url.com/api/v1/health
# → {"status":"healthy","model_loaded":true,"products_loaded":1581}

# 2. Metadata
curl https://your-api-url.com/api/v1/metadata | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['total_products'], 'products')"

# 3. Recommend
curl -s -X POST https://your-api-url.com/api/v1/recommend \
  -H "Content-Type: application/json" \
  -d '{"skin_type":"dry","concerns":["hydration"],"category":"moisturizer","budget":50,"top_k":3}' \
  | python3 -c "import json,sys; recs=json.load(sys.stdin)['recommendations']; [print(r['match_percentage'],'%', r['name'][:50]) for r in recs]"
```

Expected output for test 3:
```
94 % CeraVe Facial Moisturising Lotion SPF 25 52ml
91 % CeraVe Facial Moisturising Lotion No SPF 52ml
82 % The Ordinary Natural Moisturising Factors + HA 30ml
```

---

## Cold-Start Notes

The FastAPI startup loads both the Parquet catalog (~1 MB) and the fitted TF-IDF matrix (~1.9 MB joblib). On a Render free instance this takes ~5–10 seconds. The `/api/v1/health` endpoint returns `model_loaded: false` until startup completes — the React frontend will show an API connection error during this window, which resolves automatically on the next request.
