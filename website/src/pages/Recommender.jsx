import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../api/recommender';
import { formatPrice } from '../utils/formatPrice';
import './Recommender.css';

// ─── Constants (no emojis — clean text only) ───────────────────────────────────

const SKIN_TYPE_COLORS = {
  dry: '#8B5CF6', oily: '#3B82F6', combination: '#F59E0B', normal: '#10B981', sensitive: '#EC4899',
};

const CONCERN_COLORS = {
  hydration: '#3B82F6', acne: '#EF4444', aging: '#8B5CF6', pigmentation: '#F59E0B',
  sensitivity: '#EC4899', texture: '#6B7280', sun_protection: '#F97316',
};

const SCORE_KEYS = [
  { key: 'skin_type',  label: 'Skin Type' },
  { key: 'concern',    label: 'Concerns' },
  { key: 'ingredient', label: 'Ingredients' },
  { key: 'budget',     label: 'Budget' },
  { key: 'rating',     label: 'Rating' },
  { key: 'content',    label: 'Content Similarity' },
  { key: 'hybrid',     label: 'Final Score', highlight: true },
];

function formatLabel(s) {
  return String(s).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// ── Product image mapping (same as ProductCatalog) ───────────────────────────
const BRAND_IMAGES = {
  'the ordinary':    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&q=80',
  'cerave':          'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&q=80',
  'la roche-posay':  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop&q=80',
  'clinique':        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop&q=80',
  'neutrogena':      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=400&h=400&fit=crop&q=80',
  'estee lauder':    'https://images.unsplash.com/photo-1631390060000-8b30b71d7b4e?w=400&h=400&fit=crop&q=80',
  'drunk elephant':  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&q=80',
  "paula's choice": 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop&q=80',
  'skinceuticals':   'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=400&fit=crop&q=80',
  'first aid beauty':'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop&q=80',
  'medik8':          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop&q=80',
  'the inkey list':  'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400&h=400&fit=crop&q=80',
  'weleda':          'https://images.unsplash.com/photo-1591375462475-4a68bb86fe73?w=400&h=400&fit=crop&q=80',
  'origins':         'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=400&fit=crop&q=80',
  'murad':           'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=400&fit=crop&q=80',
  'dermalogica':     'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop&q=80',
  'aveeno':          'https://images.unsplash.com/photo-1601049541271-f97d47b7e7b2?w=400&h=400&fit=crop&q=80',
  'bioderma':        'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=400&fit=crop&q=80',
  'nars':            'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&q=80',
  'shiseido':        'https://images.unsplash.com/photo-1532413992378-f169ac26fff0?w=400&h=400&fit=crop&q=80',
  'sanctuary':       'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=400&fit=crop&q=80',
  'neom':            'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop&q=80',
};

const CATEGORY_IMAGES = {
  moisturizer: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&q=80',
  serum:       'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&q=80',
  cleanser:    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop&q=80',
  sunscreen:   'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&q=80',
  toner:       'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop&q=80',
  mask:        'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=400&fit=crop&q=80',
  exfoliator:  'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400&h=400&fit=crop&q=80',
  face_oil:    'https://images.unsplash.com/photo-1591375462475-4a68bb86fe73?w=400&h=400&fit=crop&q=80',
  eye_care:    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=400&fit=crop&q=80',
  lip_care:    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&q=80',
  body_oil:    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=400&fit=crop&q=80',
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop&q=80';

function getProductImage(brand, category) {
  const key = String(brand).toLowerCase();
  return BRAND_IMAGES[key] ?? CATEGORY_IMAGES[category] ?? FALLBACK_IMAGE;
}

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
  const [imgSrc, setImgSrc] = useState(getProductImage(rec.brand, rec.category));
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <article className="rec-card">
      {/* Rank badge */}
      <div className="rank-badge" aria-label={`Rank ${rank}`}>{rank}</div>

      {/* Product image */}
      <div className="rec-card__img">
        {!imgLoaded && <div className="rec-card__img-skeleton" />}
        <img
          src={imgSrc}
          alt={rec.name}
          className={`rec-card__img-photo${imgLoaded ? ' rec-card__img-photo--loaded' : ''}`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgSrc(FALLBACK_IMAGE); setImgLoaded(true); }}
        />
      </div>

      {/* Main body */}
      <div className="rec-card__body">
        <div className="rec-card__name" title={rec.name}>
          {rec.name}
        </div>
        <div className="rec-card__meta">
          by <b>{rec.brand}</b> &middot; {formatLabel(rec.category)}
        </div>

        {/* Skin type + concern chips */}
        <div className="chip-row">
          {(rec.skin_types ?? []).slice(0, 3).map(st => (
            <span key={st} className="chip chip--skin">
              {st}
            </span>
          ))}
          {(rec.skin_concerns ?? []).slice(0, 3).map(c => (
            <span key={c} className="chip chip--concern">
              {formatLabel(c)}
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
            <summary>Score breakdown</summary>
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
        <div className="price-tag">{formatPrice(rec.price)}</div>
        <div className="rating-line">
          {rec.rating} / 5 &middot; {Number(rec.review_count).toLocaleString()} reviews
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
    const controller = new AbortController();
    api.metadata(controller.signal)
      .then(data => { if (!controller.signal.aborted) setMeta(data); })
      .catch(err => { if (!controller.signal.aborted) setMetaError(err.message); });
    return () => controller.abort();
  }, []);

  const toggleConcern = useCallback((c) => {
    setConcerns(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  }, []);

  const abortRef = useRef(null);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
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
      preferred_ingredients: preferredRaw.split(',').map(s => s.trim()).filter(Boolean),
      avoid_ingredients: avoidRaw.split(',').map(s => s.trim()).filter(Boolean),
      top_k: topK,
    };

    const t0 = performance.now();
    try {
      const data = await api.recommend(payload, abortRef.current.signal);
      setLatencyMs(Math.round(performance.now() - t0));
      setResult(data);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [skinType, concerns, category, noBudget, budget, preferredRaw, avoidRaw, topK]);

  const priceMin = meta?.price_range?.min ?? 5;
  const priceMax = meta?.price_range?.max ?? 300;

  // Set budget to max price once meta loads
  useEffect(() => {
    if (meta?.price_range?.max && budget < meta.price_range.max) {
      setBudget(Math.ceil(meta.price_range.max));
    }
  }, [meta]);

  return (
    <div className="rec-page">

      {/* ── Two-column layout ── */}
      <div className="rec-layout">

        {/* ── LEFT: Profile form ── */}
        <aside className="profile-panel">
          <div className="profile-panel__header">
            <h3>Your Skin Profile</h3>
            <p>Tell us about your skin to get personalized AI recommendations.</p>
          </div>
          <div className="profile-panel__body">
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
                <option value="">Let the AI decide</option>
                {(meta?.skin_types ?? ['dry','oily','combination','normal','sensitive']).map(st => (
                  <option key={st} value={st}>
                    {formatLabel(st)}
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
                    {formatLabel(c)}
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
                <option value="">All categories</option>
                {(meta?.categories ?? []).map(cat => (
                  <option key={cat} value={cat}>
                    {formatLabel(cat)}
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
                    <span className="budget-value">{formatPrice(budget)}</span>
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
                  Analyzing {meta?.total_products?.toLocaleString() ?? '1,581'} products...
                </>
              ) : (
                'Find My Products'
              )}
            </button>

          </form>

          {metaError && (
            <p style={{ fontSize: '0.78rem', color: '#b91c1c', marginTop: '1rem' }}>
              Could not connect to backend: {metaError}
            </p>
          )}
          </div>
        </aside>

        {/* ── RIGHT: Results ── */}
        <section className="results-col" aria-live="polite" aria-label="Recommendation results">

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
                    <span className="summary-badge__dot" />
                    {recs.length} recommendation{recs.length !== 1 ? 's' : ''}
                  </span>
                  <span className="summary-meta">
                    searched <b>{result.total_candidates?.toLocaleString()}</b> candidates
                    {result.filter_info?.category && (
                      <> &middot; {result.filter_info.category}</>
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
                    {result.fallback_message}
                  </div>
                )}

                {/* Cards */}
                {recs.length === 0 ? (
                  <div className="no-results">
                    <div className="no-results__icon">No matches found</div>
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

          {/* Empty state – visual guide */}
          {!loading && !error && !result && !hasSearched && (
            <div className="rec-empty">
              <div className="rec-empty__hero">
                <img
                  src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop&q=80"
                  alt="Skincare routine"
                  className="rec-empty__hero-img"
                />
                <div className="rec-empty__hero-overlay">
                  <div className="rec-empty__hero-title">Your Personalised Skincare Awaits</div>
                  <div className="rec-empty__hero-sub">6 AI stages analyze 1,581 products to find what fits your skin</div>
                </div>
              </div>
              <div className="rec-empty__steps">
                {[
                  { step: '01', title: 'Set Your Profile', desc: 'Choose skin type, concerns, and budget', color: '#EC4899' },
                  { step: '02', title: 'AI Filters Products', desc: '6-stage engine scores every product', color: '#8B5CF6' },
                  { step: '03', title: 'Get Explanations', desc: 'See why each product matches your skin', color: '#3B82F6' },
                ].map(s => (
                  <div key={s.step} className="rec-empty__step">
                    <div className="rec-empty__step-num" style={{ background: s.color }}>{s.step}</div>
                    <div className="rec-empty__step-title">{s.title}</div>
                    <div className="rec-empty__step-desc">{s.desc}</div>
                  </div>
                ))}
              </div>
              <div className="rec-empty__tip">
                <span className="rec-empty__tip-icon">i</span>
                <span>Pro tip: The more details you provide, the better the recommendations. Try selecting a skin type and at least one concern.</span>
              </div>
            </div>
          )}

        </section>
      </div>
    </div>
  );
}
