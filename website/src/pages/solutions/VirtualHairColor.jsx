import React, { useState } from 'react';
import ContactForm from '../../components/ContactForm';
import './SolutionsCommon.css';

const hairShades = [
  { name: 'Warm Copper', hex: '#B85D19', type: 'Vibrant' },
  { name: 'Ash Platinum Blonde', hex: '#E6D7B8', type: 'Bleach' },
  { name: 'Deep Burgundy', hex: '#5A1827', type: 'Bold' },
  { name: 'Espresso Brunette', hex: '#3B241A', type: 'Natural' },
  { name: 'Pastel Rose Gold', hex: '#E8A598', type: 'Fantasy' }
];

export default function VirtualHairColor() {
  const [selectedShade, setSelectedShade] = useState(hairShades[0]);
  const [mode, setMode] = useState('Full');

  return (
    <div className="solution-page">
      <section className="solution-hero" style={{ background: 'linear-gradient(135deg, #FAC4DE 0%, #B5A9FF 100%)' }}>
        <div className="container-lg">
          <div className="solution-hero-grid">
            <div>
              <span className="solution-hero-badge">VIRTUAL HAIR COLOR</span>
              <h1 className="solution-hero-title">Live Strand-by-Strand Hair Color Try-on</h1>
              <p className="solution-hero-desc">
                Our hair segmentation technology sets a new standard of realism. Using computer vision, we seamlessly blend hair color and highlights with natural hair textures instead of appearing as a fake overlay.
              </p>
              <a href="#demo" className="solution-cta-btn">
                Try it now →
              </a>
            </div>

            {/* Hair Color Simulator */}
            <div className="simulator-box" id="demo">
              <div className="simulator-header">
                <span className="sim-title">💇‍♀️ Hair Color AI Simulation</span>
                <span className="sim-badge">Sub-Strand v4</span>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{
                  height: '160px',
                  borderRadius: '16px',
                  background: `linear-gradient(180deg, ${selectedShade.hex} 0%, rgba(9, 18, 29, 0.9) 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFF',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: `0 8px 24px ${selectedShade.hex}50`
                }}>
                  <div style={{ textAlign: 'center', zIndex: 2 }}>
                    <div style={{ fontSize: '2.5rem' }}>✨</div>
                    <strong style={{ fontSize: '1.1rem' }}>{selectedShade.name}</strong>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Mode: {mode} Application</p>
                  </div>
                </div>
              </div>

              {/* Shade Selector */}
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#888' }}>
                  Select Hair Shade:
                </span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  {hairShades.map((shade) => (
                    <button
                      key={shade.name}
                      onClick={() => setSelectedShade(shade)}
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        backgroundColor: shade.hex,
                        border: selectedShade.name === shade.name ? '3px solid #09121D' : '2px solid #FFF',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                      }}
                      title={shade.name}
                    />
                  ))}
                </div>
              </div>

              {/* Application Style */}
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#888' }}>
                  Application Technique:
                </span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  {['Full Single Process', 'Ombré Gradient', 'Balayage Highlights', 'Split Dye'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: '600',
                        backgroundColor: mode === m ? '#09121D' : '#F0F0F0',
                        color: mode === m ? '#FFF' : '#333',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <span className="section-tag">Deep Tech Precision</span>
            <h2 className="section-title">Zero Hair-Face Boundary Bleeding</h2>
            <p className="section-subtitle">
              Advanced neural segmentation maps every curl, flyaway, and strand with pixel-level precision.
            </p>
          </div>

          <div className="feature-cards-grid">
            <div className="feat-card">
              <div className="feat-icon">🧬</div>
              <h3>Fine Hair Strands & Texture</h3>
              <p>Detects flyaways, curly textures, Afro coils, and straight textures without clumping or artificial edges.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">🎨</div>
              <h3>Light & Shine Simulation</h3>
              <p>Preserves ambient highlights, shadows, and natural hair reflectivity for realistic virtual coloring.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">⚡</div>
              <h3>Real-Time Live Video Feed</h3>
              <p>Process live video camera streams at 60 frames per second on standard consumer smartphones.</p>
            </div>
          </div>
        </div>
      </section>

      <ContactForm />
    </div>
  );
}
