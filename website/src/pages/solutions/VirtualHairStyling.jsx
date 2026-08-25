import React, { useState } from 'react';
import ContactForm from '../../components/ContactForm';
import './SolutionsCommon.css';

const styles = [
  { name: 'Classic Bob with Bangs', category: 'Short', match: 'Oval / Heart' },
  { name: 'Layered Beach Waves', category: 'Medium', match: 'Square / Round' },
  { name: 'Sleek Mermaid Length', category: 'Long', match: 'All Face Shapes' },
  { name: 'Pixie Crop Textured', category: 'Short', match: 'Diamond / Oval' }
];

export default function VirtualHairStyling() {
  const [selectedStyle, setSelectedStyle] = useState(styles[0]);

  return (
    <div className="solution-page">
      <section className="solution-hero" style={{ background: 'linear-gradient(135deg, #B5A9FF 0%, #FAC4DE 100%)' }}>
        <div className="container-lg">
          <div className="solution-hero-grid">
            <div>
              <span className="solution-hero-badge">VIRTUAL HAIR STYLING</span>
              <h1 className="solution-hero-title">AI Hairstyle Transformation & Morphing</h1>
              <p className="solution-hero-desc">
                Allow customers to preview hundreds of trending hairstyles, cuts, curls, and bangs matched directly to their facial proportions and head geometry before taking the salon scissors.
              </p>
              <a href="#demo" className="solution-cta-btn">
                Try Hairstyle Simulator →
              </a>
            </div>

            <div className="simulator-box" id="demo">
              <div className="simulator-header">
                <span className="sim-title">✂️ Hairstyle 3D Geometry Fitting</span>
                <span className="sim-badge">Generative Morph</span>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{
                  height: '160px',
                  borderRadius: '16px',
                  background: 'radial-gradient(circle, #E8E0FF 0%, #D4C5FF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ fontSize: '3rem' }}>💇‍♀️</div>
                  <strong>{selectedStyle.name}</strong>
                  <span style={{ fontSize: '0.75rem', background: '#FFF', padding: '3px 10px', borderRadius: '9999px' }}>
                    Best for: {selectedStyle.match} Face Shapes
                  </span>
                </div>
              </div>

              <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#888' }}>
                Choose Hairstyle Cut:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
                {styles.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setSelectedStyle(s)}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textAlign: 'left',
                      backgroundColor: selectedStyle.name === s.name ? '#09121D' : '#F4F4F6',
                      color: selectedStyle.name === s.name ? '#FFF' : '#333',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {s.name}
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
            <span className="section-tag">Key Benefits</span>
            <h2 className="section-title">Drive Salon Bookings & Wig Conversions</h2>
            <p className="section-subtitle">
              Eliminate haircut anxiety and empower beauty customers with realistic 3D volumetric hair simulation.
            </p>
          </div>

          <div className="feature-cards-grid">
            <div className="feat-card">
              <div className="feat-icon">📐</div>
              <h3>Automatic Face-Shape Matching</h3>
              <p>Recommends optimal cuts and partings tailored to round, oval, square, and heart facial dimensions.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">🌬️</div>
              <h3>Physics-Based Flow & Motion</h3>
              <p>Hair moves naturally with head rotation and tilt, providing dynamic 360-degree consultation.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">🏪</div>
              <h3>Salon & Retail Ready</h3>
              <p>Easily integrates into tablet-based salon POS terminals and wig/hair extension e-commerce sites.</p>
            </div>
          </div>
        </div>
      </section>

      <ContactForm />
    </div>
  );
}
