import React, { useState } from 'react';
import { playSound } from '../services/sound';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    { q: 'How does the Synaptic XP engine work?', a: 'Xephora monitors game completions. Completing memory grids, decrypting pass codes, and sliding number rush matrix blocks grants cumulative XP. 10,000 XP automatically triggers a level up on MongoDB.' },
    { q: 'Are the sliding puzzle matrix blocks guaranteed to be solvable?', a: 'Yes! The Number Rush scramble module shuffles the 15-puzzle by running 150 consecutive valid backward moves starting from the solved state. This guarantees that all displaced puzzles are 100% solvable.' },
    { q: 'How can I unlock secured badges?', a: 'Secure badges by satisfying cognitive thresholds: calibrate memory sequence to Level 5 (Memory Master), crack logic decrypts in under 5 attempts (Logic Decrypter), or slide number grids in under 30 moves (Number Speedrun).' },
    { q: 'How can I connect to competitive subnet lobbies?', a: 'Navigate to the Multiplayer Subnet Arena. You can allocate a new lobby or join existing waiting rooms in real-time. Once matched, players compete to complete decryption speeds.' }
  ];

  const handleToggle = (idx) => {
    playSound('click');
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="nexus-screen">
      <div className="section-header-block">
        <h2 className="neon-title">SYSTEM FAQ</h2>
        <div className="section-subtitle">Cognitive Matrix Frequently Asked Questions</div>
      </div>

      <div className="glass-card" style={{ padding: '30px', maxWidth: '700px', margin: '0 auto' }}>
        <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '15px', color: '#fff', letterSpacing: '1px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
          FREQUENT SYSTEM QUERIES
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              style={{
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.01)',
                overflow: 'hidden'
              }}
            >
              <div 
                onClick={() => handleToggle(idx)}
                style={{ 
                  padding: '16px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: openIdx === idx ? 'var(--neon-blue)' : '#fff',
                  transition: 'color .2s'
                }}
              >
                <span style={{ fontSize: '13px' }}>{faq.q.toUpperCase()}</span>
                <span>{openIdx === idx ? '▲' : '▼'}</span>
              </div>
              
              {openIdx === idx && (
                <div style={{ 
                  padding: '16px', 
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
                  background: 'rgba(0, 0, 0, 0.2)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6'
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
