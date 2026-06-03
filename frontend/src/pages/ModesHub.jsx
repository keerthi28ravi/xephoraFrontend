import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ModesHub() {
  const navigate = useNavigate();

  const modes = [
    {
      badge: 'RETENTION MATRIX',
      title: 'Memory Nexus',
      desc: 'Test acoustic-visual memory recall sequence. Replicate sequential illumination of node grid pathways.',
      reward: 'XP REWARD // NORMAL',
      link: '/app/memory',
      color: 'var(--neon-blue)'
    },
    {
      badge: 'CRYPTOGRAPHIC NODES',
      title: 'Logic Arena',
      desc: 'Decrypt four-digit uniquely randomized security keys based on HIT/NEAR system feedback.',
      reward: 'XP REWARD // CRITICAL',
      link: '/app/logic',
      color: 'var(--neon-pink)',
      badgeClass: 'text-neon-pink'
    },
    {
      badge: 'COORDINATION VELOCITY',
      title: 'Number Rush',
      desc: 'Slide displaced numerical block components back into correct sequential orders against time pressures.',
      reward: 'XP REWARD // MAXIMUM',
      link: '/app/number-rush',
      color: 'var(--neon-violet)'
    },
    {
      badge: 'TACTICAL CRADLE',
      title: 'Strategy Zone',
      desc: 'Launch custom campaigns and calibrate synaptic levels against neural strategic mesh systems.',
      reward: 'XP REWARD // CAMPAIGN',
      link: '/app/strategy',
      color: 'var(--neon-green)'
    },
    {
      badge: 'SUBNET Arena',
      title: 'Multiplayer Hub',
      desc: 'Connect to subnet nodes, create lobby queues, and test decryption speeds against global operators.',
      reward: 'XP REWARD // COMPETITIVE',
      link: '/app/multiplayer',
      color: 'var(--neon-orange)'
    }
  ];

  return (
    <div className="nexus-screen">
      <div className="section-header-block">
        <h2 className="neon-title">GAMING HUB MODULES</h2>
        <div className="section-subtitle">Alist of active operational cognitive training facilities</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
        {modes.map((mode, idx) => (
          <div 
            className="glass-card mode-card" 
            key={idx} 
            onClick={() => navigate(mode.link)}
            style={{ 
              borderLeft: `3px solid ${mode.color}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '270px'
            }}
          >
            <div>
              <div className={`mode-card-badge ${mode.badgeClass || ''}`} style={{ color: mode.color }}>
                {mode.badge}
              </div>
              <h4>{mode.title}</h4>
              <p>{mode.desc}</p>
            </div>
            <div className="mode-card-footer">
              <span className="mode-stat">{mode.reward}</span>
              <span className="mode-action-link" style={{ color: mode.color }}>LAUNCH CORES →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
