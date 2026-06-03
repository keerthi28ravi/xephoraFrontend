import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Achievements() {
  const { user } = useAuth();

  const achievements = [
    {
      id: 'memory-master',
      title: 'Memory Master Badge',
      desc: 'Unlock by calibrating Simon Core pattern recognition to Sequence Level 5 or higher in Memory Nexus.',
      icon: '🧠',
      reward: '500 XP'
    },
    {
      id: 'logic-decrypter',
      title: 'Logic Decrypter Badge',
      desc: 'Unlock by cracking the cryptographic code in less than 5 decryption attempts in Logic Arena.',
      icon: '🧩',
      reward: '800 XP'
    },
    {
      id: 'number-speedrun',
      title: 'Number Speedrun Badge',
      desc: 'Unlock by shifting puzzle arrangement pieces into sequential alignment in less than 30 moves in Number Rush.',
      icon: '🔢',
      reward: '1000 XP'
    }
  ];

  return (
    <div className="nexus-screen">
      <div className="section-header-block">
        <h2 className="neon-title">OPERATOR ACHIEVEMENTS</h2>
        <div className="section-subtitle">Synaptic accomplishments & unlocked security credentials</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
        {achievements.map((ach) => {
          const isUnlocked = user?.unlockedBadges?.includes(ach.id);
          return (
            <div 
              key={ach.id} 
              className="glass-card" 
              style={{ 
                padding: '30px', 
                textAlign: 'center', 
                borderTop: isUnlocked ? '3px solid var(--neon-green)' : '3px solid var(--text-muted)',
                opacity: isUnlocked ? 1 : 0.6
              }}
            >
              <div style={{ fontSize: '46px', marginBottom: '20px', filter: isUnlocked ? 'drop-shadow(0 0 10px rgba(57, 255, 20, 0.4))' : 'grayscale(100%)' }}>
                {ach.icon}
              </div>
              <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '16px', color: '#fff', marginBottom: '10px' }}>
                {ach.title}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px', minHeight: '60px' }}>
                {ach.desc}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                <span style={{ 
                  fontFamily: 'var(--font-header)', 
                  fontSize: '9px', 
                  color: isUnlocked ? 'var(--neon-green)' : 'var(--text-muted)',
                  background: isUnlocked ? 'rgba(57, 255, 20, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  padding: '4px 10px',
                  borderRadius: '3px'
                }}>
                  {isUnlocked ? 'SECURED' : 'LOCKED'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--neon-blue)', fontFamily: 'var(--font-header)' }}>
                  {ach.reward}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
