import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/recommender';
import { formatPrice } from '../utils/formatPrice';
import './ProductDetail.css';

// Reuse image logic from ProductCatalog
const BRAND_IMAGES = {
  'the ordinary':    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop&q=80',
  'cerave':          'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop&q=80',
  'la roche-posay':  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop&q=80',
  'clinique':        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop&q=80',
  'neutrogena':      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=600&h=600&fit=crop&q=80',
  'estée lauder':    'https://images.unsplash.com/photo-1631390060000-8b30b71d7b4e?w=600&h=600&fit=crop&q=80',
  'drunk elephant':  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop&q=80',
  "paula's choice":  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&h=600&fit=crop&q=80',
  'skinceuticals':   'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&h=600&fit=crop&q=80',
  'first aid beauty':'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&h=600&fit=crop&q=80',
  'medik8':          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop&q=80',
  'the inkey list':  'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=600&h=600&fit=crop&q=80',
  'weleda':          'https://images.unsplash.com/photo-1591375462475-4a68bb86fe73?w=600&h=600&fit=crop&q=80',
  'origins':         'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=600&fit=crop&q=80',
  'murad':           'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&h=600&fit=crop&q=80',
  'dermalogica':     'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=600&fit=crop&q=80',
  'aveeno':          'https://images.unsplash.com/photo-1601049541271-f97d47b7e7b2?w=600&h=600&fit=crop&q=80',
  'bioderma':        'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&h=600&fit=crop&q=80',
  'nars':            'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop&q=80',
  'shiseido':        'https://images.unsplash.com/photo-1532413992378-f169ac26fff0?w=600&h=600&fit=crop&q=80',
};

