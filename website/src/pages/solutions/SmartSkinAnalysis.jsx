import React, { useState } from 'react';
import ProductCatalog from '../../components/ProductCatalog';
import ContactForm from '../../components/ContactForm';
import InteractiveBeautyCanvas from '../../components/InteractiveBeautyCanvas';
import OrboMouseScroll from '../../components/OrboMouseScroll';
import './SolutionsCommon.css';

export default function SmartSkinAnalysis() {
  const [analyzed, setAnalyzed] = useState(true);

  return (
    <div className="solution-page">
      {/* 1. Hero Peach Card */}
      <section className="solution-hero-section">
        <div className="container-lg">
          <div className="vm-hero-card" style={{ background: '#FEBBAD' }}>
            <div className="vm-hero-left">
              <span className="vm-hero-tag">SMART SKIN ANALYSIS</span>
              <h1 className="vm-hero-title">Clinical-Grade AI Skin Diagnostic Platform</h1>
              <p className="vm-hero-subtitle">
                Extract vital data on hydration levels, fine lines, dark circles, acne severity, and pore congestion in under 2 seconds. Deliver dermatologist-verified personalized skincare regimens.
              </p>
              <div className="vm-hero-btn-wrap">
                <a href="#canvas-studio" className="btn vm-try-btn">
                  Run Diagnostic Scan →
                </a>
              </div>
            </div>

            <div className="vm-hero-right">
              <div className="vm-model-cutout-wrap">
                <div className="vm-model-circle-bg" style={{ background: 'radial-gradient(circle, #FFF 0%, #FED7AA 100%)' }}>
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=600&fit=crop&q=80"
                    alt="AI skin analysis"
                    className="vm-hero-real-photo"
                  />
                </div>
                <div className="vm-model-line"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Interactive Before/After & Scanner HUD */}
      <section className="section" id="canvas-studio">
        <div className="container">
          <div className="text-center">
            <span className="section-tag">Interactive AI Studio</span>
            <h2 className="vm-sec-heading-center">Live Biometric Diagnostic Scanner</h2>
            <p className="section-subtitle">Drag the slider horizontally to compare natural baseline skin against Orbo's sub-surface clinical diagnostic overlay.</p>
          </div>

          <InteractiveBeautyCanvas defaultCategory="skin" />
        </div>
      </section>

      {/* 3. Ease Of Adoption & Red Bullets */}
      <section className="section" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div className="vm-two-col-grid">
            <div className="vm-col-visual">
              <div className="adoption-portrait-container">
                <div className="adoption-portrait-frame" style={{ background: '#F0FDF4' }}>
                  <div className="badge-camera-top">Clinical AI 🔬</div>
                  <div style={{ padding: '20px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>✨</div>
                    <strong style={{ fontSize: '1.1rem', color: '#166534' }}>Overall Score: 92/100</strong>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px', textAlign: 'left' }}>
                      <div style={{ background: '#FFF', padding: '8px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' }}>
                        💧 Hydration: <span style={{ color: '#16A34A' }}>88% (Optimal)</span>
                      </div>
                      <div style={{ background: '#FFF', padding: '8px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' }}>
                        🛡️ Barrier Defense: <span style={{ color: '#16A34A' }}>94% (Strong)</span>
                      </div>
                      <div style={{ background: '#FFF', padding: '8px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' }}>
                        ☀️ UV Sun Damage: <span style={{ color: '#EAB308' }}>Mild Forehead Spots</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="vm-col-content">
              <h2 className="vm-sec-heading">14 Biomarkers In 2 Seconds</h2>
              <ul className="vm-red-bullet-list">
                <li>Extracts fine lines, deep wrinkles, sebum ratio, dark circles, redness, and acne lesions</li>
                <li>Generates personalized AM/PM regimens mapped directly to active ingredient molecules</li>
                <li>Enables weekly customer scan comparisons to track treatment efficacy and increase retention</li>
              </ul>
              <OrboMouseScroll />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Diagnostic-Matched Formulations */}
      <ProductCatalog 
        initialCategory="serum"
        showFilters={true}
        title="Diagnostic-Matched Skincare Products"
        subtitle="Formulations matched directly with clinical diagnostic scores for Barrier Repair, Vitamin C Radiance, and BHA Exfoliation."
      />

      {/* 5. Contact Form */}
      <ContactForm />
    </div>
  );
}
