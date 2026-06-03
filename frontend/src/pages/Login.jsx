import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NeuralBackground from '../components/NeuralBackground';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Access Denied. Synaptic handshake failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-centered-wrapper" style={{ minHeight: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      <NeuralBackground />
      <div className="hologram-grid-overlay" />

      <div className="auth-card glass-card" style={{ position: 'relative', zIndex: 10 }}>
        <div className="auth-header">
          <div className="auth-logo-sub">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" fill="none" stroke="#00f0ff" strokeWidth="4" />
              <circle cx="50" cy="50" r="10" fill="#7000ff" />
            </svg>
          </div>
          <h3>SECURE ACCESS</h3>
          <p>ESTABLISHING OPERATOR INTERFACE</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255, 0, 123, 0.1)',
            border: '1px solid var(--neon-pink)',
            color: 'var(--neon-pink)',
            padding: '10px',
            borderRadius: '4px',
            fontSize: '11px',
            textAlign: 'center',
            marginBottom: '15px',
            fontFamily: 'var(--font-header)',
            letterSpacing: '1px'
          }}>
            ERROR // {error.toUpperCase()}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '10px', fontFamily: 'var(--font-header)', color: 'var(--neon-blue)', letterSpacing: '1px' }}>
              OPERATOR EMAIL
            </label>
            <input
              type="email"
              placeholder="operator@nexus.net"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(0, 240, 255, 0.2)',
                borderRadius: '4px',
                padding: '12px 16px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--neon-blue)';
                e.target.style.boxShadow = '0 0 10px rgba(0, 240, 255, 0.25)';
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(0, 240, 255, 0.2)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '10px', fontFamily: 'var(--font-header)', color: 'var(--neon-blue)', letterSpacing: '1px' }}>
              SYNAPTIC KEY (PASSWORD)
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(0, 240, 255, 0.2)',
                borderRadius: '4px',
                padding: '12px 16px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--neon-blue)';
                e.target.style.boxShadow = '0 0 10px rgba(0, 240, 255, 0.25)';
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(0, 240, 255, 0.2)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
            />
          </div>

          <button
            type="submit"
            className="cyber-btn primary full-width"
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            {loading ? 'SYNAPSE AUTHORIZING...' : 'AUTHORIZE SESSION'} <span className="btn-glow" />
          </button>
        </form>

        <div className="auth-links-row">
          <Link to="/forgot-password" className="auth-link">FORGOT KEY?</Link>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <Link to="/register" className="auth-link">CREATE OPERATOR LINK</Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          <Link to="/home" style={{ fontSize: '10px', color: 'var(--text-muted)', textDecoration: 'none', letterSpacing: '1px', fontFamily: 'var(--font-header)' }}>
            ← RETURN TO NET CORE
          </Link>
        </div>
      </div>
    </div>
  );
}
