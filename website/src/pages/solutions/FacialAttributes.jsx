import React, { useState } from 'react';
import ProductCatalog from '../../components/ProductCatalog';
import ContactForm from '../../components/ContactForm';
import './SolutionsCommon.css';

export default function FacialAttributes() {
  const [smoothing, setSmoothing] = useState(65);
  const [glow, setGlow] = useState(80);
  const [sliderPos, setSliderPos] = useState(50);

  const handleDrag = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <div className="solution-page">
      {/* 1. Hero — uses SolutionsCommon two-column grid */}
      <section className="solution-hero" style={{ background: 'linear-gradient(135deg, #B5E8D5 0%, #A8E6CF 40%, #D4F0E7 100%)' }}>
        <div className="container-lg">
          <div className="solution-hero-grid">
            <div>
              <span className="solution-hero-badge">FACIAL ATTRIBUTES ENHANCEMENT</span>
              <h1 className="solution-hero-title">AI Skin Analysis For Customers Using A Selfie</h1>
              <p className="solution-hero-desc">
                Recommend personalized skincare products by identifying skin issues of your customers — hydration, texture, wrinkles, dark spots, and acne — in under 2 seconds.
              </p>
              <button className="solution-cta-btn" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                Try it now
              </button>
            </div>

            <div className="simulator-box" id="demo" style={{ background: 'rgba(255,255,255,0.9)' }}>
              <div className="simulator-header">
                <span className="sim-title">Natural Retouch Engine</span>
                <span className="sim-badge">Pore-Preserving v2.4</span>
              </div>

              {/* Model preview with skin analysis overlay */}
              <div style={{
                height: '220px', borderRadius: '16px', overflow: 'hidden',
                position: 'relative', marginBottom: '16px',
                background: 'radial-gradient(circle, #E8F8F0 0%, #B5E8D5 100%)',
              }}>
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=400&fit=crop&q=80"
                  alt="Facial enhancement model"
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    filter: `brightness(${1 + glow * 0.003}) contrast(${1 + smoothing * 0.002})`,
                  }}
                />
                {/* Skin analysis dots overlay */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  {[
                    { top: '25%', left: '35%', label: 'Hydration' },
                    { top: '40%', left: '55%', label: 'Texture' },
                    { top: '55%', left: '40%', label: 'Pores' },
                    { top: '35%', left: '65%', label: 'Glow' },
                  ].map((dot, i) => (
                    <div key={i} style={{
                      position: 'absolute', top: dot.top, left: dot.left,
                      width: '10px', height: '10px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.9)',
                      border: '2px solid rgba(46,204,113,0.8)',
                      boxShadow: '0 0 8px rgba(46,204,113,0.4)',
                    }} />
                  ))}
                </div>
                <div style={{
                  position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)',
                  background: 'rgba(9,18,29,0.75)', color: '#FFF',
                  padding: '6px 16px', borderRadius: '999px', fontSize: '0.78rem',
                  fontWeight: 700, backdropFilter: 'blur(8px)', whiteSpace: 'nowrap',
                }}>
                  Radiant Skin Filter Active
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', color: '#334155' }}>
                  <span>Micro-Blemish Smoothing</span>
                  <span style={{ color: '#27AE60' }}>{smoothing}%</span>
                </div>
                <input
                  type="range" min="0" max="100" value={smoothing}
                  onChange={(e) => setSmoothing(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '4px', accentColor: '#27AE60' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', color: '#334155' }}>
                  <span>Skin Glow / Radiance Index</span>
                  <span style={{ color: '#27AE60' }}>{glow}%</span>
                </div>
                <input
                  type="range" min="0" max="100" value={glow}
                  onChange={(e) => setGlow(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '4px', accentColor: '#27AE60' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Before/After Comparison */}
      <section className="section" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div className="text-center">
            <span className="section-tag">Interactive Demo</span>
            <h2 className="section-title">See The Enhancement In Real Time</h2>
            <p className="section-subtitle">Drag the slider to compare natural skin against AI-enhanced radiance.</p>
          </div>

          <div style={{
            maxWidth: '700px', margin: '0 auto', background: '#FFF',
            borderRadius: '24px', overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0',
          }}>
            <div
              style={{ position: 'relative', width: '100%', aspectRatio: '16/10', cursor: 'ew-resize' }}
              onMouseMove={(e) => e.buttons === 1 && handleDrag(e)}
              onClick={handleDrag}
            >
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=500&fit=crop&q=80"
                alt="Before enhancement"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
              }}>
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=500&fit=crop&q=80"
                  alt="After enhancement"
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    filter: `brightness(${1 + glow * 0.004}) contrast(1.05) saturate(1.1)`,
                  }}
                />
              </div>
              <div style={{
                position: 'absolute', top: 0, bottom: 0, left: `${sliderPos}%`,
                width: '3px', background: '#FFF', transform: 'translateX(-50%)',
                boxShadow: '0 0 8px rgba(0,0,0,0.3)', zIndex: 2,
              }}>
                <div style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  width: '36px', height: '36px', borderRadius: '50%', background: '#FFF',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.25)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, color: '#333',
                }}>drag</div>
              </div>
              <div style={{
                position: 'absolute', top: '12px', left: '12px', background: 'rgba(0,0,0,0.65)',
                color: '#FFF', padding: '4px 12px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700,
              }}>BEFORE</div>
              <div style={{
                position: 'absolute', top: '12px', right: '12px', background: 'rgba(39,174,96,0.85)',
                color: '#FFF', padding: '4px 12px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700,
              }}>AFTER (AI Enhanced)</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Feature Cards */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <span className="section-tag">Visual Perfection</span>
            <h2 className="section-title">Photorealistic Feature Enhancement</h2>
            <p className="section-subtitle">
              Designed for luxury cosmetic brands, photography apps, and social camera live filters.
            </p>
          </div>

          <div className="feature-cards-grid">
            <div className="feat-card" style={{ borderTop: '3px solid #27AE60' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #D5F5E3, #A9DFBF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#27AE60" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
              </div>
              <h3>Pore Texture Preservation</h3>
              <p>Maintains high-frequency skin pores and individual freckles while softening redness and shadows for a natural, non-plastic look.</p>
            </div>

            <div className="feat-card" style={{ borderTop: '3px solid #F2994A' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F2994A" strokeWidth="2" strokeLinecap="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <h3>Eye Brightening & Teeth Whitening</h3>
              <p>Automatic subtle sclera enhancement and dental enamel shade balancing for natural beauty smiles in every photo.</p>
            </div>

            <div className="feat-card" style={{ borderTop: '3px solid #2D9CDB' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2D9CDB" strokeWidth="2" strokeLinecap="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
                </svg>
              </div>
              <h3>Social Media SDK Ready</h3>
              <p>Drop-in live camera feed module for TikTok, Instagram-like social commerce video live streaming at 60 FPS.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Product Catalog */}
      <ProductCatalog
        initialCategory="moisturizer"
        showFilters={true}
        title="Enhancement-Matched Skincare"
        subtitle="Formulations that complement AI retouching — hydrating primers, glow serums, and pore-minimising treatments."
      />

      <ContactForm />
    </div>
  );
}
