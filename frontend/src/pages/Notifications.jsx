import React, { useState } from 'react';
import { playSound } from '../services/sound';

export default function Notifications() {
  const [notifs, setNotifs] = useState([
    { id: 1, title: 'SYNAPTIC LEVEL COMPLETED', desc: 'Congratulations! Your cognitive ratings reached LEVEL UP parameters.', date: 'May 31, 2026', read: false },
    { id: 2, title: 'BADGE SECURITY UNLOCKED', desc: 'Memory Master Badge has been successfully synced and deployed to your operator brief.', date: 'May 30, 2026', read: false },
    { id: 3, title: 'SUBNET BRACKET DEPLOYMENT', desc: 'Decryption Tournament brackets have been randomized. Inspect tournament queues.', date: 'May 28, 2026', read: true }
  ]);

  const handleClear = () => {
    playSound('click');
    setNotifs([]);
  };

  const handleMarkRead = (id) => {
    playSound('click');
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="nexus-screen">
      <div className="section-header-block">
        <h2 className="neon-title">NOTIFICATION FEED</h2>
        <div className="section-subtitle">Real-time system updates & telemetry broadcast messages</div>
      </div>

      <div className="glass-card" style={{ padding: '30px', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px' }}>
          <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '15px', color: '#fff', letterSpacing: '1px' }}>
            OPERATOR BROADCAST ALERTS ({notifs.filter(n => !n.read).length} Unread)
          </h3>
          {notifs.length > 0 && (
            <button className="cyber-btn secondary mini-btn" onClick={handleClear} style={{ color: 'var(--neon-pink)', borderColor: 'var(--neon-pink)' }}>
              CLEAR ALL
            </button>
          )}
        </div>

        {notifs.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'var(--font-header)', letterSpacing: '1px' }}>
            NO ALERTS LOGGED. COGNITIVE LINK SECURE.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {notifs.map((n) => (
              <div 
                key={n.id} 
                style={{
                  padding: '16px',
                  background: n.read ? 'rgba(255, 255, 255, 0.01)' : 'rgba(0, 240, 255, 0.02)',
                  border: n.read ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 240, 255, 0.25)',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h4 style={{ fontFamily: 'var(--font-header)', fontSize: '13px', color: n.read ? '#fff' : 'var(--neon-blue)' }}>
                      {n.title}
                    </h4>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{n.date}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                    {n.desc}
                  </p>
                </div>
                {!n.read && (
                  <button 
                    className="cyber-btn primary mini-btn" 
                    onClick={() => handleMarkRead(n.id)}
                    style={{ padding: '4px 10px', fontSize: '9px' }}
                  >
                    MARK READ
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
