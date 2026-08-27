import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import InteractiveBeautyCanvas from '../components/InteractiveBeautyCanvas';
import ProductCatalog from '../components/ProductCatalog';
import ContactForm from '../components/ContactForm';
import OrboMouseScroll from '../components/OrboMouseScroll';
import './Home.css';

const solutionsList = [
  {
    id: 'virtualMakeup',
    title: 'Virtual Makeup',
    subtitle: 'Hyperrealistic AR Try-On for Lipsticks, Eye Shadow, Blush & Liners',
    path: '/virtual-makeup',
    color: '#FF4D80',
    tag: 'AR Try-On',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=240&fit=crop&q=80',
    highlights: ['Sub-pixel accuracy', 'Texture preservation (Matte, Gloss, Shimmer)', 'Real-time 60 FPS']
  },
  {
    id: 'virtualHaircolor',
    title: 'Virtual Hair Color',
    subtitle: 'Live strand-by-strand hair segmentation and natural multi-shade tinting',
    path: '/virtual-haircolor',
    color: '#9B51E0',
    tag: 'Hair Segmentation',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=240&fit=crop&q=80',
    highlights: ['Individual strand blending', 'Ombré & Balayage support', 'Zero bleed on face']
  },
  {
    id: 'virtualHairstyle',
    title: 'Virtual Hair Styler',
    subtitle: 'AI hairstyle transformations tailored to facial geometry and proportions',
    path: '/virtual-hairstyle',
    color: '#2D9CDB',
    tag: '3D Styling',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=240&fit=crop&q=80',
    highlights: ['Length & volume adaptation', 'Face shape matching', 'Instant simulation']
  },
  {
    id: 'foundationShade',
    title: 'Foundation Shade Finder',
    subtitle: 'Sub-tone and melanin level classification with custom brand palette mapping',
    path: '/foundation-shadefinder',
    color: '#F2994A',
    tag: 'Shade Match',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=240&fit=crop&q=80',
    highlights: ['Lighting compensation', 'Warm, Cool, Neutral undertone', 'Exact SKU matching']
  },
  {
    id: 'smartSkin',
    title: 'Smart Skin Analysis',
    subtitle: 'Clinical-grade skin metric scoring (texture, wrinkles, hydration, dark spots)',
    path: '/smart-skinanalysis',
    color: '#27AE60',
    tag: 'Skin Diagnostic',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=240&fit=crop&q=80',
    highlights: ['209 Facial landmarks', 'Dermatologist verified metrics', 'Targeted product routing']
  },
  {
    id: 'facialAttributes',
    title: 'Facial Attributes Enhancement',
    subtitle: 'Natural retouching, blemish removal, and age-defying visual simulation',
    path: '/facial-attributes',
    color: '#EB5757',
    tag: 'Retouch AI',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=400&h=240&fit=crop&q=80',
    highlights: ['Micro-blemish smoothing', 'Skin glow enhancement', 'Preserves natural features']
  },
  {
    id: 'smartBeauty',
    title: 'Smart Beauty Mirror',
    subtitle: 'In-store smart mirror kiosk software delivering interactive retail consultations',
    path: '/smart-beautymirror',
    color: '#56CCF2',
    tag: 'In-Store Retail',
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=240&fit=crop&q=80',
    highlights: ['Touchless gesture control', 'Split-screen before/after', 'POS integration']
  },
  {
    id: 'bGpt',
    title: 'BeautyGPT Advisor',
    subtitle: 'Conversational Generative AI beauty advisor integrated with skin analytics',
    path: '/beautygpt',
    color: '#BB6BD9',
    tag: 'GenAI Advisor',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=240&fit=crop&q=80',
    highlights: ['Context-aware product recommendations', 'Multi-turn consultations', 'API & Webhook ready']
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('api');
  const [apiResponseStatus, setApiResponseStatus] = useState('idle');

  const runApiSimulation = () => {
    setApiResponseStatus('loading');
    setTimeout(() => {
      setApiResponseStatus('success');
    }, 600);
  };

  return (
    <div className="home-page">
      {/* 1. Main Hero Carousel */}
      <HeroSlider />

      {/* 2. Hero Brand Statement Section */}
      <section className="section brand-hero-section">
        <div className="container">
          <div className="brand-hero-content text-center">
            <div className="brand-hero-badge">Next-Gen Visual Automation</div>
            <h1 className="brand-hero-title">
              Bringing Beauty Brands Closer <br />
              To <span className="text-gradient">300M+</span> Global Customers
            </h1>
            <p className="brand-hero-desc">
              Elevate customer experience with Visual AI automation. Boost conversions by 3.2x, reduce product returns by 40%, and deliver hyper-personalized beauty consultations on Web, Mobile, and Smart Mirrors.
            </p>
            <div className="brand-hero-cta">
              <a href="#canvas-studio" className="btn btn-primary btn-lg">
                Launch Interactive AI Studio
              </a>
              <a href="#products" className="btn btn-outline btn-lg">
                Explore Beauty Products & SKUs
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Interactive AI Studio / Before-After Canvas */}
      <section className="section" id="canvas-studio">
        <div className="container">
          <div className="text-center">
            <span className="section-tag">Hands-On Demonstration</span>
            <h2 className="section-title">Experience Orbo Visual AI In Action</h2>
            <p className="section-subtitle">
              Drag the interactive slider below to test Virtual Makeup, Clinical Skin Analysis, and Foundation Shade classification in real time.
            </p>
          </div>

          <InteractiveBeautyCanvas />
          <OrboMouseScroll />
        </div>
      </section>

      {/* 4. Stats / MOAT Bar */}
      <section className="metrics-bar">
        <div className="container-lg">
          <div className="metrics-grid">
            <div className="metric-item">
              <span className="metric-num">209</span>
              <span className="metric-label">Facial Landmarks Tracked in Real-Time</span>
            </div>
            <div className="metric-item">
              <span className="metric-num">97%</span>
              <span className="metric-label">Runs On-Device (Zero Cloud / No Internet Needed)</span>
            </div>
            <div className="metric-item">
              <span className="metric-num">&lt; 15ms</span>
              <span className="metric-label">Ultra-low Latency Inference at 60 FPS</span>
            </div>
            <div className="metric-item">
              <span className="metric-num">100%</span>
              <span className="metric-label">GDPR & CCPA Compliant Privacy Architecture</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Complete 8 Solutions Showcase */}
      <section className="section solutions-section" id="solutions">
        <div className="container">
          <div className="text-center">
            <span className="section-tag">Modular Product Suite</span>
            <h2 className="section-title">End-to-End Beauty Tech Solutions</h2>
            <p className="section-subtitle">
              Deploy individually or as a unified omnichannel suite across e-commerce, mobile applications, digital kiosks, and smart beauty mirrors.
            </p>
          </div>

          <div className="solutions-grid">
            {solutionsList.map((item) => (
              <div key={item.id} className="solution-card">
                <div className="solution-card__image-wrap">
                  <img src={item.image} alt={item.title} className="solution-card__image" loading="lazy" />
                  <span className="solution-card__tag" style={{ color: item.color, backgroundColor: `${item.color}15` }}>
                    {item.tag}
                  </span>
                </div>
                <h3 className="solution-card__title">{item.title}</h3>
                <p className="solution-card__desc">{item.subtitle}</p>

                <ul className="solution-card__highlights">
                  {item.highlights.map((h, i) => (
                    <li key={i}>
                      <span className="bullet">✓</span> {h}
                    </li>
                  ))}
                </ul>

                <Link to={item.path} className="solution-card__link">
                  Try Solution Demo <span className="arrow">→</span>
                </Link>
              </div>
            ))}
          </div>
          <OrboMouseScroll />
        </div>
      </section>

      {/* 6. Real Skincare & Beauty Product Catalog */}
      <ProductCatalog 
        title="Personalized Beauty Products & Recommendations"
        subtitle="Filter by skin type, concern, and budget to view AI match percentages and active formulation science."
      />

      {/* 7. Integration Channels Section (API / SDK / Shopify) */}
      <section className="section integration-section">
        <div className="container">
          <div className="text-center">
            <span className="section-tag">Developer & Platform Friendly</span>
            <h2 className="section-title">Seamless Omnichannel Deployment</h2>
            <p className="section-subtitle">
              Integrate in minutes with lightweight SDKs, REST APIs, or one-click Shopify and Magento app extensions.
            </p>
          </div>

          <div className="integration-tabs-wrapper">
            <div className="integration-tabs">
              <button
                className={`tab-btn ${activeTab === 'api' ? 'tab-btn--active' : ''}`}
                onClick={() => setActiveTab('api')}
              >
                <span className="tab-icon">01</span> Cloud & On-Device REST API
              </button>
              <button
                className={`tab-btn ${activeTab === 'sdk' ? 'tab-btn--active' : ''}`}
                onClick={() => setActiveTab('sdk')}
              >
                <span className="tab-icon">02</span> iOS & Android Mobile SDK
              </button>
              <button
                className={`tab-btn ${activeTab === 'shopify' ? 'tab-btn--active' : ''}`}
                onClick={() => setActiveTab('shopify')}
              >
                <span className="tab-icon">03</span> Shopify & E-Commerce Plugin
              </button>
            </div>

            <div className="integration-content">
              {activeTab === 'api' && (
                <div className="tab-pane animate-fade-in">
                  <div className="tab-pane-text">
                    <h3>High Performance Beauty AI API</h3>
                    <p>
                      Process high-resolution images or live video streams with our low-latency inference endpoint. Returns exact facial landmarks, skin diagnostic scores, and recommended product IDs.
                    </p>
                    <ul className="feature-bullets">
                      <li>JSON response with 209 normalized facial coordinates</li>
                      <li>RGB skin-tone sub-classification & hydration levels</li>
                      <li>Batch processing and webhook event callbacks</li>
                    </ul>
                    <button onClick={runApiSimulation} className="btn btn-primary">
                      {apiResponseStatus === 'loading' ? 'Sending...' : 'Test Live Endpoint'}
                    </button>
                  </div>
                  <div className="code-box">
                    <div className="code-box-header">
                      <span className="dot red"></span>
                      <span className="dot yellow"></span>
                      <span className="dot green"></span>
                      <span className="code-title">POST /api/v1/skin-analysis • 200 OK (11.4ms)</span>
                    </div>
                    <pre>
                      <code>{`// Request payload
curl -X POST "https://api.orbo.ai/v1/analyze" \\
  -H "Authorization: Bearer ORBO_KEY_PROD" \\
  -F "image=@customer_selfie.jpg" \\
  -F "include_landmarks=true"

// Response (Status: 200 OK • 11.4ms)
{
  "status": "success",
  "skin_profile": {
    "tone_category": "Warm_Medium_04",
    "hydration_index": 88.4,
    "oiliness_score": 28.0,
    "texture_grade": "Smooth (Grade A)",
    "acne_risk": "Low"
  },
  "matched_products": [
    { "sku": "CERAVE_HYDRA_01", "match": "98%" },
    { "sku": "ORDINARY_NIACIN_10", "match": "96%" }
  ]
}`}</code>
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === 'sdk' && (
                <div className="tab-pane animate-fade-in">
                  <div className="tab-pane-text">
                    <h3>Native Mobile SDK (iOS & Android)</h3>
                    <p>
                      Ultra-lightweight binary (under 4MB) running directly on Neural Engine and GPU without needing an active internet connection. Guarantees 60 FPS real-time AR try-on.
                    </p>
                    <ul className="feature-bullets">
                      <li>Supports Swift, Kotlin, React Native, and Flutter</li>
                      <li>Camera feed pipeline with zero frame stutter</li>
                      <li>Offline mode: 100% user privacy and GDPR compliant</li>
                    </ul>
                    <a href="#requestDemo" className="btn btn-primary">Download Mobile SDK Docs</a>
                  </div>
                  <div className="code-box">
                    <div className="code-box-header">
                      <span className="dot red"></span>
                      <span className="dot yellow"></span>
                      <span className="dot green"></span>
                      <span className="code-title">OrboBeautySDK.swift</span>
                    </div>
                    <pre>
                      <code>{`import OrboBeautyCore

let orboCamera = OrboARCameraView(frame: view.bounds)
orboCamera.delegate = self
view.addSubview(orboCamera)

// Apply Virtual Lipstick Shade live at 60 FPS
orboCamera.applyMakeup(
  category: .lips,
  hexColor: "#E63946",
  finish: .matteVelvet,
  intensity: 0.85
)`}</code>
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === 'shopify' && (
                <div className="tab-pane animate-fade-in">
                  <div className="tab-pane-text">
                    <h3>1-Click Shopify & Headless App</h3>
                    <p>
                      Add a "Try-On Live" or "Find My Perfect Shade" widget to your Product Detail Pages (PDP) in less than 5 minutes. Syncs directly with your Shopify product catalog.
                    </p>
                    <ul className="feature-bullets">
                      <li>Compatible with Shopify Online Store 2.0 themes</li>
                      <li>Adds to cart directly from AR try-on interface</li>
                      <li>A/B testing dashboard for conversion tracking</li>
                    </ul>
                    <a href="#requestDemo" className="btn btn-primary">Install Shopify App</a>
                  </div>
                  <div className="code-box">
                    <div className="code-box-header">
                      <span className="dot red"></span>
                      <span className="dot yellow"></span>
                      <span className="dot green"></span>
                      <span className="code-title">product.liquid</span>
                    </div>
                    <pre>
                      <code>{`<!-- Orbo Shopify App Snippet -->
<div id="orbo-try-on-widget"
  data-product-id="{{ product.id }}"
  data-sku="{{ product.variants.first.sku }}"
  data-mode="virtual-makeup"
  data-theme="minimal-pink">
</div>
<script async src="https://cdn.orbo.ai/shopify/orbo-widget.js"></script>`}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact / Demo Section */}
      <ContactForm />
    </div>
  );
}
