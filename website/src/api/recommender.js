/**
 * Orbo Beauty AI — API client
 *
 * Dev:  requests go to /api/v1 — Vite proxies to http://localhost:8000
 * Prod: requests go to VITE_API_BASE_URL/api/v1 (set at build time)
 *
 * Features:
 * - Cold-start retry: retries up to 3 times with exponential backoff
 *   (Render free tier sleeps after inactivity, first request takes 30-60s)
 * - Per-request AbortController for cancellation
 * - 60s timeout per attempt (cold starts need more time)
 */

const BASE =
  import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api/v1`
    : '/api/v1';

const TIMEOUT_MS = 60_000;      // 60s per attempt (cold start can be slow)
const MAX_RETRIES = 3;           // retry up to 3 times
const INITIAL_BACKOFF_MS = 2000; // start at 2s, then 4s, then 8s

// Global flag so UI can show "server warming up" banner
let _isColdStart = true;
export function isColdStart() { return _isColdStart; }
export function markWarmedUp() { _isColdStart = false; }

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function request(path, options = {}, retries = MAX_RETRIES) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timerId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(`${BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        ...options,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(`API ${res.status}: ${text}`);
      }

      // Success — mark server as warm
      if (_isColdStart) markWarmedUp();
      return res.json();
    } catch (err) {
      clearTimeout(timerId);
      lastError = err;

      // Don't retry if user cancelled
      if (err.name === 'AbortError' && options.signal?.aborted) {
        throw new Error('Request cancelled.');
      }

      // Don't retry on 4xx client errors (but do retry timeouts / network errors)
      if (err.message?.startsWith('API 4')) {
        throw err;
      }

      // If we have retries left, wait with backoff
      if (attempt < retries) {
        const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
        await sleep(backoff);
        continue;
      }
    } finally {
      clearTimeout(timerId);
    }
  }

  // All retries exhausted
  if (lastError?.name === 'AbortError') {
    throw new Error('Server is waking up — please wait a moment and try again.');
  }
  throw lastError;
}

export const api = {
  health: (signal) => request('/health', { signal }),

  metadata: (signal) => request('/metadata', signal ? { signal } : {}),

  /** @param {AbortSignal} [signal] Pass controller.signal to cancel on unmount */
  recommend: (payload, signal) =>
    request('/recommend', {
      method: 'POST',
      body: JSON.stringify(payload),
      ...(signal ? { signal } : {}),
    }),

  /**
   * @param {Record<string,any>} params
   * @param {AbortSignal} [signal]
   */
  products: (params = {}, signal) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(
        ([, v]) => v !== undefined && v !== null && v !== ''
      )
    ).toString();
    return request(`/products${qs ? `?${qs}` : ''}`, signal ? { signal } : {});
  },
};
