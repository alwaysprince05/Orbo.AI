import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCatalog from '../../components/ProductCatalog';
import ContactForm from '../../components/ContactForm';
import OrboMouseScroll from '../../components/OrboMouseScroll';
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
      {/* 1. Pink Hero Banner (Screenshot 1) */}
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
                <div className="vm-model-circle-bg">
                  <img
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=600&fit=crop&q=80"
                    alt="Virtual makeup model"
                    className="vm-hero-real-photo"
                  />
                  <div className="vm-lip-tint-overlay" style={{ background: `radial-gradient(ellipse at 50% 75%, ${selectedLip}55 0%, transparent 45%)` }}></div>
                </div>
                <div className="vm-model-line"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Ease Of Adoption Section (Screenshot 2) */}
      <section className="section vm-ease-section">
        <div className="container">
          <div className="vm-two-col-grid">
            <div className="vm-col-visual">
              <div className="adoption-portrait-container">
                <div className="adoption-portrait-frame">
                  <div className="badge-camera-top">Camera</div>
                  <div className="badge-cart-top">Cart</div>
                  <img
                    src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop&q=80"
                    alt="Model with virtual makeup applied"
                    className="adoption-real-photo"
                  />
                  <div className="vm-lip-tint-overlay" style={{ background: `radial-gradient(ellipse at 50% 72%, ${selectedLip}55 0%, transparent 40%)` }}></div>
                  {/* Fan of lipstick shades */}
                  <div className="fan-shades-deck">
                    <div className="stick-holder stick-1" style={{ backgroundColor: '#BA0C2F' }} onClick={() => setSelectedLip('#BA0C2F')}></div>
                    <div className="stick-holder stick-2" style={{ backgroundColor: '#6B1D2F' }} onClick={() => setSelectedLip('#6B1D2F')}></div>
                    <div className="stick-holder stick-3" style={{ backgroundColor: '#C2837D' }} onClick={() => setSelectedLip('#C2837D')}></div>
                    <div className="stick-holder stick-4" style={{ backgroundColor: '#E25B5B' }} onClick={() => setSelectedLip('#E25B5B')}></div>
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
            </div>
          </div>
        </div>
      </section>

      {/* 3. Accuracy Section with Interactive Laptop Comparison (Screenshot 3) */}
      <section className="section vm-accuracy-section" id="live-demo">
        <div className="container">
          <div className="text-center">
            <h2 className="vm-sec-heading-center">Accuracy</h2>
          </div>

          <div className="vm-laptop-mockup-wrapper">
            <div className="laptop-outer-frame">
              {/* Laptop Screen */}
              <div className="laptop-screen-display">
                {/* Arm swatches overlay */}
                <div className="arm-swatches-panel">
                  <div className="arm-realistic-skin">
                    <span className="arm-header-tag">Live Arm Swatches</span>
                    <div className="swatch-stripe s1" style={{ backgroundColor: '#BA0C2F' }}></div>
                    <div className="swatch-stripe s2" style={{ backgroundColor: '#6B1D2F' }}></div>
                    <div className="swatch-stripe s3" style={{ backgroundColor: '#C2837D' }}></div>
                    <div className="swatch-stripe s4" style={{ backgroundColor: '#E25B5B' }}></div>
                    <div className="swatch-stripe s5" style={{ backgroundColor: '#4A121A' }}></div>
                  </div>
                  {/* Real Standing Lipsticks */}
                  <div className="standing-tubes-row">
                    <div className="lip-tube tube-1"><div className="tube-bullet" style={{ backgroundColor: '#BA0C2F' }}></div><div className="tube-body"></div></div>
                    <div className="lip-tube tube-2"><div className="tube-bullet" style={{ backgroundColor: '#6B1D2F' }}></div><div className="tube-body"></div></div>
                    <div className="lip-tube tube-3"><div className="tube-bullet" style={{ backgroundColor: '#C2837D' }}></div><div className="tube-body"></div></div>
                  </div>
                </div>

                {/* Makeup Software UI */}
                <div className="makeup-software-panel">
                  {/* Tabs */}
                  <div className="software-top-tabs">
                    <div className="sw-tab"><span>Concealer</span></div>
                    <div className="sw-tab"><span>Highlighter</span></div>
                    <div className="sw-tab sw-tab--active"><span>Lipstick</span></div>
                    <div className="sw-tab"><span>Eyeshadow</span></div>
                    <div className="sw-tab"><span>Eyeliner</span></div>
                    <div className="sw-tab"><span>Eyelash</span></div>
                  </div>

                  {/* Split Screen Models Comparison */}
                  <div className="sw-dual-models-viewport">
                    {/* Model 1 */}
                    <div className={`model-pane-box ${activeModel === 1 ? 'box--active' : ''}`} onClick={() => setActiveModel(1)}>
                      <div className="model-render-face">
                        <img src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=300&h=350&fit=crop&q=80" alt="Model Fair" className="model-pane-photo" />
                        <div className="model-lip-tint" style={{ background: `radial-gradient(ellipse at 50% 78%, ${selectedLip}66 0%, transparent 35%)`, opacity: activeFinish === 'Sheer' ? 0.5 : 1 }}></div>
                      </div>
                      <span className="model-label-pill pink-pill">Model 1 (Fair)</span>
                    </div>

                    {/* Middle Controls (Finish & RGB Picker) */}
                    <div className="sw-middle-controls">
                      <div className="finish-box-chips">
                        {['Matte', 'Satin', 'Sheer', 'Gloss'].map(f => (
                          <button 
                            key={f} 
                            className={`fin-chip ${activeFinish === f ? 'fin-chip--active' : ''}`}
                            onClick={() => setActiveFinish(f)}
                          >
                            {f}
                          </button>
                        ))}
                      </div>

                      <div className="rgb-box">
                        <span className="rgb-txt">Color: R:110 G:46 B:83</span>
                        <div className="current-color-block" style={{ backgroundColor: selectedLip }}></div>
                        <div className="palette-grid-mini">
                          {lipstickShades.map(s => (
                            <button
                              key={s.name}
                              className="p-mini-dot"
                              style={{ backgroundColor: s.hex }}
                              onClick={() => setSelectedLip(s.hex)}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="intensity-stepper">
                        <span className="minus-btn" onClick={() => setSelectedLip('#C2837D')}>−</span>
                        <span className="val-text">0.85</span>
                        <span className="plus-btn" onClick={() => setSelectedLip('#BA0C2F')}>+</span>
                      </div>
                    </div>

                    {/* Model 2 */}
                    <div className={`model-pane-box ${activeModel === 2 ? 'box--active' : ''}`} onClick={() => setActiveModel(2)}>
                      <div className="model-render-face face--deep">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=350&fit=crop&q=80" alt="Model Olive" className="model-pane-photo" />
                        <div className="model-lip-tint" style={{ background: `radial-gradient(ellipse at 50% 78%, ${selectedLip}66 0%, transparent 35%)`, opacity: activeFinish === 'Sheer' ? 0.5 : 1 }}></div>
                      </div>
                      <span className="model-label-pill pink-pill">Model 2 (Olive)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Laptop Base */}
              <div className="laptop-aluminum-base">
                <div className="laptop-notch-trackpad"></div>
              </div>
            </div>
          </div>

          <div className="accuracy-bullets-wrap">
            <ul className="vm-red-bullet-list">
              <li>Our calibration tool accurately extracts and identifies the shades from the entire range of the product catalog</li>
              <li>Our solution is trained on more than 700,000 images with the detection capability of six different skin types and ethnicities</li>
              <li>We provide a jitter-free virtual makeup capability to create a realistic experience</li>
            </ul>
            <OrboMouseScroll />
          </div>
        </div>
      </section>

      {/* 4. How It Works? Section with 3 Curved Phone Mockups (Screenshot 4) */}
      <section className="section vm-how-section">
        <div className="container">
          <div className="text-center">
            <h2 className="vm-sec-heading-center">How It Works?</h2>
          </div>

          <div className="how-it-works-curved-wrapper">
            <div className="curved-orbit-trajectory"></div>
            
            <div className="three-phones-row">
              {/* Phone 1 */}
              <div className="phone-isometric-card phone-1">
                <div className="phone-bezel">
                  <div className="phone-screen">
                    <div className="phone-screen-camera">
                      <div className="phone-model-face">
                        <div className="phone-lips" style={{ backgroundColor: '#FF6B6B' }}></div>
                      </div>
                      <div className="phone-bottom-shades-carousel">
                        <div className="shade-pill-chip s-active" style={{ backgroundColor: '#FF6B6B' }}></div>
                        <div className="shade-pill-chip" style={{ backgroundColor: '#BA0C2F' }}></div>
                        <div className="shade-pill-chip" style={{ backgroundColor: '#D48C84' }}></div>
                        <div className="shade-pill-chip" style={{ backgroundColor: '#801A4B' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone 2 */}
              <div className="phone-isometric-card phone-2">
                <div className="phone-bezel">
                  <div className="phone-screen">
                    <div className="phone-screen-camera">
                      <div className="phone-model-face">
                        <div className="phone-lips" style={{ backgroundColor: '#BA0C2F' }}></div>
                      </div>
                      <div className="preset-cards-horizontal-deck">
                        <div className="preset-face-card active-card"><span>Office Look</span></div>
                        <div className="preset-face-card"><span>Glam Night</span></div>
                        <div className="preset-face-card"><span>Natural Glow</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone 3 */}
              <div className="phone-isometric-card phone-3">
                <div className="phone-bezel">
                  <div className="phone-screen">
                    <div className="phone-screen-camera">
                      <div className="phone-model-face">
                        <div className="phone-lips" style={{ backgroundColor: '#BA0C2F' }}></div>
                      </div>
                      {/* Floating Similar Products Box */}
                      <div className="floating-similar-products-card">
                        <div className="similar-hdr">
                          <span>Similar Products</span>
                          <span className="close-x">×</span>
                        </div>
                        <div className="similar-item-content">
                          <span className="sim-prod-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BA0C2F" strokeWidth="2"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/></svg></span>
                          <div className="sim-prod-info">
                            <strong>Intense Matte Lipstick</strong>
                            <p>584 Ruby Red, 3.8 gm</p>
                          </div>
                          <button className="sim-buy-btn">Buy now</button>
                        </div>
                      </div>

                      <div className="phone-category-icons-row">
                        <span className="cat-bubble">Eye</span>
                        <span className="cat-bubble">Lip</span>
                        <span className="cat-bubble active-bubble">Lip</span>
                        <span className="cat-bubble">Eye</span>
                      </div>
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
            <OrboMouseScroll />
          </div>
        </div>
      </section>

      {/* 5. How/Where To Integrate (Screenshot 5 Top) */}
      <section className="section vm-integration-showcase-section">
        <div className="container">
          <div className="integration-split-columns">
            {/* Column 1: API and SDK */}
            <div className="integration-column-box">
              <h2 className="integration-column-title">API and SDK</h2>
              <div className="integration-circular-visual">
                <div className="circle-glow-bg">
                  <img
                    src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=300&h=300&fit=crop&q=80"
                    alt="API SDK beauty integration"
                    className="integration-real-photo"
                  />
                </div>
              </div>
              <p className="integration-column-desc">
                Integrate our virtual makeup API or SDK across multiple devices
              </p>
            </div>

            {/* Vertical Divider */}
            <div className="integration-vertical-divider"></div>

            {/* Column 2: Cross-platform Integration */}
            <div className="integration-column-box">
              <h2 className="integration-column-title">Cross-platform Integration</h2>
              <div className="integration-circular-visual">
                <div className="circle-glow-bg pink-glow">
                  <img
                    src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop&q=80"
                    alt="Cross-platform beauty integration"
                    className="integration-real-photo"
                  />
                </div>
              </div>
              <p className="integration-column-desc">
                As a smart mirror, digital kiosk, website, tablet, and mobile application
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOUNDATION SHADE FINDER Section (Screenshot 5 Bottom) */}
      <section className="section vm-foundation-blue-section">
        <div className="container-lg">
          <div className="foundation-blue-card">
            <div className="foundation-card-left">
              <span className="foundation-card-tag">FOUNDATION SHADE FINDER</span>
              <h2 className="foundation-card-title">Recommend Foundation By Auto-detection Of Skin Tone</h2>
              <p className="foundation-card-desc">
                Reduce purchase barriers by empowering users to find the right foundation shade effortlessly
              </p>
              <div className="foundation-card-btn-wrap">
                <Link to="/foundation-shadefinder" className="btn btn-primary btn-lg">
                  Explore Shade Finder →
                </Link>
              </div>
            </div>

            <div className="foundation-card-right">
              <div className="foundation-circle-cutout-wrap">
                <div className="foundation-circle-bg">
                  <img
                    src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&q=80"
                    alt="Foundation shade matching"
                    className="foundation-real-photo"
                  />
                </div>
                <div className="foundation-white-line"></div>
              </div>
            </div>
          </div>
          <OrboMouseScroll />
        </div>
      </section>

      {/* 7. Brand Benefits Section */}
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

      {/* 8. Who We Work With ? */}
      <section className="section vm-partners-section">
        <div className="container">
          <div className="text-center">
            <h2 className="vm-sec-heading-center">Who We Work With ?</h2>
          </div>

          <div className="who-grid">
            <div className="who-card">
              <div className="who-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></div>
              <h3>Developers and camera apps</h3>
              <p>Deliver a great customer experience with lightweight on-device WebGL and CoreML libraries.</p>
            </div>
            <div className="who-card">
              <div className="who-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
              <h3>Online and offline retailers</h3>
              <p>Create a powerful conversion funnel across e-commerce, digital kiosks, and smart mirror booths.</p>
            </div>
            <div className="who-card">
              <div className="who-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></div>
              <h3>Color cosmetics brands</h3>
              <p>Bridge the gap between product & customer with zero-cost digital sampling at global scale.</p>
            </div>
            <div className="who-card">
              <div className="who-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
              <h3>Advertising & marketing agencies</h3>
              <p>Enable agencies to create viral AR try-on ad campaigns and engaging interactive sponsorships.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Real Makeup Products Catalog */}
      <ProductCatalog 
        initialCategory="lipstick"
        showFilters={true}
        title="Ready-to-Test Virtual Makeup Formulations"
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
