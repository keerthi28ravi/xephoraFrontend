import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { playSound } from '../services/sound';

export default function CommunityHub() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'NeoScribe', text: 'Just unlocked the Logic Decrypter badge in 3 steps! Cognitive advisor hints were key.', time: '17:42' },
    { id: 2, sender: 'Chronos', text: 'Slider speeds in Number Rush are intense. Currently at 42 seconds solved.', time: '17:44' },
    { id: 3, sender: 'VectorZero', text: 'Is anyone up for a Simon says duel in the competitive subnets?', time: '17:45' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    playSound('click');
    const newMsg = {
      id: Date.now(),
      sender: user?.username || 'OPERATOR',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  const announcements = [
    { title: 'COGNITIVE TOURNAMENT STAGE B', date: 'MAY 31, 2026', body: 'Decryption Speedrun tournament initiates in 24 hours. Connect adapters to the global brackets.' },
    { title: 'SYSTEM MATRIX v2.4.9 DEPLOYED', date: 'MAY 28, 2026', body: 'Integrated the cyber retro sound synthesizer cores directly into memory sequences. Visual node flash latency calibrated.' }
  ];

  return (
    <div className="nexus-screen">
      <div className="section-header-block">
        <h2 className="neon-title">SUBNET COMMUNITY HUB</h2>
        <div className="section-subtitle">Connect to operator subnet feeds and announcement logs</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Left: Chat Feed */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '480px' }}>
          <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '15px', color: '#fff', letterSpacing: '1px', marginBottom: '15px' }}>
            OPERATOR LIVE FREQUENCY
          </h3>

          <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '15px' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                background: 'rgba(255, 255, 255, 0.01)',
                border: '1px solid rgba(255,255,255,0.03)',
                padding: '10px 14px',
                borderRadius: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '12px', color: 'var(--neon-blue)', fontFamily: 'var(--font-header)' }}>
                    {msg.sender.toUpperCase()}
                  </strong>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{msg.time}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>{msg.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Transmit log message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(0, 240, 255, 0.2)',
                borderRadius: '4px',
                padding: '10px 14px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button type="submit" className="cyber-btn primary mini-btn">
              SEND
            </button>
          </form>
        </div>

        {/* Right: Announcements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '15px', color: '#fff', letterSpacing: '1px', marginBottom: '15px' }}>
              NET CORE BROADCASTS
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {announcements.map((ann, i) => (
                <div key={i} style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '6px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h4 style={{ fontFamily: 'var(--font-header)', fontSize: '13px', color: 'var(--neon-pink)' }}>
                      {ann.title}
                    </h4>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{ann.date}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                    {ann.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
