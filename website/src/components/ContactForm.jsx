import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ContactForm.css';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    email: '',
    challenges: '',
    marketingConsent: false,
    termsConsent: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError('Please provide a valid business email.');
      return;
    }
    if (!formData.termsConsent) {
      setError('Please agree to the Terms & Conditions and Privacy Policy.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <section className="contact-section" id="requestDemo">
      <div className="container">
        <div className="contact-card">
          <div className="contact-header">
            <span className="contact-badge">Collaborate With Us</span>
            <h2 className="contact-title">Let's Build A Success Story Together</h2>
            <p className="contact-desc">
              Discover how Orbo's proprietary on-device visual AI technology can increase sales conversion, reduce return rates, and elevate customer engagement.
            </p>
          </div>

          {submitted ? (
            <div className="contact-success animate-fade-in">
              <div className="success-icon">✓</div>
              <h3>Thank You for Reaching Out!</h3>
              <p>Our Beauty AI team will review your requirements and get in touch within 24 hours.</p>
              <button 
                className="btn btn-outline"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ email: '', challenges: '', marketingConsent: false, termsConsent: false });
                }}
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              {error && <div className="contact-error">{error}</div>}

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Work Email ID <span className="req">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="name@company.com"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="challenges" className="form-label">
                  Tell us your current challenges & goals
                </label>
                <textarea
                  id="challenges"
                  rows="4"
                  placeholder="E.g., We want to integrate AR Virtual Makeup on our Shopify store, or deploy AI skin diagnostics in 50 offline stores..."
                  className="form-textarea"
                  value={formData.challenges}
                  onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                ></textarea>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.marketingConsent}
                    onChange={(e) => setFormData({ ...formData, marketingConsent: e.target.checked })}
                  />
                  <span>I agree to receive marketing and product updates from Orbo.ai</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.termsConsent}
                    onChange={(e) => setFormData({ ...formData, termsConsent: e.target.checked })}
                    required
                  />
                  <span>
                    I have read and agree to the{' '}
                    <Link to="/terms" className="legal-link">Terms & Conditions</Link> and{' '}
                    <Link to="/privacy" className="legal-link">Privacy Policy</Link>.
                  </span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary contact-submit-btn">
                Request Demo & Technical Audit →
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
