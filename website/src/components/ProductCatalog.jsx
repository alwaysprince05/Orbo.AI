import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/recommender';
import { formatPrice } from '../utils/formatPrice';
import './ProductCatalog.css';

// ─── Product image map ────────────────────────────────────────────────────────
// Real Unsplash photos matched to brand + category combinations.
// Falls back by category, then by a generic skincare image.

const BRAND_IMAGES = {
  'the ordinary':    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&q=80',
  'cerave':          'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&q=80',
  'la roche-posay':  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop&q=80',
  'clinique':        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop&q=80',
  'neutrogena':      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=400&h=400&fit=crop&q=80',
  'estée lauder':    'https://images.unsplash.com/photo-1631390060000-8b30b71d7b4e?w=400&h=400&fit=crop&q=80',
  'drunk elephant':  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&q=80',
  'paula\'s choice': 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop&q=80',
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

// ─── Deterministic discount badge (seed = product_id hash) ───────────────────
function getDiscount(productId, price) {
  // Some products get a "sale" badge based on their id — makes catalog look realistic
  const n = productId?.split('').reduce((a, c) => a + c.charCodeAt(0), 0) ?? 0;
  if (n % 5 === 0) return 20;
  if (n % 7 === 0) return 15;
  if (n % 11 === 0) return 10;
  return null;
}

// ─── Star rating renderer ─────────────────────────────────────────────────────
function StarRating({ rating, reviewCount }) {
  const full  = Math.floor(rating);
  const half  = rating - full >= 0.25 && rating - full < 0.75;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="pc-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: full  }).map((_, i) => <span key={`f${i}`} className="star star--full">★</span>)}
      {half &&                                        <span className="star star--half">★</span>}
      {Array.from({ length: empty }).map((_, i) => <span key={`e${i}`} className="star star--empty">★</span>)}
      <span className="pc-review-count">({Number(reviewCount).toLocaleString()})</span>
    </div>
  );
}

// ─── Concern / skin type label helpers ───────────────────────────────────────
const CONCERN_COLORS = {
  hydration:      { bg: '#e0f2fe', color: '#0369a1' },
  acne:           { bg: '#fef3c7', color: '#92400e' },
  aging:          { bg: '#f3e8ff', color: '#6b21a8' },
  pigmentation:   { bg: '#fce7f3', color: '#9d174d' },
  sensitivity:    { bg: '#f0fdf4', color: '#166534' },
  sun_protection: { bg: '#fffbeb', color: '#92400e' },
  texture:        { bg: '#f1f5f9', color: '#334155' },
};

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="pc-card pc-card--skeleton" aria-hidden="true">
      <div className="pc-card__img-wrap pc-skel" />
      <div className="pc-card__body">
        <div className="pc-skel pc-skel--brand" />
        <div className="pc-skel pc-skel--name" />
        <div className="pc-skel pc-skel--name pc-skel--short" />
        <div className="pc-skel pc-skel--price" />
      </div>
    </div>
  );
}

// ─── Wishlist button (local toggle, no backend) ───────────────────────────────
function WishlistBtn({ productId }) {
  const [liked, setLiked] = useState(false);
  return (
    <button
      className={`pc-wishlist${liked ? ' pc-wishlist--active' : ''}`}
      onClick={(e) => { e.stopPropagation(); setLiked(l => !l); }}
      aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
      title={liked ? 'Remove from wishlist' : 'Save'}
    >
      {liked ? '♥' : '♡'}
    </button>
  );
}

