import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '80vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '3rem 2rem',
      background: 'linear-gradient(160deg,#fff8f9 0%,#f8f0ff 100%)',
    }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem', lineHeight: 1, fontWeight: 900, background: 'linear-gradient(90deg,#ff3366,#b5a9ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>?</div>
      <h1 style={{
        fontSize: 'clamp(4rem,10vw,8rem)', fontWeight: 900, lineHeight: 1,
        background: 'linear-gradient(90deg,#ff3366,#b5a9ff)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        marginBottom: '0.5rem',
      }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#09121D', marginBottom: '0.75rem' }}>
        Page Not Found
      </h2>
      <p style={{ color: '#6b7280', maxWidth: 400, lineHeight: 1.7, marginBottom: '2rem' }}>
        The page you're looking for doesn't exist or has been moved.
        Head back home and explore our beauty AI solutions.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" style={{
          background: '#ff3366', color: '#fff', borderRadius: '999px',
          padding: '0.8rem 2rem', fontWeight: 700, textDecoration: 'none',
          boxShadow: '0 4px 16px rgba(255,51,102,0.3)',
        }}>
          ← Back to Home
        </Link>
        <Link to="/recommend" style={{
          background: '#fff', color: '#09121D', borderRadius: '999px',
          padding: '0.8rem 2rem', fontWeight: 700, textDecoration: 'none',
          border: '2px solid #09121D',
        }}>
          AI Recommender
        </Link>
      </div>
    </div>
  );
}
