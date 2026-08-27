import React from 'react';
import ContactForm from '../components/ContactForm';
import './AboutUs.css';

const founders = [
  {
    name: 'Manoj Shinde',
    role: 'Co-Founder & CEO',
    bio: 'Manoj Shinde possesses a track record of strategic leadership spanning two decades. With expertise in retail, computer vision, and effective global market liaison, Manoj has consistently steered companies toward notable market growth and industry transformation.',
    tags: ['Retail Strategy', 'Market Expansion', 'Enterprise Leadership']
  },
  {
    name: 'Danish Jamil',
    role: 'Co-Founder & Chief AI Scientist',
    bio: 'Danish Jamil brings over a decade of pioneering experience in biomedical imaging and ADAS research. With a specialized focus on wavelet transformation, computer vision, and deep convolutional neural networks, Danish leads cutting-edge facial tracking algorithms.',
    tags: ['Biomedical Imaging', 'Deep Learning', 'Computer Vision']
  },
  {
    name: 'Abhit Sinha',
    role: 'Co-Founder & VP Engineering',
    bio: 'Abhit Sinha has deep expertise in hyper-spectral imaging, 3D facial modeling, and edge computing. With a decade-long mastery of on-device neural acceleration and ASIC deployment, Abhit architectures Orbo\'s ultra-low latency, zero-cloud tech stack.',
    tags: ['Edge Computing', 'ASIC Acceleration', '3D Facial Modeling']
  }
];

export default function AboutUs() {
  return (
    <div className="about-page">
      {/* 1. Hero Section */}
      <section className="about-hero">
        <div className="container-lg">
          <div className="about-hero-grid">
            <div className="about-hero-text">
              <span className="about-badge">About ORBO</span>
              <h1 className="about-hero-title">
                Pioneering Visual AI For The Future Of Beauty Commerce
              </h1>
              <p className="about-hero-desc">
                ORBO's Beauty AI automation stack adds a visual experience and discovery layer to any brand, D2C company, e-commerce platform, or physical retailer.
              </p>
              <p className="about-hero-desc">
                Our proprietary on-device models extract actionable insights on facial landmarks, skin tone classifications, texture abnormalities, and customer intent—driving customized product recommendations while dramatically reducing customer acquisition costs (CAC).
              </p>
              <div className="about-hero-stats">
                <div className="stat-pill">
                  <strong>209+</strong> Landmarks Tracked
                </div>
                <div className="stat-pill">
                  <strong>97%</strong> On-Device Offline Processing
                </div>
                <div className="stat-pill">
                  <strong>GDPR</strong> Compliant & Zero-Data-Storage
                </div>
              </div>
            </div>

            <div className="about-hero-visual">
              <div style={{
                background: '#FFF',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255,255,255,0.8)',
              }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3' }}>
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=450&fit=crop&q=80"
                    alt="AI facial recognition technology"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {/* Scan overlay */}
                  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    {/* Scan line */}
                    <div style={{
                      position: 'absolute', top: '30%', left: '20%', right: '20%', height: '2px',
                      background: 'linear-gradient(90deg, transparent, #FF2E63, transparent)',
                      animation: 'aboutScan 2.5s infinite ease-in-out',
                    }} />
                    {/* Face landmark dots */}
                    {[
                      { top: '28%', left: '38%' },
                      { top: '28%', left: '58%' },
                      { top: '42%', left: '48%' },
                      { top: '55%', left: '48%' },
                      { top: '68%', left: '48%' },
                    ].map((dot, i) => (
                      <div key={i} style={{
                        position: 'absolute', top: dot.top, left: dot.left,
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: '#FF2E63', boxShadow: '0 0 10px rgba(255,46,99,0.6)',
                      }} />
                    ))}
                    {/* Scanning frame */}
                    <div style={{
                      position: 'absolute', top: '15%', left: '25%', width: '50%', height: '60%',
                      border: '2px solid rgba(255,46,99,0.4)', borderRadius: '50%',
                    }} />
                  </div>
                  <div style={{
                    position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(255,255,255,0.9)', padding: '6px 16px', borderRadius: '999px',
                    fontSize: '0.75rem', fontWeight: 700, color: '#09121D',
                    display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(8px)',
                  }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A' }} />
                    209 Facial Landmarks Detected
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Pillars / Values */}
      <section className="section values-section">
        <div className="container">
          <div className="text-center">
            <span className="section-tag">Our Guiding Philosophy</span>
            <h2 className="section-title">Built On Sustainable & Private AI</h2>
            <p className="section-subtitle">
              We engineer computer vision algorithms that respect user privacy, conserve cloud energy, and perform in real-time under any lighting condition.
            </p>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2"><path d="M12 22c4-4 8-8 8-14A8 8 0 0 0 4 8c0 6 4 10 8 14z"/></svg></div>
              <h3>Green & Sustainable Computing</h3>
              <p>
                By shifting inference computation from power-hungry GPU server farms to consumer edge devices, we save over 90% in carbon emissions and eliminate heavy recurring server costs.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
              <h3>100% Privacy by Design</h3>
              <p>
                Images and facial streams are processed entirely in ephemeral device memory. Zero facial biometric data is stored or transferred to the cloud, guaranteeing global GDPR & CCPA compliance.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></div>
              <h3>Clinical Grade Accuracy</h3>
              <p>
                Trained on millions of diverse ethnic skin profiles, our neural networks deliver sub-millimeter tracking accuracy and consistent results across 100+ global skin tones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Leadership & Founders Section */}
      <section className="section founders-section">
        <div className="container">
          <div className="text-center">
            <span className="section-tag">Executive Leadership</span>
            <h2 className="section-title">Meet The Founders</h2>
            <p className="section-subtitle">
              Deep tech veterans combining 40+ years of collective experience across biomedical imaging, computer vision, and retail enterprise scale.
            </p>
          </div>

          <div className="founders-grid">
            {founders.map((founder, i) => (
              <div key={i} className="founder-card">
                <div className="founder-avatar-placeholder">
                  <span className="founder-initials">
                    {founder.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="founder-name">{founder.name}</h3>
                <span className="founder-role">{founder.role}</span>
                <p className="founder-bio">{founder.bio}</p>
                <div className="founder-tags">
                  {founder.tags.map((tag, t) => (
                    <span key={t} className="founder-tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Contact Form */}
      <ContactForm />
    </div>
  );
}
