import React, { useState } from 'react';

export default function StrategyZone() {
  const [selectedMission, setSelectedMission] = useState(0);

  const missions = [
    {
      id: 0,
      title: 'SYNAPSE RECOVERY CORES',
      badge: 'CAMPAIGN // NODE A-01',
      desc: 'Inject raw audio-visual sequencing into the memory core. Rectify sequence nodes up to level 6.',
      xp: '+600 XP',
      status: 'active',
      specs: 'TIME LIMIT: NONE // DIFFICULTY: NORMAL',
      bars: [
        { label: 'RETENTION INTENSITY', val: '75%' },
        { label: 'COORDINATION LOAD', val: '20%' },
        { label: 'DEDUCTIVE COEFFICIENT', val: '40%' }
      ]
    },
    {
      id: 1,
      title: 'LOGICAL ENCRYPTION BREAKOUT',
      badge: 'CAMPAIGN // NODE B-09',
      desc: 'Crack secure 4-digit logic encryption keys in less than 5 decryption attempts.',
      xp: '+1200 XP',
      status: 'active',
      specs: 'TIME LIMIT: 5 MIN // DIFFICULTY: HARD',
      bars: [
        { label: 'RETENTION INTENSITY', val: '30%' },
        { label: 'COORDINATION LOAD', val: '45%' },
        { label: 'DEDUCTIVE COEFFICIENT', val: '95%' }
      ]
    },
    {
      id: 2,
      title: 'TACTICAL MESH DEPLOYMENT',
      badge: 'CAMPAIGN // NODE C-12',
      desc: 'Solve spatial block arrangements in Number Rush in less than 30 seconds.',
      xp: '+1500 XP',
      status: 'locked',
      specs: 'TIME LIMIT: 30 SEC // DIFFICULTY: MAXIMUM',
      bars: [
        { label: 'RETENTION INTENSITY', val: '50%' },
        { label: 'COORDINATION LOAD', val: '95%' },
        { label: 'DEDUCTIVE COEFFICIENT', val: '30%' }
      ]
    }
  ];

  const current = missions[selectedMission];

  return (
    <div className="nexus-screen">
      <div className="section-header-block">
        <h2 className="neon-title">TACTICAL STRATEGY ZONE</h2>
        <div className="section-subtitle">Synaptic Campaign Calibration Cradles</div>
      </div>

      <div className="strategy-arena-layout">
        {/* Left: Mission list deck */}
        <div className="missions-deck">
          {missions.map((m, idx) => (
            <div 
              key={m.id}
              className={`glass-card mission-card ${selectedMission === idx ? 'active' : ''}`}
              onClick={() => setSelectedMission(idx)}
            >
              <div className="mission-header">
                <span className={`mission-status ${m.status}`}>
                  {m.status.toUpperCase()}
                </span>
                <span className="mission-xp">{m.xp}</span>
              </div>
              <h4>{m.title}</h4>
              <p>{m.desc}</p>
              <div className="mission-specs">{m.specs}</div>
            </div>
          ))}
        </div>

        {/* Right: Mission preview hologram details */}
        <div className="glass-card mission-preview-details">
          <div className="preview-hologram-wrapper">
            {/* Spinning tactical mesh visual SVG */}
            <svg className="tactical-mesh-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--neon-blue)" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="50" cy="50" r="25" fill="none" stroke="var(--neon-violet)" strokeWidth="1.5" />
              <polygon points="50,15 80,68 20,68" fill="none" stroke="var(--neon-pink)" strokeWidth="1.5" />
              <line x1="50" y1="15" x2="50" y2="50" stroke="rgba(255, 0, 123, 0.4)" strokeWidth="1" />
              <line x1="80" y1="68" x2="50" y2="50" stroke="rgba(255, 0, 123, 0.4)" strokeWidth="1" />
              <line x1="20" y1="68" x2="50" y2="50" stroke="rgba(255, 0, 123, 0.4)" strokeWidth="1" />
              {/* Spinning core node dots */}
              <circle cx="50" cy="50" r="4" fill="var(--neon-blue)" />
              <circle cx="50" cy="15" r="3" fill="#fff" />
              <circle cx="80" cy="68" r="3" fill="#fff" />
              <circle cx="20" cy="68" r="3" fill="#fff" />
            </svg>
          </div>

          <div className="preview-specs-info">
            <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {current.badge}
            </h3>
            <h2 style={{ fontFamily: 'var(--font-header)', fontSize: '20px', color: '#fff', marginBottom: '15px' }}>
              {current.title}
            </h2>

            <div className="param-bars">
              {current.bars.map((bar, i) => (
                <div key={i}>
                  <div className="param-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{bar.label}</span>
                    <span style={{ color: 'var(--neon-blue)' }}>{bar.val}</span>
                  </div>
                  <div className="param-track">
                    <div className="param-fill" style={{ width: bar.val }} />
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="cyber-btn primary full-width"
              disabled={current.status === 'locked'}
              onClick={() => alert(`Launching campaign sequence: ${current.title}`)}
            >
              {current.status === 'locked' ? 'CAMPAIGN LOCKED' : 'DECOUPLE STRATEGIC MESH'} <span className="btn-glow" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
