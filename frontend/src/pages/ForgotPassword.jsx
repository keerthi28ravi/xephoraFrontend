import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import NeuralBackground from '../components/NeuralBackground';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await authAPI.forgotPassword(email);
      setMessage('Password recovery protocol generated. Access key OTP transmitted.');
      
      // Auto transition to OTP verification screen after 1.5 seconds
      setTimeout(() => {
        navigate('/verify-otp', { state: { email } });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Access request rejected. Operational failure.');
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
              <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" fill="none" stroke="#7000ff" strokeWidth="4" />
              <line x1="50" y1="35" x2="50" y2="60" stroke="#7000ff" strokeWidth="6" strokeLinecap="round" />
              <circle cx="50" cy="72" r="5" fill="#7000ff" />
            </svg>
          </div>
          <h3>RECOVERY MODULE</h3>
          <p>REQUEST ACCESS DECRYPT CODE</p>
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

        {message && (
          <div style={{
            background: 'rgba(0, 240, 255, 0.1)',
            border: '1px solid var(--neon-blue)',
            color: 'var(--neon-blue)',
            padding: '10px',
            borderRadius: '4px',
            fontSize: '11px',
            textAlign: 'center',
            marginBottom: '15px',
            fontFamily: 'var(--font-header)',
            letterSpacing: '1px'
          }}>
            SUCCESS // {message.toUpperCase()}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '10px', fontFamily: 'var(--font-header)', color: 'var(--neon-blue)', letterSpacing: '1px' }}>
              REGISTERED OPERATOR EMAIL
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

          <button
            type="submit"
            className="cyber-btn primary full-width"
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            {loading ? 'GENERATING PROTOCOL...' : 'TRANSMIT DECRYPT CODE'} <span className="btn-glow" />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          <Link to="/login" style={{ fontSize: '10px', color: 'var(--text-muted)', textDecoration: 'none', letterSpacing: '1px', fontFamily: 'var(--font-header)' }}>
            ← BACK TO SECURE ACCESS
          </Link>
        </div>
      </div>
    </div>
  );
}
