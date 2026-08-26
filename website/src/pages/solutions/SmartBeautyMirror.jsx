import React, { useState } from 'react';
import ContactForm from '../../components/ContactForm';
import './SolutionsCommon.css';

export default function SmartBeautyMirror() {
  const [activeScreen, setActiveScreen] = useState('Split');

  return (
    <div className="solution-page">
      <section className="solution-hero" style={{ background: 'linear-gradient(135deg, #FAC4DE 0%, #56CCF2 100%)' }}>
        <div className="container-lg">
          <div className="solution-hero-grid">
            <div>
              <span className="solution-hero-badge">SMART BEAUTY MIRROR</span>
              <h1 className="solution-hero-title">In-Store Interactive Smart Beauty Mirror</h1>
              <p className="solution-hero-desc">
                Transform physical retail beauty counters into high-engagement experiential destinations. Customers enjoy touchless AR try-on, instant skin analysis, and direct QR code purchasing right in front of the mirror.
              </p>
              <a href="#demo" className="solution-cta-btn">
                Request Mirror Hardware Demo →
              </a>
            </div>

            <div className="simulator-box" id="demo">
              <div className="simulator-header">
                <span className="sim-title">🪞 Smart Mirror Kiosk OS UI</span>
                <span className="sim-badge">4K Touchless Ready</span>
              </div>

              {/* Mirror preview — changes based on active mode */}
              <div style={{
                height: '160px', borderRadius: '16px', background: '#09121D',
                padding: '4px', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: '4px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)', overflow: 'hidden',
                position: 'relative',
              }}>
                {activeScreen === 'Split Before/After' && (
                  <>
                    <div style={{ width: '48%', height: '100%', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                      <img src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=300&h=300&fit=crop&q=80" alt="Original" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', bottom: 6, left: 6, fontSize: '0.65rem', color: '#8892B0', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: 9999, backdropFilter: 'blur(4px)' }}>ORIGINAL</span>
                    </div>
                    <div style={{ width: 2, height: '80%', background: '#64FFDA', flexShrink: 0 }} />
                    <div style={{ width: '48%', height: '100%', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                      <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop&q=80" alt="AR Glam" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', bottom: 6, right: 6, fontSize: '0.65rem', color: '#64FFDA', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: 9999, backdropFilter: 'blur(4px)' }}>VIRTUAL GLOW AR</span>
                    </div>
                  </>
                )}

                {activeScreen === 'Virtual Makeup Mode' && (
                  <div style={{ width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=300&fit=crop&q=80" alt="Virtual Makeup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,46,99,0.15)' }} />
                    <span style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', background: '#FF2E63', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '3px 12px', borderRadius: 999 }}>
                      ✨ AR Makeup Active — Lipstick #E63946
                    </span>
                  </div>
                )}

                {activeScreen === 'Skin Diagnostic Scan' && (
                  <div style={{ width: '100%', height: '100%', borderRadius: '12px', background: '#0a1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12 }}>
                    <div style={{ color: '#64FFDA', fontSize: '0.7rem', fontFamily: 'monospace', textAlign: 'center', lineHeight: 2 }}>
                      <div>◉ Scanning facial landmarks…</div>
                      <div>✓ Hydration Index: <strong style={{ color: '#fff' }}>82.4%</strong></div>
                      <div>✓ Melanin Class: <strong style={{ color: '#fff' }}>Warm Medium 04</strong></div>
                      <div>✓ Texture Grade: <strong style={{ color: '#fff' }}>Smooth (A)</strong></div>
                    </div>
                    <div style={{ width: '80%', height: 3, background: '#1a2a40', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: '72%', height: '100%', background: '#64FFDA', borderRadius: 999, animation: 'none' }} />
                    </div>
                  </div>
                )}

                {activeScreen === 'QR Checkout' && (
                  <div style={{ width: '100%', height: '100%', borderRadius: '12px', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <div style={{ width: 72, height: 72, background: '#09121D', borderRadius: 8, display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, padding: 8 }}>
                      {Array.from({ length: 49 }).map((_, i) => (
                        <div key={i} style={{ background: [0,1,2,7,8,9,14,6,13,20,21,28,35,42,43,44,45,46,47,48].includes(i) ? '#fff' : '#09121D', borderRadius: 1 }} />
                      ))}
                    </div>
                    <p style={{ fontSize: '0.7rem', color: '#374151', fontWeight: 700, margin: 0 }}>Scan to add items to cart</p>
                    <p style={{ fontSize: '0.62rem', color: '#9ca3af', margin: 0 }}>3 products · $56.48 saved to session</p>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '6px', marginTop: '14px', flexWrap: 'wrap' }}>
                {['Split Before/After', 'Virtual Makeup Mode', 'Skin Diagnostic Scan', 'QR Checkout'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveScreen(mode)}
                    style={{
                      flex: '1 1 auto', padding: '8px 6px', borderRadius: '8px',
                      fontSize: '0.68rem', fontWeight: '700',
                      backgroundColor: activeScreen === mode ? '#09121D' : '#F0F0F0',
                      color: activeScreen === mode ? '#FFF' : '#333',
                      border: 'none', cursor: 'pointer',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="text-center">
            <span className="section-tag">Retail Experiential Tech</span>
            <h2 className="section-title">Elevate Brick-and-Mortar Beauty Sales</h2>
            <p className="section-subtitle">
              Bridging the digital and physical shopping journey with smart kiosk intelligence.
            </p>
          </div>

          <div className="feature-cards-grid">
            <div className="feat-card">
              <div className="feat-icon">👋</div>
              <h3>Touchless Gesture Control</h3>
              <p>Hygiene-safe interaction allows shoppers to swipe shades and change categories with simple hand gestures.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">🛍️</div>
              <h3>Scan-To-Mobile Cart</h3>
              <p>Shoppers scan a generated on-screen QR code to save their tailored routine directly to their smartphone.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">📊</div>
              <h3>Footfall & Tester Analytics</h3>
              <p>Brands gain aggregate demographic and shade preference heatmaps without capturing private user imagery.</p>
            </div>
          </div>
        </div>
      </section>

      <ContactForm />
    </div>
  );
}
