import React, { useState } from 'react';
import ContactForm from '../../components/ContactForm';
import './SolutionsCommon.css';

export default function FacialAttributes() {
  const [smoothing, setSmoothing] = useState(65);
  const [glow, setGlow] = useState(80);

  return (
    <div className="solution-page">
      <section className="solution-hero" style={{ background: 'linear-gradient(135deg, #FEBBAD 0%, #EB5757 100%)' }}>
        <div className="container-lg">
          <div className="solution-hero-grid">
            <div>
              <span className="solution-hero-badge">FACIAL ATTRIBUTES ENHANCEMENT</span>
              <h1 className="solution-hero-title">Natural AI Retouching & Glow Simulation</h1>
              <p className="solution-hero-desc">
                Enhance digital portraiture with sub-millimeter blemish reduction, radiance simulation, and tone balancing that preserves skin pores and authentic facial identity without the plastic look.
              </p>
              <a href="#demo" className="solution-cta-btn">
                Experience Enhancement →
              </a>
            </div>

            <div className="simulator-box" id="demo">
              <div className="simulator-header">
                <span className="sim-title">✨ Natural Retouch Engine</span>
                <span className="sim-badge">Pore-Preserving v2.4</span>
              </div>

              <div style={{
                height: '140px',
                borderRadius: '16px',
                background: `radial-gradient(circle, rgba(255,230,235,${glow/100}) 0%, rgba(254,187,173,0.6) 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                boxShadow: '0 8px 24px rgba(235, 87, 87, 0.25)',
                marginBottom: '16px'
              }}>
                <span style={{ fontSize: '2.5rem' }}>🌟</span>
                <strong>Radiant Skin Filter Active</strong>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Smoothing: {smoothing}% • Luminescence: {glow}%</span>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600' }}>
                  <span>Micro-Blemish Smoothing:</span>
                  <span>{smoothing}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={smoothing}
                  onChange={(e) => setSmoothing(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '4px', accentColor: '#EB5757' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600' }}>
                  <span>Skin Glow / Radiance Index:</span>
                  <span>{glow}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={glow}
                  onChange={(e) => setGlow(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '4px', accentColor: '#EB5757' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

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
            <div className="feat-card">
              <div className="feat-icon">💎</div>
              <h3>Pore Texture Preservation</h3>
              <p>Maintains high-frequency skin pores and individual freckles while softening redness and shadows.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">👁️</div>
              <h3>Eye Brightening & Teeth Whitening</h3>
              <p>Automatic subtle sclera enhancement and dental enamel shade balancing for natural beauty smiles.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">📱</div>
              <h3>Social Media SDK Ready</h3>
              <p>Drop-in live camera feed module for TikTok, Instagram-like social commerce video live streaming.</p>
            </div>
          </div>
        </div>
      </section>

      <ContactForm />
    </div>
  );
}
