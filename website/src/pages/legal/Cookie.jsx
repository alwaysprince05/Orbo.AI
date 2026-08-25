import React from 'react';
import './Legal.css';

export default function Cookie() {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-card">
          <div className="legal-header">
            <span className="legal-tag">Transparency</span>
            <h1 className="legal-title">Cookie Policy</h1>
            <span className="legal-date">Last Updated: January 1, 2025</span>
          </div>

          <div className="legal-body">
            <div className="legal-section">
              <h2>1. What Are Cookies</h2>
              <p>
                Cookies are small data files stored on your browser to remember session preferences, language selections, and analytics usage patterns.
              </p>
            </div>

            <div className="legal-section">
              <h2>2. How We Use Cookies</h2>
              <p>
                We use strictly essential technical cookies for page navigation and anonymized aggregated telemetry to monitor website uptime and API latency. We do not use third-party cross-site advertising trackers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
