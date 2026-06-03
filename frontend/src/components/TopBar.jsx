import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function TopBar({ onToggleSidebar, navigate }) {
  const { user } = useAuth();
  const [latency, setLatency] = useState(12);

  // Dynamic latency simulation for neural feel
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        const next = prev + change;
        return next > 4 ? (next < 32 ? next : 30) : 6;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="top-nav-bar">
      {/* Left side: Hamburger (small screen or general toggle) & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button 
          className="sidebar-toggle-btn" 
          onClick={onToggleSidebar}
          style={{ display: 'flex' }}
          aria-label="Toggle Sidebar"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="top-nav-search">
          <span>🔍</span>
          <input type="text" placeholder="Scan neural network..." />
        </div>
      </div>

      {/* Right side: Latency Ping, Notifications, Quick Actions */}
      <div className="top-nav-actions">
        {/* Live ping */}
        <div className="live-ping">
          <div className="ping-dot" />
          <span className="ping-text">NEURAL LINK: {latency}ms</span>
        </div>

        {/* Notification Bell */}
        <button 
          className="notification-btn" 
          onClick={() => navigate('/app/notifications')}
          title="Notifications"
        >
          🔔
          <span className="badge-count">3</span>
        </button>

        {/* Quick Launch Game Hub */}
        <button 
          className="cyber-btn mini-btn primary"
          onClick={() => navigate('/app/modes')}
        >
          QUICK START <span className="btn-glow" />
        </button>

        {/* Short Status */}
        <div 
          onClick={() => navigate('/app/profile')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            cursor: 'pointer',
            padding: '4px 10px',
            borderRadius: '6px',
            border: '1px solid rgba(0, 240, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.02)'
          }}
        >
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-header)', color: 'var(--neon-blue)' }}>
            [ {user?.role || 'OPERATOR'} ]
          </span>
        </div>
      </div>
    </header>
  );
}
