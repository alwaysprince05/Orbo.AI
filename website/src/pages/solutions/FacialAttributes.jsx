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
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 8px 24px rgba(235, 87, 87, 0.25)',
                marginBottom: '16px'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1559599101-f09722fb4948?w=500&h=280&fit=crop&q=80"
                  alt="Facial enhancement demo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: `blur(${(100 - smoothing) * 0.02}px) brightness(${1 + glow * 0.002})` }}
                />
                <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <strong style={{ background: 'rgba(9,18,29,0.75)', color: '#FFF', padding: '4px 14px', borderRadius: '9999px', fontSize: '0.8rem', backdropFilter: 'blur(8px)' }}>Radiant Skin Filter Active</strong>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.85)', padding: '2px 10px', borderRadius: '9999px', fontWeight: 700 }}>Smoothing: {smoothing}% • Luminescence: {glow}%</span>
                </div>
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
