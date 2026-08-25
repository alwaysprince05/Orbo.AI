import React, { useState } from 'react';
import ContactForm from '../../components/ContactForm';
import './SolutionsCommon.css';

const shades = [
  { name: 'Ivory Fair 110', undertone: 'Cool Pink', hex: '#F7E2D3' },
  { name: 'Warm Beige 220', undertone: 'Warm Golden', hex: '#EAC8B1' },
  { name: 'Honey Sand 310', undertone: 'Neutral Peach', hex: '#DDB393' },
  { name: 'Caramel Amber 420', undertone: 'Warm Olive', hex: '#C28E67' },
  { name: 'Rich Espresso 530', undertone: 'Deep Cool', hex: '#6E452C' }
];

export default function FoundationShadeFinder() {
  const [selectedShade, setSelectedShade] = useState(shades[1]);

  return (
    <div className="solution-page">
      <section className="solution-hero" style={{ background: 'linear-gradient(135deg, #FEBBAD 0%, #F2994A 100%)' }}>
        <div className="container-lg">
          <div className="solution-hero-grid">
            <div>
              <span className="solution-hero-badge">FOUNDATION SHADE FINDER</span>
              <h1 className="solution-hero-title">Precision Skin Undertone & Shade Matching</h1>
              <p className="solution-hero-desc">
                Finding the right foundation online has a 45% return rate. Orbo's AI analyzes lighting conditions, melanin index, and undertones (Warm, Cool, Neutral, Olive) to match exact brand SKUs.
              </p>
              <a href="#demo" className="solution-cta-btn">
                Find My Shade →
              </a>
            </div>

            <div className="simulator-box" id="demo">
              <div className="simulator-header">
                <span className="sim-title">🎨 Melanin & Undertone Classifier</span>
                <span className="sim-badge">Colorimetry Matrix</span>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{
                  height: '140px',
                  borderRadius: '16px',
                  backgroundColor: selectedShade.hex,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  color: ['#6E452C', '#C28E67'].includes(selectedShade.hex) ? '#FFF' : '#333',
                  boxShadow: `0 8px 24px ${selectedShade.hex}60`
                }}>
                  <strong style={{ fontSize: '1.2rem' }}>{selectedShade.name}</strong>
                  <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Undertone: {selectedShade.undertone}</span>
                </div>
              </div>

              <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#888' }}>
                Tested Skin Palette:
              </span>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                {shades.map((shade) => (
                  <button
                    key={shade.name}
                    onClick={() => setSelectedShade(shade)}
                    style={{
                      flex: 1,
                      height: '42px',
                      borderRadius: '8px',
                      backgroundColor: shade.hex,
                      border: selectedShade.name === shade.name ? '3px solid #09121D' : '1px solid rgba(0,0,0,0.1)',
                      cursor: 'pointer'
                    }}
                    title={`${shade.name} - ${shade.undertone}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="text-center">
            <span className="section-tag">High Accuracy Colorimetry</span>
            <h2 className="section-title">Say Goodbye To Foundation Returns</h2>
            <p className="section-subtitle">
              Proprietary white-balancing corrects for ambient yellow indoor bulbs, bright sunlight, and low-light smartphone selfie cameras.
            </p>
          </div>

          <div className="feature-cards-grid">
            <div className="feat-card">
              <div className="feat-icon">☀️</div>
              <h3>Ambient Light Normalization</h3>
              <p>Calibrates RGB exposure and white point to evaluate true baseline skin pigmentation regardless of room lighting.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">🔬</div>
              <h3>Multi-Zone Facial Sampling</h3>
              <p>Cross-references cheek, jawline, forehead, and neck pigmentation to deliver seamless natural shade transitions.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">📦</div>
              <h3>Direct Catalog Cross-Mapping</h3>
              <p>Maps directly to your brand’s custom 40+ shade range with high-confidence purchase recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      <ContactForm />
    </div>
  );
}
