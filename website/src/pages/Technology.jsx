import React from 'react';
import ContactForm from '../components/ContactForm';
import './Technology.css';

export default function Technology() {
  return (
    <div className="tech-page">
      {/* 1. Tech Hero */}
      <section className="tech-hero">
        <div className="container-lg">
          <div className="tech-hero-content text-center">
            <span className="tech-badge">Proprietary Computer Vision & AI</span>
            <h1 className="tech-hero-title">OrboAI Technology Stack</h1>
            <p className="tech-hero-subtitle">
              On-device deep learning algorithms delivering real-time 209-point facial tracking, sub-strand hair segmentation, clinical skin analysis, and hyper-realistic AR rendering without cloud latency.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Face Tracking & MOAT Grid */}
      <section className="section tech-feature-section">
        <div className="container">
          <div className="tech-grid-2col">
            {/* Feature 1: Face Tracking Software */}
            <div className="tech-card">
              <div className="tech-card__badge">Core Tracking Engine</div>
              <h2 className="tech-card__title">209-Point Facial Tracking Software</h2>
              <p className="tech-card__text">
                Our deep facial model detects and tracks 209 landmarks on the face. It provides an accurate AI-based intelligent tracking platform for facial applications. Our model can extract or augment users' facial data, recognize skin tone or texture, and power flawless face detection.
              </p>
              <p className="tech-card__text">
                Our model can precisely detect any face in real-time even in low lighting conditions and does not require an internet connection.
              </p>
              <div className="tech-specs-box">
                <div className="spec-row">
                  <span className="spec-label">Landmark Density</span>
                  <span className="spec-value">209 3D Keypoints</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Frame Rate</span>
                  <span className="spec-value">60 FPS on iOS / Android</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Lighting Robustness</span>
                  <span className="spec-value">Dynamic Exposure Equalization</span>
                </div>
              </div>
            </div>

            {/* Feature 2: Technical MOAT */}
            <div className="tech-card tech-card--moat">
              <div className="tech-card__badge tech-card__badge--green">Competitive Advantage</div>
              <h2 className="tech-card__title">Sustainable On-Device MOAT</h2>
              <p className="tech-card__text">
                At Orbo we prioritize green and sustainable practices by abstaining from the use of GPUs and cloud infrastructure. Our commitment to privacy and global reach is reflected in our tech stack, which operates without the internet across 97% of the delivery channels.
              </p>
              <p className="tech-card__text">
                We adhere to all the international standards of data privacy and strict compliance with GDPR and CCPA.
              </p>
              <div className="moat-highlights">
                <div className="moat-pill">⚡ Zero Cloud Cost</div>
                <div className="moat-pill">🌱 90% Carbon Reduction</div>
                <div className="moat-pill">🔒 100% Privacy Preserving</div>
                <div className="moat-pill">📶 Fully Offline Capable</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Deep Segmentation & Rendering */}
      <section className="section tech-feature-section bg-light">
        <div className="container">
          <div className="tech-grid-2col">
            {/* Feature 3: Face Segmentation and Rendering */}
            <div className="tech-card">
              <div className="tech-card__badge">Deep CNN Pipeline</div>
              <h2 className="tech-card__title">Face Segmentation and Rendering</h2>
              <p className="tech-card__text">
                Experience the power of our facial feature detection enabling modifications of user appearances in AR and face-tracking platforms. Utilizing advanced convolutional neural networks, our face segmentation includes full face segmentation, skin segmentation, hair segmentation, and lips segmentation.
              </p>
              <p className="tech-card__text">
                Our renderings adapt effortlessly to varying lighting conditions and skin tones, delivering hyperrealistic experiences with photorealistic physical shader materials (Matte, Satin, Gloss, Metallic).
              </p>
            </div>

            {/* Feature 4: Hair Segmentation */}
            <div className="tech-card">
              <div className="tech-card__badge">Sub-Strand Precision</div>
              <h2 className="tech-card__title">Hair Segmentation & Shading</h2>
              <p className="tech-card__text">
                Our hair segmentation technology sets a new standard of realism. Using computer vision, we seamlessly blend the hair color and hairstyle with natural hair instead of appearing as a fake overlay.
              </p>
              <p className="tech-card__text">
                With advanced algorithms and precise mapping, our solution accurately identifies and segments individual strands, ensuring a remarkably authentic virtual try-on experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Skin Analysis & Recommendation Engine */}
      <section className="section tech-feature-section">
        <div className="container">
          <div className="tech-grid-2col">
            {/* Feature 5: Personalized Skin Analysis */}
            <div className="tech-card">
              <div className="tech-card__badge">Clinical Diagnostics</div>
              <h2 className="tech-card__title">Personalized Skin Analysis for Effective Results</h2>
              <p className="tech-card__text">
                Our AI skin analysis solution offers a personalized approach to skincare. Using a user-friendly mobile application, individuals can initiate the analysis process effortlessly. Through a quick selfie and face scan, our technology extracts crucial data on skin parameters, including texture, tone, and hydration levels.
              </p>
              <p className="tech-card__text">
                Our advanced algorithms then generate comprehensive skin analysis reports, providing valuable insights into the user's skin condition.
              </p>
            </div>

            {/* Feature 6: Recommendation Engine */}
            <div className="tech-card">
              <div className="tech-card__badge">ML Matching Core</div>
              <h2 className="tech-card__title">Beauty Recommendation Engine</h2>
              <p className="tech-card__text">
                Our platform thrives on the power of our beauty AI-driven recommendation engine, which enables us to provide personalized beauty product suggestions. By employing machine learning algorithms and thorough data analysis, our solution considers individual preferences, skin tones, and facial features for recommendations.
              </p>
              <p className="tech-card__text">
                Furthermore, our platform offers expert guidance and advice to help users effortlessly achieve their desired looks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Deep Architectural Stack: Transformers & Frequency Localization */}
      <section className="section tech-architecture-section">
        <div className="container">
          <div className="tech-arch-card">
            <div className="text-center">
              <span className="section-tag">Algorithmic Foundation</span>
              <h2 className="section-title text-white">Frequency Localization & Transformers</h2>
              <p className="section-subtitle text-light">
                Through the integration of frequency localization, transformers, and a recommendation system, our system efficiently processes and analyzes complex skin data.
              </p>
            </div>

            <div className="arch-pillars-grid">
              <div className="arch-pillar">
                <div className="arch-icon">〰️</div>
                <h3>Frequency Localization</h3>
                <p>
                  Extracts features and processes signals in spatial-frequency domains, accurately identifying subtle micro-variations in skin conditions such as fine lines, localized redness, and pore depth.
                </p>
              </div>
              <div className="arch-pillar">
                <div className="arch-icon">🔮</div>
                <h3>Vision Transformers</h3>
                <p>
                  Transformers model long-range spatial dependencies across the entire facial geometry, enhancing robustness, occlusion tolerance, and context awareness in clinical skin analysis.
                </p>
              </div>
              <div className="arch-pillar">
                <div className="arch-icon">📊</div>
                <h3>Hybrid Recommendation</h3>
                <p>
                  Calculates compatibility scores by marrying INCI ingredient profiles, skin sensitivity constraints, and color undertones to exact brand SKU catalogs with high precision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Omnichannel Deployment Channels */}
      <section className="section omnichannel-section">
        <div className="container">
          <div className="text-center">
            <span className="section-tag">Omnipresent Experience</span>
            <h2 className="section-title">Omnichannel Deployment</h2>
            <p className="section-subtitle">
              Our Beauty AI is omnichannel ready and easily integrates across websites, mobile apps, digital kiosks, and smart mirrors. This consequently increases your reach and widens your customer base.
            </p>
          </div>

          <div className="omnichannel-grid">
            <div className="omni-channel-card">
              <div className="omni-icon">🌐</div>
              <h3>Web</h3>
              <p>WebAssembly & WebGL lightweight browser SDK for Shopify, Magento, WooCommerce, and custom web builds.</p>
            </div>
            <div className="omni-channel-card">
              <div className="omni-icon">🤖</div>
              <h3>Android</h3>
              <p>Native Android SDK optimized with NNAPI and GPU acceleration for flawless 60 FPS performance.</p>
            </div>
            <div className="omni-channel-card">
              <div className="omni-icon">🍏</div>
              <h3>iOS</h3>
              <p>CoreML & Metal optimized engine delivering ultra-fast tracking and sub-millimeter AR rendering.</p>
            </div>
            <div className="omni-channel-card">
              <div className="omni-icon">🪞</div>
              <h3>Smart Mirror</h3>
              <p>Turnkey interactive mirror kiosks with gesture controls and high-definition dual-camera sensors.</p>
            </div>
            <div className="omni-channel-card">
              <div className="omni-icon">🖥️</div>
              <h3>Digital Kiosk</h3>
              <p>Interactive self-service store kiosks powering virtual consultation and direct POS checkouts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Contact Form */}
      <ContactForm />
    </div>
  );
}
