#!/usr/bin/env bash
# Start the Orbo Beauty AI FastAPI backend.
#
#   ./run.sh          → FastAPI on :8000  (default)
#   ./run.sh 9000     → FastAPI on a custom port
#
# Frontend: cd website && npm run dev   (React/Vite on :3000, proxies /api → :8000)

set -euo pipefail
cd "$(dirname "$0")"

PORT="${1:-8000}"

# Prefer the project venv; fall back to system python.
if [[ -x "venv/bin/python" ]]; then
  PY="./venv/bin/python"
else
  PY="$(command -v python3.12 2>/dev/null || command -v python3)"
  echo "⚠  venv/bin/python not found — using $PY"
  echo "   Rebuild the venv if imports fail:"
  echo "     rm -rf venv && python3.12 -m venv venv"
  echo "     source venv/bin/activate && pip install -r requirements.txt"
fi

if ! "$PY" -c "import fastapi" >/dev/null 2>&1; then
  echo "✗ fastapi not importable. Rebuild the venv:"
  echo "    rm -rf venv && python3.12 -m venv venv"
  echo "    source venv/bin/activate && pip install -r requirements.txt"
  exit 1
fi

echo "→ FastAPI  http://localhost:${PORT}/api/v1/health"
echo "→ Swagger  http://localhost:${PORT}/docs"
echo ""
exec "$PY" -m uvicorn app.main:app --host 0.0.0.0 --port "$PORT" --reload
