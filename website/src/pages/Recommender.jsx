import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../api/recommender';
import './Recommender.css';

// ─── Constants ───────────────────────────────────────────────────────────────

const SKIN_TYPE_ICONS = {
  dry: '🌵', oily: '💧', combination: '🌗', normal: '🌿', sensitive: '🌸',
};

const CATEGORY_ICONS = {
  moisturizer: '🧴', cleanser: '🫧', serum: '💉', sunscreen: '🌞',
  toner: '💦', exfoliator: '✨', mask: '🎭', eye_care: '👁️',
  lip_care: '💋', face_oil: '🫒', body_oil: '🧖', other: '🛍️',
};

const CONCERN_ICONS = {
  hydration: '💧', acne: '🎯', aging: '⏳', pigmentation: '🌟',
  sensitivity: '🌸', texture: '✨', sun_protection: '☀️',
};

const PIPELINE_STEPS = [
  { icon: '🔍', name: 'Hard Filter' },
  { icon: '🧬', name: 'TF-IDF Content' },
  { icon: '⚖️', name: 'Preference Score' },
  { icon: '🔀', name: 'Hybrid Rank' },
  { icon: '🌈', name: 'MMR Diversity' },
  { icon: '💡', name: 'Explanations' },
];

const SCORE_KEYS = [
  { key: 'skin_type',  label: 'Skin Type' },
  { key: 'concern',    label: 'Concerns' },
  { key: 'ingredient', label: 'Ingredients' },
  { key: 'budget',     label: 'Budget' },
  { key: 'rating',     label: 'Rating' },
  { key: 'content',    label: 'Content Sim.' },
  { key: 'hybrid',     label: '🏆 Final Score', highlight: true },
];

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function SkeletonCards({ count = 5 }) {
  return (
    <div className="loading-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card" />
      ))}
    </div>
  );
}

// ─── Single recommendation card ───────────────────────────────────────────────

