import React from 'react';

export default function Contact() {
  const channels = [
    { title: 'CORE BROADCAST MAIL', val: 'mainframe@xephora.io', desc: 'Secure asynchronous mail feed for billing, roles, and administrative requests.' },
    { title: 'SYNAPSE SUBNET FREQUENCY', val: 'frequency-4-nexus.net', desc: 'Secure synchronous voice/video coordination channel for global tournament spectating.' },
    { title: 'PHYSICAL MATRIX LABS', val: 'Cranberry Cyber Towers, Sector 9', desc: 'Secure tactical strategic physical development laboratories.' }
  ];

  return (
    <div className="nexus-screen">
      <div className="section-header-block">
        <h2 className="neon-title">SUBNET CONTACT MATRIX</h2>
        <div className="section-subtitle">Routing addresses to connect directly with Xephora system engineers</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', maxWidth: '960px', margin: '0 auto' }}>
        {channels.map((chan, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyGap: 'space-between' }}>
            <div>
              <div style={{ fontSize: '32px', marginBottom: '15px' }}>📡</div>
              <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '13px', color: '#fff', letterSpacing: '1px', marginBottom: '8px' }}>
                {chan.title}
              </h3>
              <p style={{ fontSize: '14px', fontFamily: 'var(--font-header)', color: 'var(--neon-blue)', fontWeight: 'bold', marginBottom: '15px' }}>
                {chan.val}
              </p>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
              {chan.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
