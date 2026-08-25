import React, { useState } from 'react';
import './InteractiveBeautyCanvas.css';

export default function InteractiveBeautyCanvas({ defaultCategory = 'makeup' }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [lipstickColor, setLipstickColor] = useState('#BA0C2F');
  const [finish, setFinish] = useState('Matte');
  const [activeTab, setActiveTab] = useState(defaultCategory); // 'makeup' | 'skin' | 'shade'
  const [scanActive, setScanActive] = useState(false);

  const shades = [
    { name: 'Ruby Woo', hex: '#BA0C2F' },
    { name: 'Velvet Plum', hex: '#6B1D2F' },
    { name: 'Pillow Talk Nude', hex: '#C2837D' },
    { name: 'Coral Pop', hex: '#E25B5B' },
    { name: 'Deep Burgundy', hex: '#4A121A' },
    { name: 'Rose Petal', hex: '#D66D75' }
  ];

  const handleDrag = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <div className="beauty-canvas-container">
      {/* Top Controls Bar */}
      <div className="canvas-top-bar">
        <div className="canvas-tabs">
          <button 
            className={`c-tab-btn ${activeTab === 'makeup' ? 'c-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('makeup')}
          >
            💄 Virtual Makeup AR
          </button>
          <button 
            className={`c-tab-btn ${activeTab === 'skin' ? 'c-tab-btn--active' : ''}`}
            onClick={() => { setActiveTab('skin'); setScanActive(true); }}
          >
            🔬 Clinical Skin HUD
          </button>
          <button 
            className={`c-tab-btn ${activeTab === 'shade' ? 'c-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('shade')}
          >
            🎨 Shade & Undertone
          </button>
        </div>

        <div className="canvas-fps-badge">
          <span className="live-pulse-dot"></span> 60 FPS • On-Device Engine
        </div>
      </div>

      {/* Main Interactive Viewport */}
      <div 
        className="canvas-viewport" 
        onMouseMove={(e) => e.buttons === 1 && handleDrag(e)}
        onClick={handleDrag}
      >
        {/* Before Layer (Natural Skin) */}
        <div className="layer layer-before">
          <div className="portrait-visual natural-look">
            <div className="face-oval natural-skin">
              <div className="natural-eyes"></div>
              <div className="natural-lips"></div>
            </div>
            <span className="layer-label label-before">BEFORE (ORIGINAL)</span>
          </div>
        </div>

        {/* After Layer (AR Applied with clip-path) */}
        <div 
          className="layer layer-after"
          style={{ clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` }}
        >
          <div className="portrait-visual ar-glam-look">
            <div className="face-oval ar-skin">
              {/* Scan HUD Overlay */}
              {activeTab === 'skin' && (
                <div className="skin-scanner-hud">
                  <div className="hud-laser-line"></div>
                  <div className="hud-metric-pill m-1">Hydration: 88% Optimal</div>
                  <div className="hud-metric-pill m-2">Texture: Grade A+</div>
                  <div className="hud-metric-pill m-3">Melanin: Class 04</div>
                  <div className="landmark-grid-mesh"></div>
                </div>
              )}

              {/* Virtual Makeup Features */}
              {activeTab === 'makeup' && (
                <>
                  <div className="ar-eyeshadow-glam"></div>
                  <div className="ar-eyeliner-wing"></div>
                  <div className="ar-blush-flush"></div>
                  <div 
                    className="ar-lips-applied"
                    style={{ 
                      backgroundColor: lipstickColor,
                      boxShadow: finish === 'Gloss' ? '0 0 16px rgba(255,255,255,0.9)' : 'none'
                    }}
                  ></div>
                </>
              )}

              {/* Foundation Shade Swatches */}
              {activeTab === 'shade' && (
                <div className="shade-matching-hud">
                  <div className="shade-target-box">
                    <span>99.4% Match</span>
                    <strong>Warm Beige 220</strong>
                  </div>
                </div>
              )}
            </div>
            <span className="layer-label label-after">AFTER (ORBO AI AR)</span>
          </div>
        </div>

        {/* Draggable Divider Line & Handle */}
        <div className="slider-divider" style={{ left: `${sliderPos}%` }}>
          <div className="divider-handle">
            <span>◀ ▶</span>
          </div>
        </div>
      </div>

      {/* Bottom Palette & Shaders Bar */}
      <div className="canvas-bottom-controls">
        {activeTab === 'makeup' && (
          <div className="makeup-controls-row">
            <div className="shades-inline">
              <span className="ctrl-label">Lipstick Shade:</span>
              <div className="palette-dots">
                {shades.map((s) => (
                  <button
                    key={s.name}
                    className={`p-dot-btn ${lipstickColor === s.hex ? 'p-dot-btn--active' : ''}`}
                    style={{ backgroundColor: s.hex }}
                    onClick={() => setLipstickColor(s.hex)}
                    title={s.name}
                  />
                ))}
              </div>
            </div>

            <div className="finishes-inline">
              <span className="ctrl-label">Texture Finish:</span>
              <div className="finish-pills">
                {['Matte', 'Satin', 'Gloss', 'Glitter Shimmer'].map((f) => (
                  <button
                    key={f}
                    className={`fin-btn ${finish === f ? 'fin-btn--active' : ''}`}
                    onClick={() => setFinish(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skin' && (
          <div className="skin-metrics-row">
            <div className="metric-chip">💧 Hydration: <strong>88%</strong></div>
            <div className="metric-chip">✨ Glow Index: <strong>92%</strong></div>
            <div className="metric-chip">🛡️ Barrier Health: <strong>Optimal</strong></div>
            <div className="metric-chip">🔬 Pores: <strong>Minimized</strong></div>
          </div>
        )}

        {activeTab === 'shade' && (
          <div className="shade-info-row">
            <span>Detected Undertone: <strong>Warm Golden</strong></span>
            <span>•</span>
            <span>Melanin Index: <strong>Medium 04</strong></span>
            <span>•</span>
            <span className="rec-sku">Recommended: <strong>Fenty 220 / MAC NC25</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}
