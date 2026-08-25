import React from 'react';
import './Legal.css';

export default function Terms() {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-card">
          <div className="legal-header">
            <span className="legal-tag">Legal Compliance</span>
            <h1 className="legal-title">Terms & Conditions</h1>
            <span className="legal-date">Last Updated: January 1, 2025</span>
          </div>

          <div className="legal-body">
            <div className="legal-section">
              <h2>1. Agreement to Terms</h2>
              <p>
                By accessing or utilizing Orbo AI’s SDKs, APIs, smart mirror software, or web widgets (operated by Modaviti eMarketing Pvt Ltd), you agree to be bound by these Terms & Conditions.
              </p>
            </div>

            <div className="legal-section">
              <h2>2. Intellectual Property Rights</h2>
              <p>
                Our 209-point facial tracking engine, sub-strand hair segmentation algorithms, and BeautyGPT models are proprietary trade secrets of Orbo AI. Users and enterprise clients may not reverse engineer, decompile, or extract model weights without written consent.
              </p>
            </div>

            <div className="legal-section">
              <h2>3. Enterprise License & SLA</h2>
              <p>
                Enterprise tiers are governed by dedicated Master Services Agreements (MSA) guaranteeing 99.9% uptime for cloud endpoints and immediate offline fallback for on-device SDK components.
              </p>
            </div>

            <div className="legal-section">
              <h2>4. Contact Information</h2>
              <p>
                For legal inquiries, contact legal@orbo.ai or support@orbo.ai.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
