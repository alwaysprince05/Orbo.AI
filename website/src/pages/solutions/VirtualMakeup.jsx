import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCatalog from '../../components/ProductCatalog';
import ContactForm from '../../components/ContactForm';
import './VirtualMakeup.css';

const faqs = [
  {
    q: "What is Orbo's Virtual Makeup Try‑On?",
    a: "Orbo's Virtual Makeup Try-On is an enterprise-grade AI solution that allows customers to virtually try on lipsticks, blushes, eyeshadows, foundations, and eyeliners in real-time through live web camera, uploaded photo, or video stream with realistic texture and color reproduction."
  },
  {
    q: "How accurate is the virtual makeup application?",
    a: "Our calibration tool accurately extracts and identifies shades from the entire range of your brand catalog. Trained on more than 700,000 diverse facial images with detection capability across six distinct skin types and ethnicities, it delivers sub-pixel precision and 60 FPS jitter-free tracking."
  },
  {
    q: "Can Orbo's Virtual Makeup Try‑On be integrated into existing platforms?",
    a: "Yes! Our lightweight WebAssembly/WebGL Web SDK, native iOS/Android SDKs, and 1-click Shopify/Magento plugins allow seamless embedding into your existing website, mobile app, in-store digital kiosk, or smart beauty mirror in minutes."
  },
  {
    q: "What are the benefits for brands implementing this technology?",
    a: "Brands experience an average 3.2x increase in conversion rate, 42% reduction in product return rates, 85% reduction in physical makeup tester sampling costs, and significantly increased customer dwell time."
  },
  {
    q: "How does the Foundation Shade Finder feature work?",
    a: "Our colorimetry engine analyzes lighting conditions, white balance, and multi-zone facial pigmentation to identify exact melanin levels and skin undertones (Warm, Cool, Neutral, Olive), instantly matching the customer to the closest SKU in your foundation catalog."
  },
  {
    q: "Who can benefit from integrating Orbo's Virtual Makeup Try‑On?",
    a: "Color cosmetics brands, D2C beauty retailers, omnichannel department stores, beauty salons, indie creators, and mobile camera apps looking to personalize customer discovery and eliminate online shopping guesswork."
  }
];

