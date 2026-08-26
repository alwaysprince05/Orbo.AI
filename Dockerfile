# ──────────────────────────────────────────────────────────────────────────────
# Orbo Beauty AI — Docker image
# Builds the FastAPI recommendation API only.
# The React frontend (website/) is a static site built & served separately
# (e.g. Render static site, Vercel, or `npm run build` + any static host).
#
# Build:   docker build -t orbo-api .
# Run:     docker run -p 8000:8000 orbo-api
# Health:  curl http://localhost:8000/api/v1/health
# ──────────────────────────────────────────────────────────────────────────────

# ── Stage 1: install Python deps ─────────────────────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /build

RUN apt-get update && apt-get install -y --no-install-recommends \
        gcc g++ \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# ── Stage 2: lean runtime image ───────────────────────────────────────────────
FROM python:3.12-slim

WORKDIR /app

# OpenMP required by scikit-learn
RUN apt-get update && apt-get install -y --no-install-recommends \
        libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy Python packages from builder
COPY --from=builder /root/.local /root/.local

# Application source
COPY app/           ./app/
COPY data/processed ./data/processed/
COPY evaluation/    ./evaluation/
COPY .env.example   .env

ENV PATH=/root/.local/bin:$PATH \
    PYTHONPATH=/app \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/v1/health')" \
    || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
