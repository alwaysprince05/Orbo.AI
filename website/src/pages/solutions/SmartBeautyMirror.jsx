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

              <div style={{
                height: '160px',
                borderRadius: '16px',
                background: '#09121D',
                color: '#FFF',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
              }}>
                <div style={{ width: '48%', height: '100%', background: '#1B263B', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: '#8892B0' }}>ORIGINAL</span>
                  <span style={{ fontSize: '1.4rem' }}>👤</span>
                </div>
                <div style={{ width: '2px', height: '80%', background: '#64FFDA' }}></div>
                <div style={{ width: '48%', height: '100%', background: '#415A77', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64FFDA' }}>VIRTUAL GLOW AR</span>
                  <span style={{ fontSize: '1.4rem' }}>✨💄</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                {['Split Before/After', 'Virtual Makeup Mode', 'Skin Diagnostic Scan', 'QR Checkout'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveScreen(mode)}
                    style={{
                      flex: 1,
                      padding: '8px 4px',
                      borderRadius: '8px',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      backgroundColor: activeScreen === mode ? '#09121D' : '#F0F0F0',
                      color: activeScreen === mode ? '#FFF' : '#333',
                      border: 'none',
                      cursor: 'pointer'
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
