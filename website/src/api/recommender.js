/**
 * Orbo Beauty AI — API client
 *
 * Dev:  requests go to /api/v1 — Vite proxies to http://localhost:8000
 * Prod: requests go to VITE_API_BASE_URL/api/v1 (set at build time)
 *
 * Every request has an AbortController so stale in-flight requests can be
 * cancelled (e.g. rapid filter changes in ProductCatalog), plus a hard
 * 30-second timeout to prevent hanging indefinitely.
 */

const BASE =
  import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api/v1`
    : '/api/v1';

const DEFAULT_TIMEOUT_MS = 30_000;

async function request(path, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), timeoutMs);

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

    return res.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw err;
  } finally {
    clearTimeout(timerId);
  }
}

export const api = {
  health: (signal) => request('/health', { signal }),

  metadata: () => request('/metadata'),

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
