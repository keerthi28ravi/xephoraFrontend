import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import NeuralBackground from '../components/NeuralBackground';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Make sure we have the required state parameters, otherwise return to forgot-password
    if (location.state?.email && location.state?.token) {
      setEmail(location.state.email);
      setToken(location.state.token);
    } else {
      setError('Handshake link expired. Please restart password recovery.');
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !token) {
      return setError('Authentication token expired. Please request a new recovery link.');
    }

    if (newPassword !== confirmPassword) {
      return setError('Access keys do not match.');
    }

    setLoading(true);

    try {
      await authAPI.resetPassword(email, newPassword, token);
      setMessage('Access credentials updated. Re-routing to secure login...');
      
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.message || 'Access update failed.');
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
              <path d="M30 50 L45 65 L70 35" fill="none" stroke="#00f0ff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3>RESET KEY</h3>
          <p>ESTABLISH NEW ACCESS PROTOCOLS</p>
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

        {(!location.state?.email || !location.state?.token) ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/forgot-password" className="cyber-btn primary full-width" style={{ textDecoration: 'none' }}>
              RESTART PROTOCOL
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '10px', fontFamily: 'var(--font-header)', color: 'var(--neon-blue)', letterSpacing: '1px' }}>
                NEW SYNAPTIC ACCESS KEY
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                CONFIRM NEW ACCESS KEY
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'RECONFIGURING CREDENTIALS...' : 'COMMIT ACCESS KEY'} <span className="btn-glow" />
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          <Link to="/login" style={{ fontSize: '10px', color: 'var(--text-muted)', textDecoration: 'none', letterSpacing: '1px', fontFamily: 'var(--font-header)' }}>
            ← CANCEL AND LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
}
