import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function SkillAnalytics() {
  const { user } = useAuth();

  const skills = [
    { name: 'AUDITORY-VISUAL SEQUENCING', value: user?.unlockedBadges?.includes('memory-master') ? '92%' : '60%', desc: 'Retaining and sequencing illumination nodes under time triggers.' },
    { name: 'CRYPTOGRAPHIC REASONING', value: user?.unlockedBadges?.includes('logic-decrypter') ? '95%' : '70%', desc: 'Logical deductive cracking based on structural pass code diagnostics.' },
    { name: 'SPATIAL COORDINATION RUSH', value: user?.unlockedBadges?.includes('number-speedrun') ? '90%' : '55%', desc: 'Coordinate pathing sliding block arrangements under time velocity constraints.' }
  ];

  return (
    <div className="nexus-screen">
      <div className="section-header-block">
        <h2 className="neon-title">SYNAPTIC SKILL ANALYTICS</h2>
        <div className="section-subtitle">Real-time cognitive diagnostics & telemetry profiling</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
        {/* Left Side: Skill Bars */}
        <div className="glass-card" style={{ padding: '30px' }}>
          <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '18px', color: '#fff', marginBottom: '25px', letterSpacing: '1px' }}>
            COGNITIVE SPECTRUM PROFILES
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {skills.map((skill, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{skill.name}</span>
                  <span style={{ fontFamily: 'var(--font-header)', fontSize: '13px', color: 'var(--neon-blue)', fontWeight: 'bold' }}>
                    {skill.value}
                  </span>
                </div>
                <div className="param-track" style={{ height: '8px', marginBottom: '8px' }}>
                  <div className="param-fill" style={{ width: skill.value, background: 'linear-gradient(90deg, var(--neon-violet), var(--neon-blue))' }} />
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{skill.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Skill Radar Schematics */}
        <div className="glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '14px', color: '#fff', letterSpacing: '1px', marginBottom: '15px' }}>
              TELEMETRY COHERENCE MATRIX
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Your operational accuracy index is currently calibrated at <strong style={{ color: 'var(--neon-green)' }}>{user?.accuracy || 0}%</strong>. 
              The target standard is 95% coherence for top-tier competitive subnets. 
              Unlock more tactical achievements to expand dynamic bandwidth.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            {/* Holographic analysis wireframe SVG */}
            <svg width="120" height="120" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <polygon points="50,10 85,35 85,75 50,95 15,75 15,35" fill="none" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" />
              <polygon points="50,25 75,42 75,68 50,82 25,68 25,42" fill="none" stroke="rgba(112, 0, 255, 0.2)" strokeWidth="1" />
              {/* Dynamic filled skill shape based on current accuracy */}
              <polygon 
                points={`50,${20 + (100 - (user?.accuracy || 50)) * 0.3} ${70 + (user?.accuracy || 50) * 0.15},45 ${70 + (user?.accuracy || 50) * 0.15},70 50,${80 - (user?.accuracy || 50) * 0.1} ${30 - (user?.accuracy || 50) * 0.1},70 ${30 - (user?.accuracy || 50) * 0.1},45`} 
                fill="rgba(0, 240, 255, 0.15)" 
                stroke="var(--neon-blue)" 
                strokeWidth="1.5" 
              />
              <circle cx="50" cy="50" r="2" fill="#fff" />
            </svg>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '14px',
            borderRadius: '6px',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            textAlign: 'center'
          }}>
            RECOMMENDATION: Accelerate logical deductions inside the Decryption Cores to resolve offset vectors.
          </div>
        </div>
      </div>
    </div>
  );
}
