import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: '2rem',
          textAlign: 'center', fontFamily: 'inherit',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#09121D' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', maxWidth: 400, lineHeight: 1.6 }}>
            An unexpected error occurred. Please refresh the page or try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#ff3366', color: '#fff', border: 'none', borderRadius: '999px',
              padding: '0.75rem 2rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem',
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
