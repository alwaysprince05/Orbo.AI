import React from 'react';
import './Legal.css';

export default function Refund() {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-card">
          <div className="legal-header">
            <span className="legal-tag">Billing Policy</span>
            <h1 className="legal-title">Refund & Cancellation Policy</h1>
            <span className="legal-date">Last Updated: January 1, 2025</span>
          </div>

          <div className="legal-body">
            <div className="legal-section">
              <h2>1. Enterprise SaaS Subscriptions</h2>
              <p>
                Subscription licenses for Orbo AI developer APIs, SDKs, and Shopify plugins are billed on monthly or annual terms. Cancellations take effect at the conclusion of the current billing cycle.
              </p>
            </div>

            <div className="legal-section">
              <h2>2. Refund Eligibility</h2>
              <p>
                Refunds for annual software commitments are subject to the terms stipulated in your Master Services Agreement (MSA). Free trial periods and pilot proof-of-concept tiers are offered to ensure technical satisfaction before production rollout.
              </p>
            </div>

            <div className="legal-section">
              <h2>3. Billing Assistance</h2>
              <p>
                For billing inquiries or invoice questions, please contact billing@orbo.ai or support@orbo.ai.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
