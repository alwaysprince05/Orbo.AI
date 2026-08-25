import React from 'react';
import './Legal.css';

export default function Privacy() {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-card">
          <div className="legal-header">
            <span className="legal-tag">User Data Protection</span>
            <h1 className="legal-title">Privacy Policy (GDPR & CCPA Compliant)</h1>
            <span className="legal-date">Last Updated: January 1, 2025</span>
          </div>

          <div className="legal-body">
            <div className="legal-section">
              <h2>1. On-Device Ephemeral Processing</h2>
              <p>
                At Orbo AI, user privacy is our foundational technical architecture. Our computer vision models operate <strong>on-device (in 97% of delivery channels)</strong>. Camera feeds and facial landmark coordinates are processed solely in temporary volatile device RAM (VRAM) and are discarded immediately upon frame render.
              </p>
            </div>

            <div className="legal-section">
              <h2>2. Zero Biometric Storage</h2>
              <p>
                We do NOT store, save, sell, or transmit user selfies, facial geometry, or video streams to any cloud servers. No biometric databases are created or maintained.
              </p>
            </div>

            <div className="legal-section">
              <h2>3. GDPR & International Compliance</h2>
              <p>
                Our services strictly comply with the European Union General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), and India’s Digital Personal Data Protection Act (DPDPA).
              </p>
            </div>

            <div className="legal-section">
              <h2>4. Data Privacy Officer</h2>
              <p>
                You may contact our privacy compliance team at privacy@orbo.ai.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
