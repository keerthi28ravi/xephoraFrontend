import React, { useState } from 'react';
import { playSound } from '../services/sound';

export default function PremiumPlans() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [ccNumber, setCcNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [upgrading, setUpgrading] = useState(false);
  const [upgraded, setUpgraded] = useState(false);

  const plans = [
    { name: 'BASIC SUBNET ACCESS', price: '$0', desc: 'Standard calibration access to Memory Simon and Decryption games.', perks: ['Simon says 2x2 board', 'Logic decryption baseline', 'Global leaderboard index'], color: 'var(--text-muted)' },
    { name: 'OPERATOR UPGRADE', price: '$9/mo', desc: 'Accelerated cognitive training features and premium telemetry metrics.', perks: ['Simon says 3x3 board unlocked', 'Unlimited Advisor hints', 'Detailed Skill Radar heatmaps', 'Access to global brackets'], color: 'var(--neon-blue)' },
    { name: 'SYNAPSE NEXUS CORE', price: '$29/mo', desc: 'Total mainframe priority, priority matchmaking nodes, and infinite custom campaigns.', perks: ['All Operator perks included', 'Infinite Campaign allocations', 'Priority competitive brackets matchmaking', 'Exclusive Neon Avatar styling'], color: 'var(--neon-pink)' }
  ];

  const handleOpenUpgrade = (planName) => {
    playSound('click');
    setSelectedPlan(planName);
    setModalOpen(true);
    setUpgraded(false);
  };

  const handleClose = () => {
    playSound('click');
    setModalOpen(false);
    setCcNumber('');
    setCvv('');
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    playSound('click');
    setUpgrading(true);

    setTimeout(() => {
      setUpgrading(false);
      setUpgraded(true);
      playSound('win');
    }, 2000);
  };

  return (
    <div className="nexus-screen">
      <div className="section-header-block">
        <h2 className="neon-title">PREMIUM UPGRADES</h2>
        <div className="section-subtitle">Enhance synaptic bandwidth and unlock unlimited strategically tuned modules</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px' }}>
        {plans.map((p, idx) => (
          <div 
            key={idx}
            className="glass-card"
            style={{ 
              padding: '30px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              borderTop: `3px solid ${p.color}`
            }}
          >
            <div>
              <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '15px', color: '#fff', letterSpacing: '1px', marginBottom: '10px' }}>
                {p.name}
              </h3>
              <div style={{ fontFamily: 'var(--font-header)', fontSize: '32px', color: p.color || '#fff', fontWeight: 800, marginBottom: '15px' }}>
                {p.price}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '20px' }}>
                {p.desc}
              </p>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
                {p.perks.map((perk, i) => (
                  <li key={i} style={{ fontSize: '11px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: p.color || 'var(--neon-blue)', fontWeight: 'bold' }}>✓</span>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>

            <button 
              className="cyber-btn primary full-width font-header"
              disabled={p.price === '$0'}
              onClick={() => handleOpenUpgrade(p.name)}
              style={{ background: p.price === '$0' ? 'rgba(255,255,255,0.02)' : '' }}
            >
              {p.price === '$0' ? 'ACTIVE FREE TIER' : 'UPGRADE ADAPTER'} <span className="btn-glow" />
            </button>
          </div>
        ))}
      </div>

      {/* Interactive Checkout Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.85)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div className="glass-card auth-card" style={{ maxWidth: '440px', padding: '30px', position: 'relative' }}>
            <button 
              onClick={handleClose} 
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer' }}
            >
              ✕
            </button>

            <div className="auth-header">
              <div className="auth-logo-sub">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" fill="none" stroke="var(--neon-pink)" strokeWidth="4" />
                  <rect x="30" y="40" width="40" height="25" rx="2" fill="none" stroke="var(--neon-blue)" strokeWidth="3" />
                </svg>
              </div>
              <h3>TRANSACTION PROTOCOL</h3>
              <p>PROFILING UPGRADE FOR: {selectedPlan}</p>
            </div>

            {upgraded ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '10px' }}>⚡</span>
                <h4 style={{ fontFamily: 'var(--font-header)', color: 'var(--neon-green)', marginBottom: '8px' }}>
                  ADAPTER UPGRADED SUCCESSFUL!
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Synaptic bandwidth expanded. Mainframe priority fully synchronized.
                </p>
                <button className="cyber-btn primary full-width" onClick={handleClose}>
                  ENTER THE NEXUS
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="auth-form">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '10px', fontFamily: 'var(--font-header)', color: 'var(--neon-blue)', letterSpacing: '1px' }}>
                    MOCK CREDIT CARD NUMBER
                  </label>
                  <input
                    type="text"
                    placeholder="4000 1234 5678 9010"
                    maxLength="19"
                    value={ccNumber}
                    onChange={(e) => setCcNumber(e.target.value)}
                    required
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(0, 240, 255, 0.2)',
                      borderRadius: '4px',
                      padding: '12px 16px',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '10px', fontFamily: 'var(--font-header)', color: 'var(--neon-blue)', letterSpacing: '1px' }}>
                      EXPIRY DATE
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(0, 240, 255, 0.2)',
                        borderRadius: '4px',
                        padding: '12px 16px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div style={{ width: '100px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '10px', fontFamily: 'var(--font-header)', color: 'var(--neon-blue)', letterSpacing: '1px' }}>
                      CVV LOCK
                    </label>
                    <input
                      type="text"
                      placeholder="•••"
                      maxLength="3"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(0, 240, 255, 0.2)',
                        borderRadius: '4px',
                        padding: '12px 16px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="cyber-btn primary full-width"
                  disabled={upgrading}
                  style={{ marginTop: '10px' }}
                >
                  {upgrading ? 'TRANSMITTING CREDITS...' : 'EXECUTE UPGRADE ADAPTER'} <span className="btn-glow" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