const CATEGORY_IMAGES = {
  moisturizer: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop&q=80',
  serum:       'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop&q=80',
  cleanser:    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop&q=80',
  sunscreen:   'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop&q=80',
  toner:       'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&h=600&fit=crop&q=80',
  mask:        'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&h=600&fit=crop&q=80',
  exfoliator:  'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=600&h=600&fit=crop&q=80',
  face_oil:    'https://images.unsplash.com/photo-1591375462475-4a68bb86fe73?w=600&h=600&fit=crop&q=80',
  eye_care:    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&h=600&fit=crop&q=80',
  lip_care:    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop&q=80',
  body_oil:    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=600&fit=crop&q=80',
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop&q=80';

function getProductImage(brand, category) {
  const key = String(brand).toLowerCase();
  return BRAND_IMAGES[key] ?? CATEGORY_IMAGES[category] ?? FALLBACK_IMAGE;
}

const CONCERN_COLORS = {
  hydration:      { bg: '#e0f2fe', color: '#0369a1' },
  acne:           { bg: '#fef3c7', color: '#92400e' },
  aging:          { bg: '#f3e8ff', color: '#6b21a8' },
  pigmentation:   { bg: '#fce7f3', color: '#9d174d' },
  sensitivity:    { bg: '#f0fdf4', color: '#166534' },
  sun_protection: { bg: '#fffbeb', color: '#92400e' },
  texture:        { bg: '#f1f5f9', color: '#334155' },
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inCart, setInCart] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);
    setInCart(false);
    setImgLoaded(false);

    const ctrl = new AbortController();
    api.products({ page: 1, page_size: 200 }, ctrl.signal)
      .then(data => {
        if (ctrl.signal.aborted) return;
        const found = (data.products ?? []).find(p => p.product_id === id);
        if (found) {
          setProduct(found);
          // Get related products (same category, different product)
          const relatedProducts = (data.products ?? [])
            .filter(p => p.product_id !== id && p.category === found.category)
            .slice(0, 5);
          setRelated(relatedProducts);
        } else {
          setError('Product not found');
        }
      })
      .catch(err => {
        if (!ctrl.signal.aborted) setError(err.message);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });

    return () => ctrl.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="pd-page">
        <div className="pd-loading">
          <div className="pd-loading__spinner" />
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pd-page">
        <div className="pd-error">
          <h2>Product not found</h2>
          <p>{error || 'The product you are looking for does not exist.'}</p>
          <Link to="/" className="pd-btn pd-btn--primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  const imgSrc = getProductImage(product.brand, product.category);
  const categoryLabel = String(product.category).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const discount = product.price > 100 ? Math.floor(Math.random() * 3 + 1) * 5 : null;
  const mrp = discount ? Math.round(product.price / (1 - discount / 100)) : null;

  return (
    <div className="pd-page">
      {/* Breadcrumb */}
      <div className="pd-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/#products">Products</Link>
        <span>/</span>
        <span className="pd-breadcrumb__current">{product.brand}</span>
      </div>

      {/* Main product section */}
      <div className="pd-main">
        {/* Left: Image */}
        <div className="pd-images">
          <div className="pd-main-image">
            {!imgLoaded && <div className="pd-img-skeleton" />}
            <img
              src={imgSrc}
              alt={`${product.brand} ${product.name}`}
              className={imgLoaded ? 'pd-img--loaded' : ''}
              onLoad={() => setImgLoaded(true)}
            />
          </div>
        </div>

        {/* Right: Info */}
        <div className="pd-info">
          <p className="pd-brand">{product.brand}</p>
          <h1 className="pd-title">{product.name}</h1>

          {/* Rating */}
          <div className="pd-rating">
            <span className="pd-rating__badge">
              {product.rating} ★
            </span>
            <span className="pd-rating__count">
              {Number(product.review_count).toLocaleString()} ratings
            </span>
          </div>

          {/* Price */}
          <div className="pd-price">
            <span className="pd-price__current">{formatPrice(product.price)}</span>
            {mrp && <span className="pd-price__mrp">{formatPrice(mrp)}</span>}
            {discount && <span className="pd-price__discount">Extra {discount}% off</span>}
          </div>

          {/* Description */}
          <div className="pd-section">
            <h3 className="pd-section__title">Description</h3>
            <p className="pd-desc">
              {product.name} by {product.brand} is a premium {categoryLabel.toLowerCase()} 
              formulated for {product.skin_types?.join(', ').toLowerCase() || 'all'} skin types. 
              Key ingredients include {(product.ingredients ?? []).slice(0, 4).join(', ')} for 
              effective care targeting {(product.skin_concerns ?? []).join(' and ').replace(/_/g, ' ')} concerns.
            </p>
          </div>

          {/* Skin Types */}
          {product.skin_types?.length > 0 && (
            <div className="pd-section">
              <h3 className="pd-section__title">Suitable For</h3>
              <div className="pd-tags">
                {product.skin_types.map(s => (
                  <span key={s} className="pd-tag pd-tag--skin">
                    ✓ {s.charAt(0).toUpperCase() + s.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Concerns */}
          {product.skin_concerns?.length > 0 && (
            <div className="pd-section">
              <h3 className="pd-section__title">Targets</h3>
              <div className="pd-tags">
                {product.skin_concerns.map(c => {
                  const style = CONCERN_COLORS[c] ?? { bg: '#f1f5f9', color: '#334155' };
                  return (
                    <span key={c} className="pd-tag" style={{ background: style.bg, color: style.color }}>
                      {c.replace(/_/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase())}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ingredients */}
          {product.ingredients?.length > 0 && (
            <div className="pd-section">
              <h3 className="pd-section__title">Key Ingredients</h3>
              <div className="pd-tags">
                {product.ingredients.map((ing, i) => (
                  <span key={i} className="pd-tag pd-tag--ingredient">
                    {String(ing).replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pd-actions">
            <button
              className={`pd-btn pd-btn--cart${inCart ? ' pd-btn--added' : ''}`}
              onClick={() => setInCart(true)}
            >
              {inCart ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
            <button
              className="pd-btn pd-btn--buy"
              onClick={() => {
                setInCart(true);
                alert(`Order placed for ${product.name} at ${formatPrice(product.price)}! (Demo)`);
              }}
            >
              Buy Now at {formatPrice(product.price)}
            </button>
          </div>

          {/* Delivery info */}
          <div className="pd-delivery">
            <div className="pd-delivery__item">
              <span className="pd-delivery__icon">🚚</span>
              <div>
                <strong>Free Delivery</strong>
                <p>Delivery by Tomorrow, 11 PM</p>
              </div>
            </div>
            <div className="pd-delivery__item">
              <span className="pd-delivery__icon">🔄</span>
              <div>
                <strong>7 Day Replacement</strong>
                <p>Change of mind is not applicable</p>
              </div>
            </div>
            <div className="pd-delivery__item">
              <span className="pd-delivery__icon">✓</span>
              <div>
                <strong>Orbo AI Verified</strong>
                <p>Matched by our recommendation engine</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="pd-related">
          <h2 className="pd-related__title">Similar Products</h2>
          <div className="pd-related__grid">
            {related.map(p => (
              <Link to={`/product/${p.product_id}`} key={p.product_id} className="pd-related__card">
                <img
                  src={getProductImage(p.brand, p.category)}
                  alt={`${p.brand} ${p.name}`}
                  className="pd-related__img"
                />
                <div className="pd-related__info">
                  <p className="pd-related__brand">{p.brand}</p>
                  <h4 className="pd-related__name">{p.name}</h4>
                  <div className="pd-related__stars">
                    {'★'.repeat(Math.floor(p.rating))}{'☆'.repeat(5 - Math.floor(p.rating))}
                    <span>({Number(p.review_count).toLocaleString()})</span>
                  </div>
                  <p className="pd-related__price">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