export default function VirtualMakeup() {
  const [openFaq, setOpenFaq] = useState(0);
  const [selectedLip, setSelectedLip] = useState('#BA0C2F');
  const [activeFinish, setActiveFinish] = useState('Matte');
  const [activeModel, setActiveModel] = useState(1);

  const lipstickShades = [
    { name: 'Ruby Woo', hex: '#BA0C2F', finish: 'Matte' },
    { name: 'Velvet Plum', hex: '#6B1D2F', finish: 'Velvet' },
    { name: 'Pillow Talk Nude', hex: '#C2837D', finish: 'Satin' },
    { name: 'Coral Pop', hex: '#E25B5B', finish: 'Gloss' },
    { name: 'Deep Burgundy', hex: '#4A121A', finish: 'Matte' },
    { name: 'Rose Petal', hex: '#D66D75', finish: 'Sheer' }
  ];

  return (
    <div className="vm-page">
      {/* 1. Pink Hero Banner */}
      <section className="vm-hero-section">
        <div className="container-lg">
          <div className="vm-hero-card">
            <div className="vm-hero-left">
              <span className="vm-hero-tag">VIRTUAL MAKEUP</span>
              <h1 className="vm-hero-title">AI-powered Virtual Makeup Try-on</h1>
              <p className="vm-hero-subtitle">
                Personalize the buying experience of customers by recommending customized beauty products
              </p>
              <div className="vm-hero-btn-wrap">
                <a href="#live-demo" className="btn vm-try-btn">
                  Try it now
                </a>
              </div>
            </div>

            <div className="vm-hero-right">
              <div className="vm-model-cutout-wrap">
                <div className="vm-model-circle-bg"></div>
                <div className="vm-model-portrait">
                  <div className="model-avatar-graphic">
                    <div className="model-hair-style"></div>
                    <div className="model-face-glow">
                      <div className="model-lips-styled" style={{ backgroundColor: selectedLip }}></div>
                    </div>
                  </div>
                </div>
                <div className="vm-model-line"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Ease Of Adoption Section */}
      <section className="section vm-ease-section">
        <div className="container">
          <div className="vm-two-col-grid">
            <div className="vm-col-visual">
              <div className="vm-adoption-card">
                <div className="adoption-preview-box">
                  <div className="model-selfie-frame">
                    <div className="selfie-camera-icon">📷 Camera</div>
                    <div className="selfie-cart-icon">🛒 Cart</div>
                    <div className="selfie-face-art">
                      <div className="art-lips" style={{ backgroundColor: selectedLip }}></div>
                    </div>
                    {/* Swatches Fan */}
                    <div className="shades-fan-row">
                      {lipstickShades.slice(0, 4).map((s, i) => (
                        <div 
                          key={i} 
                          className="shade-stick" 
                          style={{ backgroundColor: s.hex }}
                          onClick={() => setSelectedLip(s.hex)}
                          title={s.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="vm-col-content">
              <h2 className="vm-sec-heading">Ease Of Adoption</h2>
              <ul className="vm-red-bullet-list">
                <li>Build a virtual try-on experience through your website</li>
                <li>Separate mobile application not required for offering a real-time virtual makeup experience</li>
                <li>Create an immersive virtual dressing room or a virtual beauty counter for your customers</li>
              </ul>
              <div className="vm-cta-small">
                <a href="#requestDemo" className="btn btn-outline">Schedule Web Demo →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Accuracy Section with Interactive Laptop Comparison */}
      <section className="section vm-accuracy-section" id="live-demo">
        <div className="container">
          <div className="text-center">
            <h2 className="vm-sec-heading-center">Accuracy</h2>
          </div>

          <div className="vm-laptop-mockup-wrapper">
            <div className="laptop-container">
              {/* Laptop Screen */}
              <div className="laptop-screen">
                {/* Arm swatches overlay */}
                <div className="arm-swatches-overlay">
                  <div className="arm-graphic">
                    <span className="arm-label">Live Arm Swatches</span>
                    <div className="arm-stripe stripe-1"></div>
                    <div className="arm-stripe stripe-2"></div>
                    <div className="arm-stripe stripe-3"></div>
                    <div className="arm-stripe stripe-4"></div>
                    <div className="arm-stripe stripe-5"></div>
                  </div>
                </div>

                {/* Cosmetics Screen App Header */}
                <div className="cosmetics-app-window">
                  <div className="cosmetics-tabs-bar">
                    <span className="c-tab">Concealer</span>
                    <span className="c-tab">Highlighter</span>
                    <span className="c-tab c-tab--active">💄 Lipstick</span>
                    <span className="c-tab">Eyeshadow</span>
                    <span className="c-tab">Eyeliner</span>
                    <span className="c-tab">Eyelash</span>
                  </div>

                  <div className="cosmetics-split-view">
                    {/* Model 1 View */}
                    <div className={`model-split-pane ${activeModel === 1 ? 'pane--active' : ''}`} onClick={() => setActiveModel(1)}>
                      <div className="model-avatar-render">
                        <div className="model-headshot">
                          <div className="render-eyes"></div>
                          <div className="render-lips" style={{ backgroundColor: selectedLip, opacity: activeFinish === 'Sheer' ? 0.7 : 1 }}></div>
                        </div>
                      </div>
                      <span className="model-tag-badge">Model 1 (Fair Warm)</span>
                    </div>

                    {/* Controls Sidebar */}
                    <div className="laptop-controls-sidebar">
                      <div className="finish-selectors">
                        {['Matte', 'Satin', 'Sheer', 'Gloss'].map(f => (
                          <button 
                            key={f} 
                            className={`f-btn ${activeFinish === f ? 'f-btn--active' : ''}`}
                            onClick={() => setActiveFinish(f)}
                          >
                            {f}
                          </button>
                        ))}
                      </div>

                      <div className="color-swatch-picker">
                        <span className="color-label">Selected Chroma:</span>
                        <div className="color-current-preview" style={{ backgroundColor: selectedLip }}></div>
                        <div className="mini-palette">
                          {lipstickShades.map(s => (
                            <button
                              key={s.name}
                              className="mini-swatch"
                              style={{ backgroundColor: s.hex }}
                              onClick={() => setSelectedLip(s.hex)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Model 2 View */}
                    <div className={`model-split-pane ${activeModel === 2 ? 'pane--active' : ''}`} onClick={() => setActiveModel(2)}>
                      <div className="model-avatar-render">
                        <div className="model-headshot model-headshot--deep">
                          <div className="render-eyes"></div>
                          <div className="render-lips" style={{ backgroundColor: selectedLip }}></div>
                        </div>
                      </div>
                      <span className="model-tag-badge">Model 2 (Deep Olive)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="laptop-keyboard-base">
                <div className="laptop-trackpad"></div>
              </div>
            </div>
          </div>

          <div className="accuracy-bullets-wrap">
            <ul className="vm-red-bullet-list">
              <li>Our calibration tool accurately extracts and identifies the shades from the entire range of the product catalog</li>
              <li>Our solution is trained on more than 700,000 images with the detection capability of six different skin types and ethnicities</li>
              <li>We provide a jitter-free virtual makeup capability to create a realistic experience</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Brand Benefits Section */}
      <section className="section vm-benefits-section">
        <div className="container">
          <div className="text-center">
            <h2 className="vm-sec-heading-center">Brand Benefits</h2>
          </div>

          <div className="benefits-cards-grid">
            <div className="benefit-pill-card">
              <div className="benefit-check-dot">✓</div>
              <h3>Reduction in makeup sampling cost</h3>
              <p>Eliminate millions wasted on single-use plastic physical testers and sanitation protocols.</p>
            </div>
            <div className="benefit-pill-card">
              <div className="benefit-check-dot">✓</div>
              <h3>Enable customers to try makeup from their home</h3>
              <p>Turn every smartphone and laptop screen into an interactive virtual beauty counter 24/7.</p>
            </div>
            <div className="benefit-pill-card">
              <div className="benefit-check-dot">✓</div>
              <h3>Understand consumer behavior</h3>
              <p>Gain high-intent behavioral insights into popular shades, preferred finishes, and cart dwell times.</p>
            </div>
            <div className="benefit-pill-card">
              <div className="benefit-check-dot">✓</div>
              <h3>Collect customer data points & offer personalized recommendations</h3>
              <p>Feed customer skin undertones directly into AI engines to cross-sell matching blush and mascara.</p>
            </div>
            <div className="benefit-pill-card">
              <div className="benefit-check-dot">✓</div>
              <h3>Avoid dead stock by providing a digital catalog</h3>
              <p>Test new seasonal product launches digitally before committing to massive physical manufacturing runs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works Section with 3 Curved Phone Mockups */}
      <section className="section vm-how-section">
        <div className="container">
          <div className="text-center">
            <h2 className="vm-sec-heading-center">How It Works?</h2>
          </div>

          <div className="how-it-works-visual-flow">
            {/* Phone 1 */}
            <div className="phone-step-card">
              <div className="step-number-tag">Step 1</div>
              <div className="phone-mockup">
                <div className="phone-screen-content">
                  <div className="phone-header-bar">
                    <span>Camera Live</span>
                  </div>
                  <div className="phone-face-preview">
                    <div className="phone-lips-apply" style={{ backgroundColor: '#FF6B6B' }}></div>
                  </div>
                  <div className="phone-swatch-carousel">
                    <div className="p-dot" style={{ backgroundColor: '#D62246' }}></div>
                    <div className="p-dot" style={{ backgroundColor: '#FF6B6B' }}></div>
                    <div className="p-dot" style={{ backgroundColor: '#BA0C2F' }}></div>
                    <div className="p-dot" style={{ backgroundColor: '#801A4B' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone 2 */}
            <div className="phone-step-card">
              <div className="step-number-tag">Step 2</div>
              <div className="phone-mockup">
                <div className="phone-screen-content">
                  <div className="phone-header-bar">
                    <span>Preset Looks</span>
                  </div>
                  <div className="phone-face-preview">
                    <div className="phone-lips-apply" style={{ backgroundColor: '#BA0C2F' }}></div>
                  </div>
                  <div className="preset-looks-row">
                    <span className="preset-chip">Glam Red</span>
                    <span className="preset-chip">Smokey</span>
                    <span className="preset-chip">Natural</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone 3 */}
            <div className="phone-step-card">
              <div className="step-number-tag">Step 3</div>
              <div className="phone-mockup">
                <div className="phone-screen-content">
                  <div className="phone-header-bar">
                    <span>Instant Match</span>
                  </div>
                  <div className="phone-face-preview">
                    <div className="phone-lips-apply" style={{ backgroundColor: '#D62246' }}></div>
                  </div>
                  {/* Floating Similar Product Overlay */}
                  <div className="phone-product-popup">
                    <span className="popup-title">🛒 Similar Products</span>
                    <div className="popup-item">
                      <span className="p-img">💄</span>
                      <div>
                        <strong>Intense Matte Ruby</strong>
                        <p>$23.00 • 98% Match</p>
                      </div>
                      <button className="popup-buy-btn">Buy Now</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="how-bullets-wrap">
            <ul className="vm-red-bullet-list">
              <li>Click your photo using the device camera or try makeup in real-time</li>
              <li>Choose the product and shade or apply a preset look</li>
              <li>Our technology automatically applies the shade/look and also recommends products</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Who We Work With ? */}
      <section className="section vm-partners-section">
        <div className="container">
          <div className="text-center">
            <h2 className="vm-sec-heading-center">Who We Work With ?</h2>
          </div>

          <div className="who-grid">
            <div className="who-card">
              <div className="who-icon">📱</div>
              <h3>Developers and camera apps</h3>
              <p>Deliver a great customer experience with lightweight on-device WebGL and CoreML libraries.</p>
            </div>
            <div className="who-card">
              <div className="who-icon">🏪</div>
              <h3>Online and offline retailers</h3>
              <p>Create a powerful conversion funnel across e-commerce, digital kiosks, and smart mirror booths.</p>
            </div>
            <div className="who-card">
              <div className="who-icon">💄</div>
              <h3>Color cosmetics brands</h3>
              <p>Bridge the gap between product & customer with zero-cost digital sampling at global scale.</p>
            </div>
            <div className="who-card">
              <div className="who-icon">📢</div>
              <h3>Advertising & marketing agencies</h3>
              <p>Enable agencies to create viral AR try-on ad campaigns and engaging interactive sponsorships.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. How/Where To Integrate */}
      <section className="section vm-integrate-section">
        <div className="container">
          <div className="text-center">
            <h2 className="vm-sec-heading-center">How / Where To Integrate</h2>
          </div>

          <div className="integrate-two-grid">
            <div className="integrate-card">
              <span className="integrate-badge">Developers</span>
              <h3>API and SDK</h3>
              <p>Integrate our virtual makeup API or SDK across multiple devices, native operating systems, and headless architectures.</p>
            </div>
            <div className="integrate-card">
              <span className="integrate-badge">Enterprise</span>
              <h3>Cross-platform Integration</h3>
              <p>Deploy as a smart beauty mirror, in-store digital kiosk, e-commerce website, tablet sales tool, and mobile application.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOUNDATION SHADE FINDER Banner */}
      <section className="vm-foundation-callout-section">
        <div className="container">
          <div className="foundation-banner-card">
            <div className="foundation-banner-text">
              <span className="foundation-tag">FOUNDATION SHADE FINDER</span>
              <h2>Recommend Foundation By Auto-detection Of Skin Tone</h2>
              <p>Reduce purchase barriers by empowering users to find the right foundation shade effortlessly.</p>
            </div>
            <Link to="/foundation-shadefinder" className="btn btn-primary btn-lg">
              Explore Shade Finder →
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Real Makeup Product Catalog */}
      <ProductCatalog 
        initialCategory="lipstick"
        showFilters={true}
        title="Ready-to-Test Virtual Makeup Catalog"
        subtitle="Test actual M·A·C, Charlotte Tilbury, and Fenty Beauty formulations with instant AR shaders."
      />

      {/* 10. FAQs Accordion */}
      <section className="section vm-faq-section">
        <div className="container">
          <div className="text-center">
            <h2 className="vm-sec-heading-center">FAQ's</h2>
          </div>

          <div className="faq-accordion-wrap">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`faq-item ${openFaq === idx ? 'faq-item--open' : ''}`}
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
              >
                <div className="faq-question">
                  <span>{faq.q}</span>
                  <span className="faq-toggle-icon">{openFaq === idx ? '−' : '+'}</span>
                </div>
                {openFaq === idx && (
                  <div className="faq-answer animate-fade-in">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Contact Form */}
      <ContactForm />
    </div>
  );
}
