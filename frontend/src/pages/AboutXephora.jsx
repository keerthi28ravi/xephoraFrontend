import React from 'react';

export default function AboutXephora() {
  const benefits = [
    { icon: '🌀', title: 'Neuroplasticity Calibrator', desc: 'Custom sequences designed to strengthen synapse recall speed.', list: ['Sequential pattern nodes', 'Acoustic retention', 'Hologram coordinate locks'] },
    { icon: '📡', title: 'Cryptographic Deductions', desc: 'Decryption algorithms calibrated to elevate reasoning indices.', list: ['Combinatorial testing', 'Logical shift profiling', 'Exclusion tracking models'] },
    { icon: '🛡️', title: 'Spatial Organization Rush', desc: 'Tactical sliding puzzle grids testing motor-coordinate reaction speed.', list: ['Legal state pathing', 'Move constraint records', 'Time vectors pressure'] }
  ];

  return (
    <div className="nexus-screen">
      <div className="section-header-block">
        <h2 className="neon-title">ABOUT XEPHORA CORE</h2>
        <div className="section-subtitle">Cognitive Neural Enhancement Matrix lore & parameters</div>
      </div>

      {/* Intro Flex Box */}
      <div className="about-flex-layout" style={{ marginBottom: '40px' }}>
        <div className="glass-card about-card-left">
          <h3>SYSTEM DESIGN PHILOSOPHY</h3>
          <p>
            Xephora is designed as an advanced Full-Stack Cognitive training platform,
            developed to calibrate logical processing, sensory retention, and tactical spatial reasoning.
            Through continuous telemetry and real-time XP accumulation, the system compiles exhaustive profiles 
            of operator cognitive capacities.
          </p>
          <div className="stat-highlight-row">
            <div className="stat-box">
              <div className="stat-num neon-blue">100%</div>
              <div className="stat-label">SYNAPSE TRACKING</div>
            </div>
            <div className="stat-box">
              <div className="stat-num neon-violet">MOCK</div>
              <div className="stat-label">DATABASE SYNC</div>
            </div>
          </div>
        </div>

        <div className="glass-card about-card-right">
          <h3>SYSTEM SPECIFICATION MATRIX</h3>
          <div className="tech-schematics">
            <div className="schematic-item">
              <div className="tech-icon">🪐</div>
              <div>
                <strong>Cognitive Hub Orchestration</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  A unified platform linking gaming arenas, AI strategists, and multiplayer networks.
                </span>
              </div>
            </div>
            <div className="schematic-item">
              <div className="tech-icon">🧩</div>
              <div>
                <strong>Express & MongoDB Data Vault</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  A secure, high-integrity database storing operator scores, stats, and achievements.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits grid */}
      <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '18px', color: '#fff', letterSpacing: '2px', textAlign: 'center', marginBottom: '20px' }}>
        COGNITIVE INTEGRATION MODULES
      </h3>
      <div className="benefits-grid">
        {benefits.map((b, idx) => (
          <div className="glass-card benefit-card" key={idx}>
            <div className="benefit-icon">{b.icon}</div>
            <h4>{b.title}</h4>
            <p>{b.desc}</p>
            <ul className="benefit-list">
              {b.list.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