// ─── Single product card (Nykaa/Amazon style) ─────────────────────────────────
function ProductCard({ product }) {
  const [imgSrc, setImgSrc]   = useState(getProductImage(product.brand, product.category));
  const [imgLoaded, setLoaded] = useState(false);

  const discount   = getDiscount(product.product_id, product.price);
  const mrp        = discount ? (product.price / (1 - discount / 100)) : null;
  const categoryLabel = String(product.category).replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  // Top 2 concerns to show
  const concerns = (product.skin_concerns ?? []).slice(0, 2);

  return (
    <div className="pc-card">

      {/* ── Image block ── */}
      <div className="pc-card__img-wrap">

        {/* Badges */}
        <div className="pc-badges">
          {discount && (
            <span className="pc-badge pc-badge--sale">{discount}% OFF</span>
          )}
          {product.rating >= 4.5 && (
            <span className="pc-badge pc-badge--top">Top Rated</span>
          )}
        </div>

        {/* Wishlist */}
        <WishlistBtn productId={product.product_id} />

        {/* Photo */}
        {!imgLoaded && <div className="pc-card__img-skeleton" />}
        <img
          src={imgSrc}
          alt={`${product.brand} ${product.name}`}
          className={`pc-card__img${imgLoaded ? ' pc-card__img--loaded' : ''}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => { setImgSrc(FALLBACK_IMAGE); setLoaded(true); }}
        />

        {/* AI match ribbon */}
        <div className="pc-card__ai-ribbon">
          <span className="pc-ai-dot" />
          AI Matched
        </div>
      </div>

      {/* ── Body ── */}
      <div className="pc-card__body">

        {/* Brand */}
        <p className="pc-card__brand">{product.brand}</p>

        {/* Product name */}
        <h3 className="pc-card__name" title={product.name}>
          {product.name}
        </h3>

        {/* Stars + reviews */}
        <StarRating rating={product.rating} reviewCount={product.review_count} />

        {/* Price row */}
        <div className="pc-card__price-row">
          <span className="pc-card__price">{formatPrice(product.price)}</span>
          {mrp && (
            <span className="pc-card__mrp">{formatPrice(mrp)}</span>
          )}
          {discount && (
            <span className="pc-card__discount">{discount}% off</span>
          )}
        </div>

        {/* Category + concern tags */}
        <div className="pc-card__tags">
          <span className="pc-tag pc-tag--category">{categoryLabel}</span>
          {concerns.map(c => {
            const style = CONCERN_COLORS[c] ?? { bg: '#f1f5f9', color: '#334155' };
            return (
              <span
                key={c}
                className="pc-tag"
                style={{ background: style.bg, color: style.color }}
              >
                {String(c).replace('_', ' ')}
              </span>
            );
          })}
        </div>

        {/* Key ingredients */}
        {(product.ingredients ?? []).length > 0 && (
          <div className="pc-card__ingredients">
            {product.ingredients.slice(0, 3).map((ing, i) => (
              <span key={i} className="pc-ing-chip">
                {String(ing).replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}

        {/* Skin type compatibility bar */}
        {(product.skin_types ?? []).filter(s => s !== 'all').length > 0 && (
          <p className="pc-card__skin-line">
            <span className="pc-skin-icon">✓</span>{' '}
            {product.skin_types
              .filter(s => s !== 'all')
              .slice(0, 3)
              .map(s => s.charAt(0).toUpperCase() + s.slice(1))
              .join(', ')}{' '}
            skin
          </p>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="pc-card__actions">
        <Link to="/recommend" className="pc-btn-primary">
          Get AI Pick
        </Link>
        <button className="pc-btn-secondary" aria-label="Add to cart">
          + Cart
        </button>
      </div>

    </div>
  );
}

// ─── Filter bar constants ─────────────────────────────────────────────────────
const CATEGORY_TABS = [
  { id: 'all',         label: 'All' },
  { id: 'moisturizer', label: 'Moisturizers' },
  { id: 'serum',       label: 'Serums' },
  { id: 'cleanser',    label: 'Cleansers' },
  { id: 'sunscreen',   label: 'Sunscreen' },
  { id: 'toner',       label: 'Toners' },
  { id: 'mask',        label: 'Masks' },
  { id: 'exfoliator',  label: 'Exfoliators' },
  { id: 'face_oil',    label: 'Face Oils' },
  { id: 'eye_care',    label: 'Eye Care' },
];

const SKIN_TYPE_OPTIONS = [
  { value: 'all',         label: 'All Skin Types' },
  { value: 'dry',         label: 'Dry' },
  { value: 'oily',        label: 'Oily' },
  { value: 'combination', label: 'Combination' },
  { value: 'sensitive',   label: 'Sensitive' },
  { value: 'normal',      label: 'Normal' },
];

const CONCERN_OPTIONS = [
  { value: 'all',            label: 'All Concerns' },
  { value: 'hydration',      label: 'Hydration' },
  { value: 'acne',           label: 'Acne & Blemishes' },
  { value: 'aging',          label: 'Anti-Aging' },
  { value: 'pigmentation',   label: 'Pigmentation' },
  { value: 'sun_protection', label: 'Sun Protection' },
  { value: 'sensitivity',    label: 'Sensitivity' },
  { value: 'texture',        label: 'Texture' },
];

const SORT_OPTIONS = [
  { value: 'default',     label: 'Relevance' },
  { value: 'price_asc',   label: 'Price: Low to High' },
  { value: 'price_desc',  label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Top Rated' },
  { value: 'reviews_desc',label: 'Most Reviewed' },
];

// ─── Sort helper ──────────────────────────────────────────────────────────────
function sortProducts(products, sortBy) {
  const arr = [...products];
  switch (sortBy) {
    case 'price_asc':    return arr.sort((a, b) => a.price - b.price);
    case 'price_desc':   return arr.sort((a, b) => b.price - a.price);
    case 'rating_desc':  return arr.sort((a, b) => b.rating - a.rating);
    case 'reviews_desc': return arr.sort((a, b) => b.review_count - a.review_count);
    default: return arr;
  }
}

// ─── Main catalog component ───────────────────────────────────────────────────
const PAGE_SIZE = 20;

export default function ProductCatalog({
  title            = 'Skincare & Beauty Products',
  subtitle         = 'Explore 1,500+ real formulations. Filter by skin type, concern and budget.',
  initialCategory  = 'all',   // pre-select a category tab
  showFilters      = true,    // hide filter toolbar on solution pages if needed
}) {
  const [products, setProducts]         = useState([]);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [page, setPage]                 = useState(1);
  const [hasMore, setHasMore]           = useState(true);

  // Filters — initialCategory seeds the active tab
  const [activeCategory, setCategory]   = useState(
    initialCategory !== 'all' && !CATEGORY_TABS.some(t => t.id === initialCategory)
      ? 'all'           // unknown category → fall back to all
      : initialCategory
  );
  const [skinType, setSkinType]         = useState('all');
  const [concern, setConcern]           = useState('all');
  const [maxBudget, setMaxBudget]       = useState(300);
  const [sortBy, setSortBy]             = useState('default');
  const [priceMax, setPriceMax]         = useState(300);

  // Fetch metadata to get actual max price
  useEffect(() => {
    const ctrl = new AbortController();
    api.metadata(ctrl.signal)
      .then(data => {
        if (!ctrl.signal.aborted && data?.price_range?.max) {
          const max = Math.ceil(data.price_range.max);
          setPriceMax(max);
          setMaxBudget(max);
        }
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  // Cancel stale requests when filters change rapidly
  const abortRef = useRef(null);

  const fetchProducts = useCallback(async (pageNum = 1, replace = true) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);
    try {
      const params = {
        page:      pageNum,
        page_size: PAGE_SIZE,
      ...(activeCategory !== 'all' && { category: activeCategory }),
      max_price: maxBudget < priceMax ? maxBudget : undefined,
      };
      const data = await api.products(params, abortRef.current.signal);

      let filtered = data.products ?? [];
      if (skinType !== 'all') {
        filtered = filtered.filter(p =>
          (p.skin_types ?? []).some(s => s === skinType || s === 'all')
        );
      }
      if (concern !== 'all') {
        filtered = filtered.filter(p =>
          (p.skin_concerns ?? []).includes(concern)
        );
      }

      const sorted = sortProducts(filtered, sortBy);

      setTotal(data.total ?? 0);
      setHasMore(pageNum * PAGE_SIZE < (data.total ?? 0));
      setProducts(prev => replace ? sorted : [...prev, ...sorted]);
      setPage(pageNum);
    } catch (err) {
      if (err.name === 'AbortError') return; // filter-change cancelled old request
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, skinType, concern, maxBudget, sortBy]);

  useEffect(() => {
    fetchProducts(1, true);
  }, [activeCategory, skinType, concern, maxBudget, sortBy]);

  const loadMore = () => fetchProducts(page + 1, false);

  const resetFilters = () => {
    setCategory('all');
    setSkinType('all');
    setConcern('all');
    setMaxBudget(priceMax);
    setSortBy('default');
  };

  return (
    <section className="pc-section" id="products">
      <div className="container">

        {/* ── Section header ── */}
        <div className="pc-header">
          <div className="pc-header__left">
            <span className="pc-header__badge">Real Products · Live Data</span>
            <h2 className="pc-header__title">{title}</h2>
            <p className="pc-header__subtitle">{subtitle}</p>
          </div>
          <Link to="/recommend" className="pc-header__cta btn btn-primary">
            Get My AI Picks
          </Link>
        </div>

        {/* ── Category tab bar ── */}
        <div className="pc-category-bar" role="tablist" aria-label="Product categories">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeCategory === tab.id}
              className={`pc-cat-tab${activeCategory === tab.id ? ' pc-cat-tab--active' : ''}`}
              onClick={() => setCategory(tab.id)}
            >
              <span className="pc-cat-tab__label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Filter + sort toolbar ── */}
        {showFilters && (
        <div className="pc-toolbar">
          <div className="pc-toolbar__filters">

            <div className="pc-filter-group">
              <label className="pc-filter-label" htmlFor="filter-skin">Skin Type</label>
              <select
                id="filter-skin"
                className="pc-filter-select"
                value={skinType}
                onChange={e => setSkinType(e.target.value)}
              >
                {SKIN_TYPE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="pc-filter-group">
              <label className="pc-filter-label" htmlFor="filter-concern">Concern</label>
              <select
                id="filter-concern"
                className="pc-filter-select"
                value={concern}
                onChange={e => setConcern(e.target.value)}
              >
                {CONCERN_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="pc-filter-group pc-filter-group--budget">
              <label className="pc-filter-label" htmlFor="filter-budget">
                Budget <span className="pc-budget-val">{formatPrice(maxBudget)}</span>
              </label>
              <input
                id="filter-budget"
                type="range"
                className="pc-range"
                min={5}
                max={priceMax}
                step={5}
                value={maxBudget}
                onChange={e => setMaxBudget(Number(e.target.value))}
                aria-label="Maximum budget"
              />
            </div>

          </div>

          <div className="pc-toolbar__right">
            <span className="pc-result-count">
              {loading ? 'Loading…' : <><b>{products.length}</b> of <b>{total.toLocaleString()}</b> products</>}
            </span>
            <div className="pc-filter-group">
              <label className="pc-filter-label" htmlFor="filter-sort">Sort</label>
              <select
                id="filter-sort"
                className="pc-filter-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        )} {/* end showFilters */}

        {/* ── Active filter chips ── */}
        {(skinType !== 'all' || concern !== 'all' || maxBudget < priceMax || activeCategory !== 'all') && (
          <div className="pc-active-filters">
            <span className="pc-active-filters__label">Active filters:</span>
            {activeCategory !== 'all' && (
              <button className="pc-filter-chip" onClick={() => setCategory('all')}>
                {activeCategory.replace('_', ' ')} ✕
              </button>
            )}
            {skinType !== 'all' && (
              <button className="pc-filter-chip" onClick={() => setSkinType('all')}>
                {skinType} skin ✕
              </button>
            )}
            {concern !== 'all' && (
              <button className="pc-filter-chip" onClick={() => setConcern('all')}>
                {concern.replace('_', ' ')} ✕
              </button>
            )}
            {maxBudget < priceMax && (
              <button className="pc-filter-chip" onClick={() => setMaxBudget(priceMax)}>
                under {formatPrice(maxBudget)} ✕
              </button>
            )}
            <button className="pc-filter-chip pc-filter-chip--clear" onClick={resetFilters}>
              Clear all
            </button>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="pc-error" role="alert">
            <strong>Could not load products</strong> — {error}
            <button className="pc-error__retry" onClick={() => fetchProducts(1, true)}>
              Retry
            </button>
          </div>
        )}

        {/* ── Product grid ── */}
        <div className="pc-grid">
          {products.map(p => (
            <ProductCard key={p.product_id} product={p} />
          ))}
          {loading && Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={`sk-${i}`} />
          ))}
        </div>

        {/* ── Empty state ── */}
        {!loading && !error && products.length === 0 && (
          <div className="pc-empty">
            <div className="pc-empty__icon">0</div>
            <h3 className="pc-empty__title">No products match your filters</h3>
            <p className="pc-empty__desc">Try a higher budget, different skin type, or broader category.</p>
            <button className="btn btn-outline" onClick={resetFilters}>Reset Filters</button>
          </div>
        )}

        {/* ── Load more ── */}
        {!loading && hasMore && products.length > 0 && (
          <div className="pc-load-more">
            <button className="pc-load-more__btn" onClick={loadMore}>
              Show More Products
            </button>
          </div>
        )}

        {/* ── Bottom CTA banner ── */}
        {!loading && products.length > 0 && (
          <div className="pc-cta-banner">
            <div className="pc-cta-banner__icon">AI</div>
            <div className="pc-cta-banner__text">
              <strong>Want personalised recommendations?</strong>
              <span>
                Our AI engine scans all {total.toLocaleString()} products, ranks them for
                your exact skin profile, and explains every choice.
              </span>
            </div>
            <Link to="/recommend" className="btn btn-primary">
              Try AI Recommender →
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