function RecCard({ rec, rank }) {
  const categoryIcon = CATEGORY_ICONS[rec.category] ?? '🧴';

  return (
    <article className="rec-card">
      {/* Rank badge */}
      <div className="rank-badge" aria-label={`Rank ${rank}`}>{rank}</div>

      {/* Main body */}
      <div className="rec-card__body">
        <div
          className="rec-card__name"
          title={rec.name}
        >
          {categoryIcon} {rec.name}
        </div>
        <div className="rec-card__meta">
          by <b>{rec.brand}</b> ·{' '}
          {String(rec.category).replace('_', ' ')
            .replace(/\b\w/g, c => c.toUpperCase())}
        </div>

        {/* Skin type + concern chips */}
        <div className="chip-row">
          {(rec.skin_types ?? []).slice(0, 3).map(st => (
            <span key={st} className="chip chip--skin">
              {SKIN_TYPE_ICONS[st] ?? '🌿'} {st}
            </span>
          ))}
          {(rec.skin_concerns ?? []).slice(0, 3).map(c => (
            <span key={c} className="chip chip--concern">
              {String(c).replace('_', ' ')}
            </span>
          ))}
        </div>

        {/* Key ingredients from matching */}
        {(rec.matching_attributes?.preferred_ingredients_matched ?? []).length > 0 && (
          <div className="chip-row" style={{ marginTop: '-0.4rem' }}>
            {rec.matching_attributes.preferred_ingredients_matched.map(ing => (
              <span key={ing} className="chip chip--ingredient">{ing}</span>
            ))}
          </div>
        )}

        {/* Why we recommend it */}
        {(rec.reasons ?? []).length > 0 && (
          <>
            <div className="rec-card__section-title">Why we recommend it</div>
            <ul className="reasons-list">
              {rec.reasons.slice(0, 4).map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </>
        )}

        {/* Warnings */}
        {(rec.warnings ?? []).length > 0 && (
          <>
            <div className="rec-card__section-title">Good to know</div>
            <ul className="warnings-list">
              {rec.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </>
        )}

        {/* Score breakdown */}
        {rec.score_breakdown && (
          <details className="score-accordion">
            <summary>📊 Score breakdown</summary>
            {SCORE_KEYS.map(({ key, label, highlight }) => {
              const val = rec.score_breakdown[key];
              if (val == null) return null;
              const pct = Math.round(val * 100);
              return (
                <div key={key} className="score-bar-row">
                  <span className="score-bar-label">{label}</span>
                  <div className="score-bar-track">
                    <div
                      className={`score-bar-fill${highlight ? ' score-bar-fill--hybrid' : ''}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <span className="score-bar-pct">{pct}%</span>
                </div>
              );
            })}
          </details>
        )}
      </div>

      {/* Right column: score + price */}
      <div className="rec-card__score-col">
        <div>
          <div className="match-pct">{rec.match_percentage}%</div>
          <div className="match-label">match</div>
        </div>
        <div className="match-bar">
          <div
            className="match-bar-fill"
            style={{ width: `${Math.min(rec.match_percentage, 100)}%` }}
          />
        </div>
        <div className="price-tag">${Number(rec.price).toFixed(2)}</div>
        <div className="rating-line">
          ⭐ {rec.rating} · {Number(rec.review_count).toLocaleString()} reviews
        </div>
      </div>
    </article>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Recommender() {
  // Meta from API
  const [meta, setMeta] = useState(null);
  const [metaError, setMetaError] = useState(null);

  // Form state
  const [skinType, setSkinType] = useState('');
  const [concerns, setConcerns] = useState([]);
  const [category, setCategory] = useState('');
  const [noBudget, setNoBudget] = useState(true);
  const [budget, setBudget] = useState(50);
  const [preferredRaw, setPreferredRaw] = useState('');
  const [avoidRaw, setAvoidRaw] = useState('');
  const [topK, setTopK] = useState(5);

  // Results state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [latencyMs, setLatencyMs] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch metadata on mount
  useEffect(() => {
    api.metadata()
      .then(setMeta)
      .catch(err => setMetaError(err.message));
  }, []);

  const toggleConcern = useCallback((c) => {
    setConcerns(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  }, []);

  // Ref to cancel in-flight recommend requests
  const abortRef = useRef(null);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Cancel any in-flight request from a previous submit
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);
    setResult(null);
    setHasSearched(true);

    const payload = {
      skin_type: skinType || null,
      concerns,
      category: category || null,
      budget: noBudget ? null : budget,
      preferred_ingredients: preferredRaw
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      avoid_ingredients: avoidRaw
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      top_k: topK,
    };

    const t0 = performance.now();
    try {
      const data = await api.recommend(payload, abortRef.current.signal);
      setLatencyMs(Math.round(performance.now() - t0));
      setResult(data);
    } catch (err) {
      if (err.name === 'AbortError') return; // intentionally cancelled
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [skinType, concerns, category, noBudget, budget, preferredRaw, avoidRaw, topK]);

  const priceMin = meta?.price_range?.min ?? 5;
  const priceMax = meta?.price_range?.max ?? 300;
  const priceMedian = meta?.price_range?.median ?? 25;

  return (
    <div className="rec-page">

      {/* ── Hero ── */}
      <section className="rec-hero">
        <div className="container">
          <div className="rec-hero__badge">AI-Powered Skincare Finder</div>
          <h1 className="rec-hero__title">
            Find Products Built<br />
            <span className="highlight">For Your Skin</span>
          </h1>
          <p className="rec-hero__sub">
            Tell us about your skin. Our 6-stage recommendation engine searches{' '}
            {meta ? `${meta.total_products.toLocaleString()}` : '1,581'} products
            and explains exactly why each one fits you.
          </p>
          {meta && (
            <div className="rec-hero__stats">
              <span className="rec-hero__stat">
                🧴 <b>{meta.total_products.toLocaleString()}</b> products
              </span>
              <span className="rec-hero__stat">
                🏷️ <b>{meta.brands?.length ?? '—'}</b> brands
              </span>
              <span className="rec-hero__stat">
                💰 <b>${meta.price_range.min}</b>–<b>${meta.price_range.max}</b>
              </span>
              <span className="rec-hero__stat">
                ⭐ avg <b>{meta.rating_range.mean}</b> / 5
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ── Two-column layout ── */}
      <div className="rec-layout">

        {/* ── LEFT: Profile form ── */}
        <aside className="profile-panel">
          <div className="profile-panel__title">🌸 Your Skin Profile</div>

          <form onSubmit={handleSubmit} noValidate>

            {/* Skin type */}
            <div className="field-group">
              <label className="field-label" htmlFor="skin-type">Skin Type</label>
              <select
                id="skin-type"
                className="field-select"
                value={skinType}
                onChange={e => setSkinType(e.target.value)}
              >
                <option value="">✨ Let the AI decide</option>
                {(meta?.skin_types ?? ['dry','oily','combination','normal','sensitive']).map(st => (
                  <option key={st} value={st}>
                    {SKIN_TYPE_ICONS[st] ?? ''} {st.charAt(0).toUpperCase() + st.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Concerns */}
            <div className="field-group">
              <label className="field-label">Skin Concerns</label>
              <div className="concern-grid">
                {(meta?.concerns ?? ['hydration','acne','aging','pigmentation','sensitivity','texture','sun_protection']).map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`concern-pill${concerns.includes(c) ? ' concern-pill--active' : ''}`}
                    onClick={() => toggleConcern(c)}
                    aria-pressed={concerns.includes(c)}
                  >
                    {CONCERN_ICONS[c] ?? ''}{' '}
                    {String(c).replace('_', ' ').replace(/\b\w/g, ch => ch.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            <div className="profile-divider" />

            {/* Category */}
            <div className="field-group">
              <label className="field-label" htmlFor="category">Product Category</label>
              <select
                id="category"
                className="field-select"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="">🛍️ All categories</option>
                {(meta?.categories ?? []).map(cat => (
                  <option key={cat} value={cat}>
                    {CATEGORY_ICONS[cat] ?? '🧴'}{' '}
                    {String(cat).replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div className="field-group">
              <div className="budget-row">
                <label className="field-label" style={{ margin: 0 }}>Budget</label>
                <label className="budget-toggle">
                  <input
                    type="checkbox"
                    checked={noBudget}
                    onChange={e => setNoBudget(e.target.checked)}
                  />
                  No limit
                </label>
              </div>
              {!noBudget && (
                <>
                  <div className="budget-row" style={{ marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      Max price
                    </span>
                    <span className="budget-value">${budget}</span>
                  </div>
                  <input
                    type="range"
                    className="range-slider"
                    min={Math.floor(priceMin)}
                    max={Math.ceil(priceMax)}
                    step={5}
                    value={budget}
                    onChange={e => setBudget(Number(e.target.value))}
                    aria-label="Maximum budget"
                  />
                </>
              )}
            </div>

            <div className="profile-divider" />

            {/* Preferred ingredients */}
            <div className="field-group">
              <label className="field-label" htmlFor="prefer-ing">
                Preferred Ingredients
              </label>
              <input
                id="prefer-ing"
                className="field-input"
                type="text"
                placeholder="ceramide, hyaluronic acid, niacinamide"
                value={preferredRaw}
                onChange={e => setPreferredRaw(e.target.value)}
              />
              {meta?.top_ingredients?.length > 0 && (
                <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                  Popular: {meta.top_ingredients.slice(0, 6).join(', ')}
                </div>
              )}
            </div>

            {/* Avoid ingredients */}
            <div className="field-group">
              <label className="field-label" htmlFor="avoid-ing">
                Avoid Ingredients
              </label>
              <input
                id="avoid-ing"
                className="field-input"
                type="text"
                placeholder="fragrance, alcohol, sulfates"
                value={avoidRaw}
                onChange={e => setAvoidRaw(e.target.value)}
              />
            </div>

            <div className="profile-divider" />

            {/* Top K */}
            <div className="field-group">
              <label className="field-label">Show Top</label>
              <div className="topk-row">
                <input
                  type="range"
                  className="range-slider"
                  min={1}
                  max={20}
                  step={1}
                  value={topK}
                  onChange={e => setTopK(Number(e.target.value))}
                  aria-label="Number of results"
                />
                <span className="topk-val">{topK}</span>
              </div>
            </div>

            <button
              type="submit"
              className="rec-submit-btn"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner" aria-hidden="true" />
                  Analyzing {meta?.total_products?.toLocaleString() ?? '1,581'} products…
                </>
              ) : (
                '✨ Find My Products'
              )}
            </button>

          </form>

          {metaError && (
            <p style={{ fontSize: '0.78rem', color: '#b91c1c', marginTop: '1rem' }}>
              ⚠️ Could not connect to backend: {metaError}
            </p>
          )}
        </aside>

        {/* ── RIGHT: Results ── */}
        <section className="results-col" aria-live="polite" aria-label="Recommendation results">

          {/* Pipeline explainer — always visible */}
          <div className="pipeline-strip" role="img" aria-label="6-stage recommendation pipeline">
            {PIPELINE_STEPS.map((step, i) => (
              <React.Fragment key={step.name}>
                <div className="pipeline-step">
                  <span className="pipeline-step__icon" aria-hidden="true">{step.icon}</span>
                  <span className="pipeline-step__name">{step.name}</span>
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <span className="pipeline-arrow" aria-hidden="true">→</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Loading */}
          {loading && <SkeletonCards count={topK} />}

          {/* Error */}
          {!loading && error && (
            <div className="rec-error" role="alert">
              <b>Something went wrong</b>
              {error}
            </div>
          )}

          {/* Results */}
          {!loading && !error && result && (() => {
            const recs = result.recommendations ?? [];
            return (
              <>
                {/* Summary bar */}
                <div className="results-summary" role="status">
                  <span className="summary-badge">
                    <span>✅</span>
                    {recs.length} recommendation{recs.length !== 1 ? 's' : ''}
                  </span>
                  <span className="summary-meta">
                    searched <b>{result.total_candidates?.toLocaleString()}</b> candidates
                    {result.filter_info?.category && (
                      <> · {result.filter_info.category}</>
                    )}
                  </span>
                  {latencyMs != null && (
                    <span className="summary-latency">
                      <span className="dot" aria-hidden="true" />
                      {latencyMs < 1000
                        ? `${latencyMs}ms`
                        : `${(latencyMs / 1000).toFixed(1)}s`}
                    </span>
                  )}
                </div>

                {/* Fallback notice */}
                {result.is_fallback && result.fallback_message && (
                  <div className="fallback-notice" role="note">
                    ℹ️ {result.fallback_message}
                  </div>
                )}

                {/* Cards */}
                {recs.length === 0 ? (
                  <div className="no-results">
                    <div className="no-results__icon">😔</div>
                    <div className="no-results__title">No matches found</div>
                    <div className="no-results__desc">
                      Try relaxing your budget, removing the category filter,
                      or clearing the "avoid ingredients" field.
                    </div>
                  </div>
                ) : (
                  <div className="rec-cards-list">
                    {recs.map((rec, i) => (
                      <RecCard key={rec.product_id} rec={rec} rank={i + 1} />
                    ))}
                  </div>
                )}
              </>
            );
          })()}

          {/* Initial placeholder — before first search */}
          {!loading && !error && !result && !hasSearched && (
            <div className="rec-placeholder">
              <div className="rec-placeholder__icon">🧴✨</div>
              <div className="rec-placeholder__title">Set your skin profile</div>
              <div className="rec-placeholder__desc">
                Choose your skin type, concerns, and budget in the panel on the left,
                then hit <strong>Find My Products</strong>. Every result comes with a
                match score and the exact reasons it fits your skin.
              </div>
            </div>
          )}

        </section>
      </div>
    </div>
  );
}
