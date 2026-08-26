import React, { useState } from 'react';
import './InteractiveBeautyCanvas.css';

export default function InteractiveBeautyCanvas({ defaultCategory = 'makeup' }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [lipstickColor, setLipstickColor] = useState('#BA0C2F');
  const [finish, setFinish] = useState('Matte');
  const [activeTab, setActiveTab] = useState(defaultCategory); // 'makeup' | 'skin' | 'shade'

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
            onClick={() => setActiveTab('skin')}
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
          <span className="live-pulse-dot"></span> 60 FPS • On-Device Neural Vision
        </div>
      </div>

      {/* Main Interactive Viewport */}
      <div 
        className="canvas-viewport" 
        onMouseMove={(e) => e.buttons === 1 && handleDrag(e)}
        onClick={handleDrag}
      >
        {/* Before Layer (Natural Skin Real Photo) */}
        <div className="layer layer-before">
          <div className="portrait-visual">
            <img 
              src={
                activeTab === 'skin'
                  ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop&q=80'
                  : activeTab === 'shade'
                  ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=600&fit=crop&q=80'
                  : 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&h=600&fit=crop&q=80'
              } 
              alt="Natural Baseline Skin" 
              className="canvas-real-photo photo-before"
            />
            <span className="layer-label label-before">BEFORE (NATURAL)</span>
          </div>
        </div>

        {/* After Layer (AR Applied Real Photo with clip-path) */}
        <div 
          className="layer layer-after"
          style={{ clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` }}
        >
          <div className="portrait-visual">
            <img 
              src={
                activeTab === 'skin'
                  ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop&q=80'
                  : activeTab === 'shade'
                  ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=600&fit=crop&q=80'
                  : 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop&q=80'
              } 
              alt="Orbo AI AR Transformed Look" 
              className="canvas-real-photo photo-after"
            />

            {/* Virtual Makeup Dynamic Color Tint Overlay */}
            {activeTab === 'makeup' && (
              <div 
                className="ar-live-tint-filter"
                style={{
                  background: `radial-gradient(ellipse at 50% 65%, ${lipstickColor}44 0%, ${lipstickColor}22 30%, transparent 60%)`,
                  filter: finish === 'Gloss' ? 'contrast(1.2) brightness(1.1)' : 'none'
                }}
              >
                <div className="ar-active-shade-tag" style={{ backgroundColor: lipstickColor }}>
                  {shades.find(s => s.hex === lipstickColor)?.name || 'Custom Shade'} • {finish}
                </div>
              </div>
            )}

            {/* Skin Scanner HUD Overlay on Real Photo */}
            {activeTab === 'skin' && (
              <div className="skin-scanner-photo-hud">
                <div className="hud-laser-line"></div>
                <div className="hud-mesh-overlay"></div>
                <div className="hud-metric-pill m-1">💧 Hydration: 88% Optimal</div>
                <div className="hud-metric-pill m-2">✨ Texture: Grade A+</div>
                <div className="hud-metric-pill m-3">🛡️ Barrier: 94% Strong</div>
                <div className="hud-metric-pill m-4">☀️ Melanin: Class 04</div>
              </div>
            )}

            {/* Foundation Shade Swatches on Real Photo */}
            {activeTab === 'shade' && (
              <div className="shade-matching-photo-hud">
                <div className="shade-target-card">
                  <span className="shade-match-percent">99.4% Match</span>
                  <strong>Warm Beige 220</strong>
                  <span className="undertone-txt">Warm Golden Undertone</span>
                </div>
                <div className="shade-swatch-pins">
                  <span className="swatch-pin pin-1" style={{ background: '#F3D9C3' }}>#140</span>
                  <span className="swatch-pin pin-2 pin--best" style={{ background: '#EAC8B1' }}>✓ #220</span>
                  <span className="swatch-pin pin-3" style={{ background: '#DEB896' }}>#260</span>
                </div>
              </div>
            )}

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
                {['Matte', 'Satin', 'Gloss', 'Velvet'].map((f) => (
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
            <div className="metric-chip">🔬 Pores: <strong>Minimized (Grade A)</strong></div>
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
