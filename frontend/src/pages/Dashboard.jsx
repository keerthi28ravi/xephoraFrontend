import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Calculate XP Percentage towards Level Up (assuming 10,000 XP per level)
  const xpRequired = 10000;
  const currentXp = user?.xp || 0;
  const xpPercentage = Math.min(Math.round((currentXp % xpRequired) / xpRequired * 100), 100);

  const dailyObjectives = [
    { id: 1, desc: 'Calibrate Memory Simon Core to Sequence Level 6', status: 'pending', reward: '500 XP' },
    { id: 2, desc: 'Crack 4-digit logic encryption code in Logic Arena', status: 'pending', reward: '800 XP' },
    { id: 3, desc: 'Solve 15-puzzle grid in Number Rush', status: 'pending', reward: '1000 XP' }
  ];

  return (
    <div className="nexus-screen">
      {/* Welcome Block */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-header)', fontSize: '28px', color: '#fff', letterSpacing: '2px' }}>
            OPERATOR COMMAND CENTRAL
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
            Welcome back, <strong style={{ color: 'var(--neon-blue)' }}>{user?.username?.toUpperCase() || 'OPERATOR'}</strong>. Synaptic interface stable.
          </p>
        </div>
        <div style={{
          padding: '8px 16px',
          background: 'rgba(112, 0, 255, 0.1)',
          border: '1px solid var(--neon-violet)',
          borderRadius: '4px',
          fontFamily: 'var(--font-header)',
          fontSize: '11px',
          color: 'var(--neon-blue)',
          letterSpacing: '1px'
        }}>
          NODE: GLOBAL_MATRIX_S4
        </div>
      </div>

      {/* Level and XP Telemetry */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-header)' }}>SYNAPTIC CLASSIFICATION:</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--neon-blue)', fontFamily: 'var(--font-header)' }}>
              LEVEL {user?.level || 1}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-header)' }}>
            XP: {currentXp % xpRequired} / {xpRequired} ({xpPercentage}%)
          </div>
        </div>
        <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
          <div 
            style={{ 
              height: '100%', 
              width: `${xpPercentage}%`, 
              background: 'linear-gradient(90deg, var(--neon-violet), var(--neon-blue))',
              boxShadow: '0 0 8px var(--neon-blue)',
              transition: 'width 0.5s ease-in-out'
            }} 
          />
        </div>
      </div>

      {/* Grid of Key Telemetry */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div className="glass-card inner-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-header)', letterSpacing: '1px', marginBottom: '8px' }}>
            SYNAPTIC RATING
          </div>
          <div style={{ fontSize: '28px', fontFamily: 'var(--font-header)', fontWeight: 800, color: '#fff', textShadow: '0 0 10px rgba(0, 240, 255, 0.2)' }}>
            {user?.score || 0}
          </div>
        </div>
        <div className="glass-card inner-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-header)', letterSpacing: '1px', marginBottom: '8px' }}>
            OPERATIONAL ACCURACY
          </div>
          <div style={{ fontSize: '28px', fontFamily: 'var(--font-header)', fontWeight: 800, color: 'var(--neon-green)', textShadow: '0 0 10px rgba(57, 255, 20, 0.2)' }}>
            {user?.accuracy || 0}%
          </div>
        </div>
        <div className="glass-card inner-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-header)', letterSpacing: '1px', marginBottom: '8px' }}>
            DECRYPTIONS COMPLETIONS
          </div>
          <div style={{ fontSize: '28px', fontFamily: 'var(--font-header)', fontWeight: 800, color: 'var(--neon-pink)', textShadow: '0 0 10px rgba(255, 0, 123, 0.2)' }}>
            {user?.solvedCount || 0}
          </div>
        </div>
      </div>

      {/* Gaming Arenas Rapid Launch */}
      <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '16px', letterSpacing: '2px', color: '#fff', marginBottom: '15px' }}>
        ACTIVE COGNITIVE ARENAS
      </h3>
      <div className="modes-hub-grid" style={{ marginBottom: '30px' }}>
        {/* Simon Says card */}
        <div className="glass-card mode-card" onClick={() => navigate('/app/memory')}>
          <div className="mode-card-badge">RETENTION TELEMETRY</div>
          <h4>Memory Nexus</h4>
          <p>Test auditory-visual pattern recall speed. Replicate expanding high-frequency neon node sequences.</p>
          <div className="mode-card-footer">
            <span className="mode-stat">XP REWARD // HIGH</span>
            <span className="mode-action-link">LAUNCH CORES →</span>
          </div>
        </div>

        {/* Decryption card */}
        <div className="glass-card mode-card" onClick={() => navigate('/app/logic')}>
          <div className="mode-card-badge text-neon-pink">CRYPTOGRAPHIC NODES</div>
          <h4>Logic Arena</h4>
          <p>Decrypt 4-digit code sequences based on bulls and cows strategic feedback. Refine reasoning.</p>
          <div className="mode-card-footer">
            <span className="mode-stat">XP REWARD // CRITICAL</span>
            <span className="mode-action-link">LAUNCH DECODERS →</span>
          </div>
        </div>

        {/* Sliding Puzzle card */}
        <div className="glass-card mode-card" onClick={() => navigate('/app/number-rush')}>
          <div className="mode-card-badge" style={{ color: 'var(--neon-violet)' }}>COGNITIVE COORDINATION</div>
          <h4>Number Rush</h4>
          <p>Slide active numerical memory block components back into correct sequencing patterns against time.</p>
          <div className="mode-card-footer">
            <span className="mode-stat">XP REWARD // MAXIMUM</span>
            <span className="mode-action-link">LAUNCH SYSTEM →</span>
          </div>
        </div>
      </div>

      {/* Split layout: Daily objectives and recent badges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
        {/* Objectives */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '15px', color: '#fff', letterSpacing: '1.5px', marginBottom: '15px' }}>
            DAILY SYNAPTIC CHALLENGES
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {dailyObjectives.map(obj => (
              <div key={obj.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '6px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--neon-blue)', fontSize: '14px' }}>⬡</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{obj.desc}</span>
                </div>
                <span style={{ 
                  fontFamily: 'var(--font-header)', 
                  fontSize: '9px', 
                  color: 'var(--neon-green)',
                  background: 'rgba(57, 255, 20, 0.08)',
                  padding: '4px 8px',
                  borderRadius: '3px'
                }}>
                  +{obj.reward}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Badges preview */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '15px', color: '#fff', letterSpacing: '1.5px', marginBottom: '15px' }}>
            SECURED OPERATOR BADGES
          </h3>
          {user?.unlockedBadges && user.unlockedBadges.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
              {user.unlockedBadges.map((badge, idx) => (
                <div key={idx} style={{
                  padding: '8px 12px',
                  background: 'linear-gradient(135deg, rgba(112, 0, 255, 0.15), rgba(0, 240, 255, 0.05))',
                  border: '1px solid var(--neon-blue)',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-header)',
                  fontSize: '10px',
                  color: '#fff',
                  boxShadow: '0 0 6px rgba(0, 240, 255, 0.15)'
                }}>
                  🎖️ {badge.toUpperCase()}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '10px' }}>🔒</span>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-header)', letterSpacing: '1px' }}>
                COMPLETE ARENA MISSIONS TO DEPLOY SECURITY BADGES
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
