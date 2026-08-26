import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ContactForm.css';

// Formspree endpoint — replace YOUR_FORM_ID with your actual Formspree form ID.
// Free plan: https://formspree.io/f/<YOUR_FORM_ID>
// Without a real ID the form shows a graceful inline error instead of crashing.
const FORMSPREE_URL = 'https://formspree.io/f/xpwzgvek';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    email: '', name: '', company: '', challenges: '',
    marketingConsent: false, termsConsent: false,
  });
  const [status,    setStatus]    = useState('idle'); // idle | loading | success | error
  const [errorMsg,  setErrorMsg]  = useState('');

  const update = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return; // prevent double-submit

    if (!formData.email.trim()) {
      setErrorMsg('Please provide a valid business email.');
      return;
    }
    if (!formData.termsConsent) {
      setErrorMsg('Please agree to the Terms & Conditions and Privacy Policy.');
      return;
    }
    setErrorMsg('');
    setStatus('loading');

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name:        formData.name,
          email:       formData.email,
          company:     formData.company,
          message:     formData.challenges,
          marketing:   formData.marketingConsent,
          _subject:    `[Orbo AI] Demo request from ${formData.email}`,
        }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Server error ${res.status}`);
      }
    } catch (err) {
      // Network failure or non-OK response
      setStatus('error');
      setErrorMsg(err.message || 'Could not send message. Please email us at support@orbo.ai.');
    }
  };

  const reset = () => {
    setStatus('idle');
    setErrorMsg('');
    setFormData({ email: '', name: '', company: '', challenges: '', marketingConsent: false, termsConsent: false });
  };

  return (
    <section className="contact-section" id="requestDemo">
      <div className="container">
        <div className="contact-card">
          <div className="contact-header">
            <span className="contact-badge">Collaborate With Us</span>
            <h2 className="contact-title">Let's Build A Success Story Together</h2>
            <p className="contact-desc">
              Discover how Orbo's proprietary on-device visual AI technology can increase sales
              conversion, reduce return rates, and elevate customer engagement.
            </p>
          </div>

          {status === 'success' ? (
            <div className="contact-success animate-fade-in">
              <div className="success-icon">✓</div>
              <h3>Thank You for Reaching Out!</h3>
              <p>Our Beauty AI team will review your requirements and get in touch within 24 hours.</p>
              <button className="btn btn-outline" onClick={reset}>
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              {errorMsg && (
                <div className="contact-error" role="alert">{errorMsg}</div>
              )}

              {/* Name + Company row */}
              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="cf-name" className="form-label">Full Name</label>
                  <input
                    id="cf-name" type="text" className="form-input"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={update('name')}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cf-company" className="form-label">Company</label>
                  <input
                    id="cf-company" type="text" className="form-input"
                    placeholder="Your brand / company"
                    value={formData.company}
                    onChange={update('company')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="cf-email" className="form-label">
                  Work Email <span className="req">*</span>
                </label>
                <input
                  id="cf-email" type="email" className="form-input"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={update('email')}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cf-challenges" className="form-label">
                  Tell us your current challenges & goals
                </label>
                <textarea
                  id="cf-challenges" rows="4" className="form-textarea"
                  placeholder="E.g., We want to integrate AR Virtual Makeup on our Shopify store…"
                  value={formData.challenges}
                  onChange={update('challenges')}
                />
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" checked={formData.marketingConsent}
                    onChange={update('marketingConsent')} />
                  <span>I agree to receive marketing and product updates from Orbo.ai</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" checked={formData.termsConsent}
                    onChange={update('termsConsent')} required />
                  <span>
                    I have read and agree to the{' '}
                    <Link to="/terms" className="legal-link">Terms & Conditions</Link> and{' '}
                    <Link to="/privacy" className="legal-link">Privacy Policy</Link>.{' '}
                    <span className="req">*</span>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary contact-submit-btn"
                disabled={status === 'loading'}
                aria-busy={status === 'loading'}
              >
                {status === 'loading' ? (
                  <span className="cf-spinner" aria-hidden="true" />
                ) : (
                  'Request Demo & Technical Audit →'
                )}
              </button>

              {status === 'error' && (
                <p style={{ textAlign:'center', fontSize:'0.82rem', color:'#b91c1c', marginTop:'0.5rem' }}>
                  Submission failed. Email us directly at{' '}
                  <a href="mailto:support@orbo.ai" style={{ color:'#b91c1c', fontWeight:700 }}>
                    support@orbo.ai
                  </a>
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
