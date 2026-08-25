import React, { useState } from 'react';
import ContactForm from '../../components/ContactForm';
import './SolutionsCommon.css';

const lipColors = [
  { name: 'Velvet Crimson', hex: '#D62246', type: 'Matte' },
  { name: 'Coral Sunrise', hex: '#FF6B6B', type: 'Gloss' },
  { name: 'Nude Petal', hex: '#D48C84', type: 'Satin' },
  { name: 'Berry Plum', hex: '#801A4B', type: 'Velvet' },
  { name: 'Ruby Blaze', hex: '#B80D22', type: 'Gloss' }
];

export default function VirtualMakeup() {
  const [selectedLip, setSelectedLip] = useState(lipColors[0]);
  const [finish, setFinish] = useState('Matte');
  const [intensity, setIntensity] = useState(85);

  return (
    <div className="solution-page">
      {/* Hero */}
      <section className="solution-hero" style={{ background: 'linear-gradient(135deg, #FEBBAD 0%, #FAC4DE 100%)' }}>
        <div className="container-lg">
          <div className="solution-hero-grid">
            <div>
              <span className="solution-hero-badge">VIRTUAL MAKEUP</span>
              <h1 className="solution-hero-title">AI-powered Virtual Makeup Try-on</h1>
              <p className="solution-hero-desc">
                Personalize the buying experience of customers by recommending customized beauty products. Allow users to test lipsticks, eye shadows, blushes, and foundations live with true-to-life texture shaders.
              </p>
              <a href="#demo" className="solution-cta-btn">
                Try it now →
              </a>
            </div>

            {/* Interactive Try-on Simulator */}
            <div className="simulator-box" id="demo">
              <div className="simulator-header">
                <span className="sim-title">💄 Interactive AR Try-On Simulator</span>
                <span className="sim-badge">Live Shader v3.2</span>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  margin: '0 auto 12px',
                  background: `radial-gradient(circle, ${selectedLip.hex} 0%, #FFF 80%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid #FFF',
                  boxShadow: `0 8px 24px ${selectedLip.hex}40`
                }}>
                  <div style={{
                    width: '70px',
                    height: '24px',
                    backgroundColor: selectedLip.hex,
                    borderRadius: '20px',
                    opacity: intensity / 100,
                    boxShadow: finish === 'Gloss' ? '0 0 12px rgba(255,255,255,0.8)' : 'none',
                    transition: 'all 0.3s ease'
                  }}></div>
                </div>
                <strong>{selectedLip.name}</strong>
                <p style={{ fontSize: '0.8rem', color: '#666' }}>{finish} Finish • {intensity}% Opacity</p>
              </div>

              {/* Shade Selector */}
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#888' }}>
                  Select Lipstick Shade:
                </span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  {lipColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedLip(color)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: color.hex,
                        border: selectedLip.name === color.name ? '3px solid #09121D' : '2px solid #FFF',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                      }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Finish Options */}
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#888' }}>
                  Texture Finish:
                </span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  {['Matte', 'Gloss', 'Satin', 'Shimmer'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFinish(f)}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: finish === f ? '#09121D' : '#F0F0F0',
                        color: finish === f ? '#FFF' : '#333',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600' }}>
                  <span>Application Intensity:</span>
                  <span>{intensity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '6px', accentColor: '#FF2E63' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <span className="section-tag">Enterprise Capabilities</span>
            <h2 className="section-title">Built For High-Growth Beauty Commerce</h2>
            <p className="section-subtitle">
              Convert browsers into buyers with photorealistic virtual try-ons that mirror actual product textures and pigmentation.
            </p>
          </div>

          <div className="feature-cards-grid">
            <div className="feat-card">
              <div className="feat-icon">🎯</div>
              <h3>Sub-Pixel Lip & Eye Contour</h3>
              <p>Precise mapping around lip vermilion borders, eyelids, and lash lines ensures natural blending without artificial edge bleeding.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">✨</div>
              <h3>Multi-Texture Physical Shaders</h3>
              <p>Accurately models physical light reflection for Matte, Glossy, Metallic, Shimmer, and Satin cosmetics formulas.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">🛒</div>
              <h3>Instant 1-Click Checkout</h3>
              <p>Embed try-on widgets directly into Product Detail Pages (PDP) with real-time inventory and color variant switching.</p>
            </div>
          </div>

          {/* Specs */}
          <div className="specs-bar">
            <div className="spec-item">
              <strong>60 FPS</strong>
              <span>Smooth Real-Time Tracking</span>
            </div>
            <div className="spec-item">
              <strong>&lt; 3MB</strong>
              <span>Ultra-Light Web SDK</span>
            </div>
            <div className="spec-item">
              <strong>+320%</strong>
              <span>Conversion Rate Uplift</span>
            </div>
            <div className="spec-item">
              <strong>-42%</strong>
              <span>Return Rate Reduction</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm />
    </div>
  );
}
