import React, { useState } from 'react';
import './SharkTankHeroBanner.css';

export default function SharkTankHeroBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="shark-tank-hero-banner">
      <button 
        className="st-close-btn" 
        onClick={() => setIsVisible(false)}
        aria-label="Close banner"
      >
        ×
      </button>

      <div className="st-banner-container container-lg">
        <div className="st-banner-grid">
          {/* Smart Mirror Graphic */}
          <div className="st-mirror-kiosk-wrap">
            <div className="st-mirror-frame">
              <div className="st-mirror-screen">
                <div className="st-mirror-face">
                  <div className="mirror-face-mesh"></div>
                  <div className="mirror-lips-glow"></div>
                </div>
              </div>
              <div className="st-mirror-stand"></div>
            </div>
          </div>

          {/* Heading Text */}
          <div className="st-banner-text">
            <div className="st-title-line">Beauty Advisor</div>
            <div className="st-subtitle-line">
              Powered by <span className="st-white-bold">Generative AI</span> and <span className="st-white-bold">Computer Vision</span>
            </div>
          </div>

          {/* 3 Founders Graphic & BeautyGPT Logo */}
          <div className="st-founders-wrap">
            <div className="st-founders-group">
              <div className="founder-silhouette f-left">
                <span className="founder-label">Danish Jamil</span>
                <span className="founder-tag-sm">Chief AI Scientist</span>
              </div>
              <div className="founder-silhouette f-center">
                <span className="founder-label">Manoj Shinde</span>
                <span className="founder-tag-sm">Co-Founder & CEO</span>
              </div>
              <div className="founder-silhouette f-right">
                <span className="founder-label">Abhit Sinha</span>
                <span className="founder-tag-sm">VP Engineering</span>
              </div>
            </div>

            <div className="st-bgpt-logo">
              <span className="bgpt-icon-sym">✨</span>
              <span className="bgpt-text">BeautyGPT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Shark Tank India Strip */}
      <div className="st-bottom-ribbon">
        <div className="st-ribbon-content">
          <span className="st-seen">AS SEEN ON</span>
          <span className="st-highlight">SHARK TANK INDIA</span>
          <span className="st-season-pill">SEASON 3</span>
        </div>
      </div>
    </div>
  );
}
