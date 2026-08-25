import React, { useState } from 'react';
import ProductCatalog from '../../components/ProductCatalog';
import ContactForm from '../../components/ContactForm';
import './SolutionsCommon.css';

export default function SmartSkinAnalysis() {
  const [analyzed, setAnalyzed] = useState(true);

  return (
    <div className="solution-page">
      <section className="solution-hero" style={{ background: 'linear-gradient(135deg, #FEBBAD 0%, #27AE60 100%)' }}>
        <div className="container-lg">
          <div className="solution-hero-grid">
            <div>
              <span className="solution-hero-badge">SMART SKIN ANALYSIS</span>
              <h1 className="solution-hero-title">Clinical-Grade AI Skin Diagnostic Platform</h1>
              <p className="solution-hero-desc">
                Extract vital data on hydration levels, fine lines, dark circles, acne severity, and pore congestion in under 2 seconds. Deliver dermatologist-verified personalized skincare regimens.
              </p>
              <a href="#demo" className="solution-cta-btn">
                Run Diagnostic Scan →
              </a>
            </div>

            <div className="simulator-box" id="demo">
              <div className="simulator-header">
                <span className="sim-title">🔬 Skin Diagnostic Health Index</span>
                <span className="sim-badge">Overall Score: 88/100</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: '#F9FBF9', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2EFE2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>
                    <span>Hydration & Moisture</span>
                    <span style={{ color: '#27AE60' }}>82% (Optimal)</span>
                  </div>
                  <div style={{ height: '6px', background: '#E0E0E0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '82%', height: '100%', background: '#27AE60' }}></div>
                  </div>
                </div>

                <div style={{ background: '#F9FBF9', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2EFE2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>
                    <span>Texture & Smoothness</span>
                    <span style={{ color: '#2D9CDB' }}>91% (Very Smooth)</span>
                  </div>
                  <div style={{ height: '6px', background: '#E0E0E0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '91%', height: '100%', background: '#2D9CDB' }}></div>
                  </div>
                </div>

                <div style={{ background: '#F9FBF9', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2EFE2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>
                    <span>Pigmentation & Spots</span>
                    <span style={{ color: '#F2994A' }}>74% (Mild Sun Damage)</span>
                  </div>
                  <div style={{ height: '6px', background: '#E0E0E0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '74%', height: '100%', background: '#F2994A' }}></div>
                  </div>
                </div>

                <div style={{ background: '#F9FBF9', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2EFE2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>
                    <span>Fine Lines / Firmness</span>
                    <span style={{ color: '#27AE60' }}>89% (High Elasticity)</span>
                  </div>
                  <div style={{ height: '6px', background: '#E0E0E0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '89%', height: '100%', background: '#27AE60' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Targeted Formulations based on Diagnostic Scores */}
      <ProductCatalog 
        initialCategory="serum"
        showFilters={true}
        title="Diagnostic-Matched Skincare Products"
        subtitle="Formulations matched directly with diagnostic scores for Barrier Repair, Vitamin C Radiance, and BHA Exfoliation."
      />

      <section className="section">
        <div className="container">
          <div className="text-center">
            <span className="section-tag">Scientific Skincare</span>
            <h2 className="section-title">Deep Learning Multi-Layer Diagnostics</h2>
            <p className="section-subtitle">
              Combining frequency localization and vision transformers to analyze sub-surface skin condition variations.
            </p>
          </div>

          <div className="feature-cards-grid">
            <div className="feat-card">
              <div className="feat-icon">📊</div>
              <h3>14 Clinical Biomarkers</h3>
              <p>Scores hydration, sebum balance, wrinkle depth, pore enlargement, dark circles, redness, and acne severity.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">🗓️</div>
              <h3>Progress & Regimen Tracking</h3>
              <p>Enables repeat users to take weekly scans and visualize improvement metrics as skincare products take effect.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">🌿</div>
              <h3>Targeted Formulation Matching</h3>
              <p>Recommends exact active ingredients (e.g. Hyaluronic Acid, Retinol, Salicylic Acid, Ceramides) suited for the user.</p>
            </div>
          </div>
        </div>
      </section>

      <ContactForm />
    </div>
  );
}
