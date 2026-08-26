import React, { useState } from 'react';
import ProductCatalog from '../../components/ProductCatalog';
import ContactForm from '../../components/ContactForm';
import OrboMouseScroll from '../../components/OrboMouseScroll';
import './SolutionsCommon.css';

const shadeMatrix = [
  { code: '110', name: 'Fair Cool', hex: '#F9E4D4', undertone: 'Cool Pink', depth: 'Fair' },
  { code: '140', name: 'Fair Warm', hex: '#F3D9C3', undertone: 'Warm Peach', depth: 'Fair' },
  { code: '210', name: 'Light Neutral', hex: '#EAC8B1', undertone: 'Neutral Beige', depth: 'Light' },
  { code: '260', name: 'Medium Golden', hex: '#DEB896', undertone: 'Warm Olive', depth: 'Medium' },
  { code: '330', name: 'Tan Honey', hex: '#C6936E', undertone: 'Warm Golden', depth: 'Tan' },
  { code: '390', name: 'Deep Bronze', hex: '#A76B46', undertone: 'Neutral Bronze', depth: 'Deep' },
  { code: '450', name: 'Rich Espresso', hex: '#6E452C', undertone: 'Deep Cool', depth: 'Deep' }
];

export default function FoundationShadeFinder() {
  const [selectedShade, setSelectedShade] = useState(shadeMatrix[2]);
  const [filterUndertone, setFilterUndertone] = useState('All');

  return (
    <div className="solution-page">
      {/* 1. Hero Blue Card */}
      <section className="solution-hero-section">
        <div className="container-lg">
          <div className="foundation-blue-card">
            <div className="foundation-card-left">
              <span className="foundation-card-tag">FOUNDATION SHADE FINDER</span>
              <h1 className="foundation-card-title">Recommend Foundation By Auto-detection Of Skin Tone</h1>
              <p className="foundation-card-desc">
                Reduce purchase barriers by empowering users to find the right foundation shade effortlessly with AI-powered sub-tone calibration.
              </p>
              <div className="foundation-card-btn-wrap">
                <a href="#shade-matrix" className="btn btn-primary btn-lg">
                  Try Shade Matcher →
                </a>
              </div>
            </div>

            <div className="foundation-card-right">
              <div className="foundation-circle-cutout-wrap">
                <div className="foundation-circle-bg">
                  <img
                    src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&q=80"
                    alt="Foundation shade analysis"
                    className="foundation-real-photo"
                  />
                </div>
                <div className="foundation-white-line"></div>
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
                <div className="adoption-portrait-frame" style={{ background: '#EFF6FF' }}>
                  <div className="badge-camera-top">AI Shade Detector 🔍</div>
                  <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <div style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      backgroundColor: selectedShade.hex,
                      margin: '0 auto 12px',
                      border: '4px solid #FFF',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                    }}></div>
                    <strong style={{ fontSize: '1.1rem', color: '#1E3A8A' }}>{selectedShade.name} #{selectedShade.code}</strong>
                    <p style={{ fontSize: '0.8rem', color: '#4B5563' }}>Undertone: {selectedShade.undertone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="vm-col-content">
              <h2 className="vm-sec-heading">Precision Skin Colorimetry</h2>
              <ul className="vm-red-bullet-list">
                <li>Automatic white-balance calibration corrects for ambient yellow and low-light conditions</li>
                <li>Multi-point cheek, jawline, and forehead melanin analysis eliminates mismatched foundations</li>
                <li>Instant cross-mapping to 40+ shade ranges across top global cosmetic brands</li>
              </ul>
              <OrboMouseScroll />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Shade Matrix */}
      <section className="section" id="shade-matrix" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div className="text-center">
            <span className="section-tag">Interactive Color Palette</span>
            <h2 className="vm-sec-heading-center">40-Shade Skin Tone Classifier</h2>
          </div>

          <div style={{
            maxWidth: '860px',
            margin: '0 auto var(--space-3xl)',
            background: '#FFF',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#64748B' }}>
                  Select Undertone:
                </span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  {['All', 'Warm', 'Cool', 'Neutral', 'Olive'].map((u) => (
                    <button
                      key={u}
                      onClick={() => setFilterUndertone(u)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        backgroundColor: filterUndertone === u ? '#0F172A' : '#F1F5F9',
                        color: filterUndertone === u ? '#FFF' : '#334155',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Matched SKU:</span>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A' }}>{selectedShade.name}</div>
              </div>
            </div>

            {/* Swatches Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
              {shadeMatrix
                .filter(s =>
                  filterUndertone === 'All' ||
                  s.undertone.toLowerCase().includes(filterUndertone.toLowerCase())
                )
                .map((s) => (
                <button
                  key={s.code}
                  onClick={() => setSelectedShade(s)}
                  style={{
                    backgroundColor: s.hex,
                    height: '80px',
                    borderRadius: '12px',
                    border: selectedShade.code === s.code ? '3px solid #0F172A' : '1px solid rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '8px',
                    textAlign: 'left',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    transform: selectedShade.code === s.code ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: ['#6E452C', '#A76B46'].includes(s.hex) ? '#FFF' : '#1E293B' }}>
                    #{s.code}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Real Foundation Product Catalog */}
      <ProductCatalog 
        initialCategory="foundation"
        showFilters={true}
        title="Foundation Formulations with Exact Shade Sync"
        subtitle="Explore Fenty Beauty and NARS foundations calibrated with Orbo's skin colorimetry algorithms."
      />

      {/* 5. Contact Form */}
      <ContactForm />
    </div>
  );
}
