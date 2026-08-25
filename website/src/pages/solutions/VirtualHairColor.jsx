import React, { useState } from 'react';
import ProductCatalog from '../../components/ProductCatalog';
import ContactForm from '../../components/ContactForm';
import OrboMouseScroll from '../../components/OrboMouseScroll';
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
      {/* 1. Purple Hero Section */}
      <section className="solution-hero-section">
        <div className="container-lg">
          <div className="vm-hero-card" style={{ background: '#B5A9FF' }}>
            <div className="vm-hero-left">
              <span className="vm-hero-tag">VIRTUAL HAIR COLOR</span>
              <h1 className="vm-hero-title">Live Strand-by-Strand Hair Color Try-on</h1>
              <p className="vm-hero-subtitle">
                Our hair segmentation technology sets a new standard of realism. Using computer vision, we seamlessly blend hair color and highlights with natural hair textures instead of appearing as a fake overlay.
              </p>
              <div className="vm-hero-btn-wrap">
                <a href="#hair-studio" className="btn vm-try-btn">
                  Try it now
                </a>
              </div>
            </div>

            <div className="vm-hero-right">
              <div className="vm-model-cutout-wrap">
                <div className="vm-model-circle-bg" style={{ background: 'radial-gradient(circle, #EDE9FE 0%, #DDD6FE 100%)' }}>
                  <div className="vm-photo-woman">
                    <div className="woman-hair-voluminous" style={{ backgroundColor: selectedShade.hex }}></div>
                    <div className="woman-face-profile"></div>
                  </div>
                </div>
                <div className="vm-model-line"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Ease Of Adoption */}
      <section className="section">
        <div className="container">
          <div className="vm-two-col-grid">
            <div className="vm-col-visual">
              <div className="adoption-portrait-container">
                <div className="adoption-portrait-frame" style={{ background: '#FAF5FF' }}>
                  <div className="badge-camera-top">Strand AI 💇‍♀️</div>
                  <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <div style={{
                      width: '130px',
                      height: '130px',
                      borderRadius: '50%',
                      background: `linear-gradient(180deg, ${selectedShade.hex} 0%, #1E1B4B 100%)`,
                      margin: '0 auto 12px',
                      border: '4px solid #FFF',
                      boxShadow: `0 8px 24px ${selectedShade.hex}60`
                    }}></div>
                    <strong style={{ fontSize: '1.1rem', color: '#4C1D95' }}>{selectedShade.name}</strong>
                    <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Technique: {mode} Blending</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="vm-col-content">
              <h2 className="vm-sec-heading">Sub-Strand Precision & Zero Bleed</h2>
              <ul className="vm-red-bullet-list">
                <li>Isolates flyaways, curls, and individual strands without artificial boundary bleeding on the face</li>
                <li>Preserves ambient shine, shadows, and natural hair reflectivity for hyper-realistic recoloring</li>
                <li>Supports single-process colors, ombré gradients, and multi-tone balayage highlights</li>
              </ul>
              <OrboMouseScroll />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Hair Color Studio */}
      <section className="section" id="hair-studio" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div className="text-center">
            <span className="section-tag">Interactive Hair Color Studio</span>
            <h2 className="vm-sec-heading-center">Choose Your Next Hair Transformation</h2>
          </div>

          <div style={{
            maxWidth: '820px',
            margin: '0 auto var(--space-3xl)',
            background: '#FFF',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#64748B' }}>
                Select Hair Shade:
              </span>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                {hairShades.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setSelectedShade(s)}
                    style={{
                      flex: 1,
                      height: '50px',
                      borderRadius: '10px',
                      backgroundColor: s.hex,
                      border: selectedShade.name === s.name ? '3px solid #0F172A' : '1px solid rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      transform: selectedShade.name === s.name ? 'scale(1.08)' : 'scale(1)',
                      transition: 'all 0.2s ease'
                    }}
                    title={s.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#64748B' }}>
                Application Style:
              </span>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                {['Full Tint', 'Ombré Gradient', 'Balayage Highlights', 'Split Dye'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      backgroundColor: mode === m ? '#0F172A' : '#F1F5F9',
                      color: mode === m ? '#FFF' : '#334155',
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
      </section>

      {/* 4. Product Catalog */}
      <ProductCatalog 
        initialCategory="all"
        showFilters={true}
        title="Hair Care & Color Formulations"
        subtitle="Formulations calibrated to preserve keratin structure and vibrance."
      />

      <ContactForm />
    </div>
  );
}
