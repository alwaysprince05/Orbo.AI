import React from 'react';

export default function OrboMouseScroll() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '12px 0',
      opacity: 0.5,
    }}>
      <svg width="14" height="20" viewBox="0 0 14 20" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round">
        <rect x="1" y="1" width="12" height="18" rx="6" />
        <line x1="7" y1="5" x2="7" y2="9">
          <animate attributeName="y1" values="5;5;5" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="y2" values="5;9;5" dur="1.5s" repeatCount="indefinite" />
        </line>
      </svg>
      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#999', letterSpacing: '0.05em' }}>
        SCROLL
      </span>
    </div>
  );
}
