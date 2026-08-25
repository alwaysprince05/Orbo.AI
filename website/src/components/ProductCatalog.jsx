import React, { useState, useMemo } from 'react';
import { beautyProducts, productCategories } from '../data/products';
import './ProductCatalog.css';

export default function ProductCatalog({ initialCategory = 'all', showFilters = true, title = "Curated Beauty & Skincare Catalog", subtitle = "Explore real-world formulations powered by Orbo's hybrid AI recommendation engine." }) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSkinType, setSelectedSkinType] = useState('all');
  const [selectedConcern, setSelectedConcern] = useState('all');
  const [maxBudget, setMaxBudget] = useState(200);
  const [activeModalProduct, setActiveModalProduct] = useState(null);
  const [arShade, setArShade] = useState('#FF2E63');
  const [arFinish, setArFinish] = useState('Matte');

  const skinTypes = [
    { id: 'all', label: 'All Skin Types' },
    { id: 'dry', label: 'Dry Skin' },
    { id: 'oily', label: 'Oily Skin' },
    { id: 'combination', label: 'Combination' },
    { id: 'sensitive', label: 'Sensitive Skin' }
  ];

  const concerns = [
    { id: 'all', label: 'All Concerns' },
    { id: 'hydration', label: 'Hydration' },
    { id: 'acne', label: 'Acne & Blemishes' },
    { id: 'aging', label: 'Anti-Aging & Fine Lines' },
    { id: 'pigmentation', label: 'Dark Spots & Glow' },
    { id: 'sun_protection', label: 'UV Sun Protection' }
  ];

  const filteredProducts = useMemo(() => {
    return beautyProducts.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSkin = selectedSkinType === 'all' || p.skinTypes.includes(selectedSkinType) || p.skinTypes.includes('all');
      const matchConcern = selectedConcern === 'all' || p.concerns.includes(selectedConcern);
      const matchBudget = p.price <= maxBudget;
      return matchCat && matchSkin && matchConcern && matchBudget;
    });
  }, [selectedCategory, selectedSkinType, selectedConcern, maxBudget]);

  const openTryOnModal = (product) => {
    setActiveModalProduct(product);
    if (product.shadeHex) {
      setArShade(product.shadeHex);
    }
  };

  return (
    <section className="catalog-section" id="products">
      <div className="container">
        {/* Header */}
        <div className="catalog-header text-center">
          <span className="catalog-badge">Real Formulations & SKUs</span>
          <h2 className="catalog-title">{title}</h2>
          <p className="catalog-subtitle">{subtitle}</p>
        </div>

        {/* Category Pills Bar */}
        <div className="category-pills-bar">
          {productCategories.map((cat) => (
            <button
              key={cat.id}
              className={`cat-pill ${selectedCategory === cat.id ? 'cat-pill--active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="cat-pill__icon">{cat.icon}</span>
              <span className="cat-pill__label">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Filters Row */}
        {showFilters && (
          <div className="catalog-filters-card">
            <div className="filter-group">
              <label>Skin Type:</label>
              <select
                value={selectedSkinType}
                onChange={(e) => setSelectedSkinType(e.target.value)}
                className="filter-select"
              >
                {skinTypes.map((st) => (
                  <option key={st.id} value={st.id}>{st.label}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Target Concern:</label>
              <select
                value={selectedConcern}
                onChange={(e) => setSelectedConcern(e.target.value)}
                className="filter-select"
              >
                {concerns.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="filter-group budget-filter">
              <div className="budget-label-row">
                <label>Max Budget:</label>
                <span className="budget-val">${maxBudget}</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="budget-slider"
              />
            </div>

            <div className="filter-stats">
              Showing <strong>{filteredProducts.length}</strong> matching products
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.map((p) => (
            <div key={p.id} className="product-card-rich">

              {/* Product Image */}
              <div className="product-img-wrap">
                <img
                  src={p.image}
                  alt={`${p.brand} ${p.name}`}
                  className="product-real-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="product-img-fallback" style={{ background: `linear-gradient(135deg, ${p.colorTag}30, ${p.colorTag}60)`, display: 'none' }}>
                  <span style={{ fontSize: '2.5rem' }}>✨</span>
                </div>
                <div className="product-match-overlay">
                  <span className="overlay-match-val">{p.matchPercentage}%</span>
                  <span className="overlay-match-lbl">AI Match</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="product-info-block">
                <div className="product-brand-row">
                  <span className="product-brand-name">{p.brand}</span>
                  {p.finish && <span className="product-finish-chip">{p.finish}</span>}
                </div>
                <h3 className="product-name">{p.name}</h3>
                <div className="product-meta-row">
                  <span className="product-price">${p.price.toFixed(2)}</span>
                  <span className="product-rating">★ {p.rating} <span style={{color:'#9CA3AF'}}>({p.reviews.toLocaleString()})</span></span>
                </div>
              </div>

              {/* Match Reason */}
              <div className="product-reason-box">
                <p>💡 {p.matchReason}</p>
              </div>

              {/* Ingredients Chips */}
              <div className="ingredients-chips">
                <span className="ing-label">Actives:</span>
                {p.keyIngredients.map((ing, i) => (
                  <span key={i} className="ing-tag">{ing}</span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="product-card-rich__actions">
                <button
                  className="btn-try-ar"
                  onClick={() => openTryOnModal(p)}
                >
                  ✨ {['lipstick', 'foundation'].includes(p.category) ? 'Live AR Try-On' : 'Simulate Diagnostic'}
                </button>
                <a href="#requestDemo" className="btn-add-regimen">
                  + Add to Regimen
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-products-msg text-center">
            <h3>No products found for this combination</h3>
            <p>Try broadening your budget or selecting "All Skin Types".</p>
            <button
              className="btn btn-outline"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSkinType('all');
                setSelectedConcern('all');
                setMaxBudget(200);
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Live AR / Clinical Modal */}
        {activeModalProduct && (
          <div className="tryon-modal-overlay" onClick={() => setActiveModalProduct(null)}>
            <div className="tryon-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setActiveModalProduct(null)}>✕</button>
              
              <div className="modal-content-grid">
                {/* Live AR Canvas Simulation */}
                <div className="ar-preview-viewport">
                  <div className="ar-face-canvas">
                    <div className="face-oval-mesh">
                      <div className="face-feature-lip" style={{ backgroundColor: arShade, boxShadow: arFinish === 'Gloss' ? '0 0 16px rgba(255,255,255,0.9)' : 'none' }}></div>
                      <div className="face-scan-hud">
                        <span className="hud-metric hud-tone">Skin Tone: Melanin Class 04</span>
                        <span className="hud-metric hud-fps">60.2 FPS • Real-Time</span>
                      </div>
                    </div>
                  </div>
                  <div className="ar-viewport-status">
                    <span className="live-dot"></span> Orbo Neural Vision Pipeline Active
                  </div>
                </div>

                {/* Controls & Specs */}
                <div className="ar-controls-panel">
                  <span className="ar-product-brand">{activeModalProduct.brand}</span>
                  <h3 className="ar-product-title">{activeModalProduct.name}</h3>
                  <div className="ar-price-tag">${activeModalProduct.price.toFixed(2)} • {activeModalProduct.rating} / 5.0</div>

                  <p className="ar-product-desc">{activeModalProduct.matchReason}</p>

                  {/* Shade / Formula switcher */}
                  <div className="ar-swatches-section">
                    <label>Interactive Shade Palette:</label>
                    <div className="swatches-row">
                      {['#D62246', '#FF6B6B', '#D48C84', '#BA0C2F', '#EAC8B1', '#C28E67', '#801A4B'].map((hex) => (
                        <button
                          key={hex}
                          className={`swatch-btn ${arShade === hex ? 'swatch-btn--active' : ''}`}
                          style={{ backgroundColor: hex }}
                          onClick={() => setArShade(hex)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="ar-finish-section">
                    <label>Finish Material Shader:</label>
                    <div className="finish-row">
                      {['Matte', 'Gloss', 'Satin', 'Luminous'].map((f) => (
                        <button
                          key={f}
                          className={`finish-pill ${arFinish === f ? 'finish-pill--active' : ''}`}
                          onClick={() => setArFinish(f)}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="modal-cta-group">
                    <a href="#requestDemo" className="btn btn-primary" onClick={() => setActiveModalProduct(null)}>
                      Integrate This AR Widget on Your Store →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
