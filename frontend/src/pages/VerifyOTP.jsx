import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import NeuralBackground from '../components/NeuralBackground';

export default function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve email from navigation state or fallback
  const initialEmail = location.state?.email || '';
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authAPI.verifyOTP(email, otp);
      const resetToken = res.data.token; // "otp_authorized_handshake_key_902"
      
      navigate('/reset-password', { 
        state: { 
          email, 
          token: resetToken 
        } 
      });
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.message || 'Verification sequence failed.');
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
              <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" fill="none" stroke="#39ff14" strokeWidth="4" />
              <rect x="35" y="35" width="30" height="30" rx="4" fill="none" stroke="#39ff14" strokeWidth="3" />
              <circle cx="50" cy="50" r="4" fill="#39ff14" />
            </svg>
          </div>
          <h3>OTP HANDSHAKE</h3>
          <p>CONFIRM COGNITIVE VERIFICATION SEQUENCE</p>
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

        {/* Development Helper telemetry */}
        <div style={{
          background: 'rgba(57, 255, 20, 0.05)',
          border: '1px dashed rgba(57, 255, 20, 0.3)',
          color: 'var(--neon-green)',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '10px',
          textAlign: 'center',
          marginBottom: '15px',
          fontFamily: 'var(--font-header)',
          letterSpacing: '1.5px'
        }}>
          TELEMETRY HINT // MOCK OTP: 123456
        </div>

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
              6-DIGIT SECURITY SEQUENCE (OTP)
            </label>
            <input
              type="text"
              placeholder="e.g. 123456"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(0, 240, 255, 0.2)',
                borderRadius: '4px',
                padding: '12px 16px',
                color: '#fff',
                fontSize: '14px',
                letterSpacing: '5px',
                textAlign: 'center',
                fontFamily: 'var(--font-header)',
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
            {loading ? 'COMPLETING HANDSHAKE...' : 'VERIFY SYSTEM SEQUENCE'} <span className="btn-glow" />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          <Link to="/forgot-password" style={{ fontSize: '10px', color: 'var(--text-muted)', textDecoration: 'none', letterSpacing: '1px', fontFamily: 'var(--font-header)' }}>
            ← RESEND DECRYPT CODE
          </Link>
        </div>
      </div>
    </div>
  );
}
