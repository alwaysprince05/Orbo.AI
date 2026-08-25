import React, { useState, useEffect } from 'react';
import './HeroSlider.css';

const slides = [
  {
    id: 1,
    bg: '#FEBBAD',
    title: 'Finding The Right Beauty Products Online Is Cumbersome And Overwhelming',
    subtitle: 'ORBO uses visual AI to personalize the buying journey for high-intent beauty shoppers.',
    badge: 'BeautyGPT Beta',
    theme: 'peach'
  },
  {
    id: 2,
    bg: '#FAC4DE',
    title: 'Get Tailored Beauty Routine For As Per Your Preferences And Unique Skin Needs',
    subtitle: 'Hyper-personalized routines derived from clinical skin tone, texture, and hydration mapping.',
    badge: 'BeautyGPT Beta',
    theme: 'pink'
  },
  {
    id: 3,
    bg: '#B5A9FF',
    title: 'Personalized Beauty Recommendations: Right At Your Fingertips',
    subtitle: 'From virtual try-ons to instant formulation matching across all digital and physical channels.',
    badge: 'BeautyGPT Beta',
    theme: 'purple'
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div 
      className="hero-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className="hero-slider__track"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div 
            key={slide.id} 
            className="hero-slider__slide"
            style={{ backgroundColor: slide.bg }}
          >
            <div className="hero-slider__container container-lg">
              <div className="hero-slider__content">
                <div className="hero-slider__tag">
                  <span>AI Powered Beauty Intelligence</span>
                </div>
                <h1 className="hero-slider__title">{slide.title}</h1>
                <p className="hero-slider__subtitle">{slide.subtitle}</p>
                <div className="hero-slider__cta-group">
                  <a 
                    href="https://beautygpt.orbo.ai/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hero-slider__btn"
                  >
                    <span className="hero-slider__btn-pill">BeautyGPT</span>
                    <span className="hero-slider__btn-badge">Beta</span>
                  </a>
                  <a href="#solutions" className="hero-slider__btn-secondary">
                    Explore Solutions →
                  </a>
                </div>
              </div>

              <div className="hero-slider__visual">
                <div className="hero-slider__visual-frame">
                  {idx === 0 && (
                    <div className="visual-interactive visual-interactive--one">
                      <div className="ai-face-scanner">
                        <div className="scanner-circle"></div>
                        <div className="scanner-line"></div>
                        <div className="point point-1"><span>Texture: Normal</span></div>
                        <div className="point point-2"><span>Hydration: 78%</span></div>
                        <div className="point point-3"><span>Skin Tone: Warm Beige</span></div>
                        <div className="mesh-grid"></div>
                      </div>
                    </div>
                  )}
                  {idx === 1 && (
                    <div className="visual-interactive visual-interactive--two">
                      <div className="ai-routine-card">
                        <div className="card-header-badge">Smart Diagnosis</div>
                        <div className="routine-item">
                          <span className="step-num">01</span>
                          <div>
                            <strong>Barrier Hydrating Cleanser</strong>
                            <p>Ceramide + Hyaluronic Blend</p>
                          </div>
                          <span className="match-tag">98% Match</span>
                        </div>
                        <div className="routine-item">
                          <span className="step-num">02</span>
                          <div>
                            <strong>Niacinamide 10% Glow Serum</strong>
                            <p>Pore refinement & radiance</p>
                          </div>
                          <span className="match-tag">95% Match</span>
                        </div>
                        <div className="routine-item">
                          <span className="step-num">03</span>
                          <div>
                            <strong>Peptide Moisture Surge</strong>
                            <p>Deep cellular nourishment</p>
                          </div>
                          <span className="match-tag">99% Match</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {idx === 2 && (
                    <div className="visual-interactive visual-interactive--three">
                      <div className="omni-hub">
                        <div className="hub-center">
                          <div className="hub-pulse"></div>
                          <span>Orbo AI Core</span>
                        </div>
                        <div className="hub-node node-web">Web / Mobile</div>
                        <div className="hub-node node-kiosk">Smart Kiosk</div>
                        <div className="hub-node node-mirror">Smart Mirror</div>
                        <div className="hub-node node-ar">AR Camera</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots navigation */}
      <div className="hero-slider__dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`hero-slider__dot ${currentSlide === idx ? 'hero-slider__dot--active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
