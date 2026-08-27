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

const APPLICATION_STYLES = ['Full Tint', 'Ombré Gradient', 'Balayage Highlights', 'Split Dye'];

// Scale a hex colour's channels — factor < 1 darkens, > 1 lightens. Used to
// derive the second tone in a split dye and the root/tip tones in an ombré.
function shift(hex, factor) {
  const n = parseInt(hex.slice(1), 16);
  return (
    '#' +
    [(n >> 16) & 255, (n >> 8) & 255, n & 255]
      .map((v) => Math.max(0, Math.min(255, Math.round(v * factor))))
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
  );
}

// The colour layer painted over the model's hair for each application style.
function tintFor(style, hex) {
  switch (style) {
    case 'Ombré Gradient':
      return `linear-gradient(180deg, ${shift(hex, 0.55)} 0%, ${hex} 52%, ${shift(hex, 1.35)} 100%)`;
    case 'Balayage Highlights':
      return `repeating-linear-gradient(100deg, ${hex} 0px, ${hex} 16px, ${shift(hex, 1.4)} 16px, ${shift(hex, 1.4)} 30px)`;
    case 'Split Dye':
      return `linear-gradient(90deg, ${hex} 0 49.5%, ${shift(hex, 0.5)} 50.5% 100%)`;
    default:
      return hex;
  }
}

export default function VirtualHairColor() {
  const [selectedShade, setSelectedShade] = useState(hairShades[0]);
  // Must match one of APPLICATION_STYLES, otherwise no style reads as selected
  // on first paint (the previous default of 'Full' matched no button).
  const [mode, setMode] = useState(APPLICATION_STYLES[0]);
  const [photoOk, setPhotoOk] = useState(true);

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
                  <img
                    src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=600&fit=crop&q=80"
                    alt="Virtual hair color model"
                    className="vm-hero-real-photo"
                  />
                  <div className="vm-lip-tint-overlay" style={{ background: `radial-gradient(ellipse at 50% 25%, ${selectedShade.hex}66 0%, transparent 50%)` }}></div>
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
                  <div className="badge-camera-top">Strand AI</div>
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
                    <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Technique: {mode}</p>
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

          {/* Hair color preview — model with tint overlay */}
          <div style={{
            maxWidth: '820px',
            margin: '0 auto',
            background: '#FFF',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
            border: '1px solid #E2E8F0',
            position: 'relative',
          }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10' }}>
              <img
                src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&h=500&fit=crop&q=80"
                alt="Hair color preview model"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {/* Hair color tint overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: tintFor(mode, selectedShade.hex),
                mixBlendMode: 'color',
                opacity: 0.65,
              }} />
              {/* Info badge */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                background: 'rgba(15,23,42,0.85)',
                color: '#fff',
                padding: '10px 18px',
                borderRadius: '12px',
                backdropFilter: 'blur(8px)',
                fontSize: '0.85rem',
                fontWeight: '700',
              }}>
                {selectedShade.name} &middot; {mode}
              </div>
              {/* Technique badge */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: selectedShade.hex,
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: '800',
                letterSpacing: '0.05em',
                boxShadow: `0 4px 12px ${selectedShade.hex}60`,
              }}>
                {selectedShade.type}
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
