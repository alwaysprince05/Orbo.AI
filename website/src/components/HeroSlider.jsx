import React, { useState, useEffect, useRef } from 'react';
import './HeroSlider.css';

const slides = [
  {
    id: 1,
    bg: '#FEBBAD',
    tag: 'AI POWERED BEAUTY INTELLIGENCE',
    title: 'Finding The Right Beauty Products Online Is Cumbersome And Overwhelming',
    subtitle: 'ORBO uses visual AI to personalize the buying journey for high-intent beauty shoppers.',
    ctaText: 'BeautyGPT',
    badge: 'BETA',
    ctaLink: 'https://beautygpt.orbo.ai/',
    type: 'scan'
  },
  {
    id: 2,
    bg: '#FAC4DE',
    tag: 'HYPER-PERSONALIZED DIAGNOSTICS',
    title: 'Get Tailored Beauty Routine For As Per Your Preferences And Unique Skin Needs',
    subtitle: 'Extract clinical skin parameters, melanin index, and hydration in under 2 seconds.',
    ctaText: 'BeautyGPT',
    badge: 'BETA',
    ctaLink: 'https://beautygpt.orbo.ai/',
    type: 'routine'
  },
  {
    id: 3,
    bg: '#B5A9FF',
    tag: 'OMNICHANNEL COMMERCE LAYER',
    title: 'Personalized Beauty Recommendations: Right At Your Fingertips',
    subtitle: 'Seamless virtual try-ons and ingredient matching across Web, iOS, Android, and Smart Mirror kiosks.',
    ctaText: 'BeautyGPT',
    badge: 'BETA',
    ctaLink: 'https://beautygpt.orbo.ai/',
    type: 'omni'
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const autoPlayRef = useRef(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Auto-play every 4.2 seconds
  useEffect(() => {
    autoPlayRef.current = setInterval(nextSlide, 4200);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, []);

  const resetTimer = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(nextSlide, 4200);
  };

  const handleDotClick = (idx) => {
    setCurrentSlide(idx);
    resetTimer();
  };

  // Touch Swipe Handlers for Mobile & Trackpad
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      nextSlide();
      resetTimer();
    } else if (isRightSwipe) {
      prevSlide();
      resetTimer();
    }
  };

  return (
    <div 
      className="hero-slider-wrapper"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Navigation Arrows */}
      <button 
        className="slider-arrow slider-arrow--prev" 
        onClick={() => { prevSlide(); resetTimer(); }}
        aria-label="Previous Slide"
      >
        ‹
      </button>
      <button 
        className="slider-arrow slider-arrow--next" 
        onClick={() => { nextSlide(); resetTimer(); }}
        aria-label="Next Slide"
      >
        ›
      </button>

      {/* Track Container */}
      <div 
        className="hero-slider-track"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div 
            key={slide.id}
            className="hero-slide-item"
            style={{ backgroundColor: slide.bg }}
          >
            <div className="hero-slide-content-container container-lg">
              {/* Left Column: Text & CTA */}
              <div className="hero-slide-text-col">
                <span className="hero-slide-tag-pill">{slide.tag}</span>
                <h1 className="hero-slide-main-title">{slide.title}</h1>
                <p className="hero-slide-desc">{slide.subtitle}</p>

                <div className="hero-slide-cta-row">
                  <a 
                    href={slide.ctaLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hero-slide-main-btn"
                  >
                    <span className="btn-text">{slide.ctaText}</span>
                    <span className="btn-badge">{slide.badge}</span>
                  </a>
                  <a href="#solutions" className="hero-slide-sub-link">
                    Explore Solutions →
                  </a>
                </div>
              </div>

              {/* Right Column: Visual Component */}
              <div className="hero-slide-visual-col">
                <div className="hero-slide-visual-card">
                  {slide.type === 'scan' && (
                    <div className="visual-face-scan-box">
                      <img
                        src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&h=360&fit=crop&q=80"
                        alt="AI skin analysis"
                        className="hero-visual-photo"
                      />
                      <div className="scan-hud-overlay">
                        <div className="scan-oval-frame">
                          <div className="scan-line-laser"></div>
                        </div>
                        <div className="mesh-point-pill p-top">Texture: Normal</div>
                        <div className="mesh-point-pill p-mid">Hydration: 78%</div>
                        <div className="mesh-point-pill p-bot">Skin Tone: Warm Beige</div>
                      </div>
                    </div>
                  )}

                  {slide.type === 'routine' && (
                    <div className="visual-routine-box">
                      <div className="routine-header-pill">AI Diagnosis Matched</div>
                      <div className="routine-step-row">
                        <span className="step-badge">01</span>
                        <div>
                          <strong>Barrier Hydrating Cleanser</strong>
                          <p>Ceramide + Hyaluronic Acid</p>
                        </div>
                        <span className="match-pill">98%</span>
                      </div>
                      <div className="routine-step-row">
                        <span className="step-badge">02</span>
                        <div>
                          <strong>Niacinamide 10% Serum</strong>
                          <p>Pore refinement & balance</p>
                        </div>
                        <span className="match-pill">96%</span>
                      </div>
                      <div className="routine-step-row">
                        <span className="step-badge">03</span>
                        <div>
                          <strong>SPF 50 Mineral Defense</strong>
                          <p>Broad spectrum daily shield</p>
                        </div>
                        <span className="match-pill">99%</span>
                      </div>
                    </div>
                  )}

                  {slide.type === 'omni' && (
                    <div className="visual-omni-box">
                      <div className="omni-core-hub">
                        <div className="hub-ping"></div>
                        <span>Orbo AI Vision Core</span>
                      </div>
                      <div className="omni-node n-web">🌐 Web / Shopify</div>
                      <div className="omni-node n-app">📱 iOS / Android</div>
                      <div className="omni-node n-kiosk">🖥️ Smart Kiosk</div>
                      <div className="omni-node n-mirror">🪞 Smart Mirror</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Dots Indicator */}
      <div className="hero-slider-dots-bar">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`slider-dot-btn ${currentSlide === idx ? 'slider-dot-btn--active' : ''}`}
            onClick={() => handleDotClick(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
