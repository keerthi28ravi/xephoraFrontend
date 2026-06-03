import React, { useState } from 'react';
import { playSound } from '../services/sound';

export default function Settings() {
  const [volume, setVolume] = useState(70);
  const [sfx, setSfx] = useState(true);
  const [particleDensity, setParticleDensity] = useState('Medium');
  const [statusMsg, setStatusMsg] = useState('MAINBOARD CREDENTIALS SECURED.');

  const handleSfxToggle = () => {
    playSound('click');
    setSfx(!sfx);
  };

  const handleDensityChange = (density) => {
    playSound('click');
    setParticleDensity(density);
  };

  const handleCommit = (e) => {
    e.preventDefault();
    playSound('win');
    setStatusMsg('SYSTEM CONFIGURATION COMMITTED TO LOCAL MEMORY.');
    setTimeout(() => setStatusMsg('MAINBOARD CREDENTIALS SECURED.'), 3000);
  };

  return (
    <div className="nexus-screen">
      <div className="section-header-block">
        <h2 className="neon-title">SYSTEM SETTINGS</h2>
        <div className="section-subtitle">Calibrate neural networks & sound output matrix arrays</div>
      </div>

      <div className="glass-card" style={{ padding: '30px', maxWidth: '650px', margin: '0 auto' }}>
        <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '16px', color: '#fff', letterSpacing: '1px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
          AUDIO & PERFORMANCE INDEX
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginBottom: '35px' }}>
          {/* SFX Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '13px', color: '#fff', display: 'block' }}>SYNTH SOUND EFFECTS (SFX)</strong>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Toggle on-the-fly sci-fi Web Audio synthesis.</span>
            </div>
            <button 
              className={`cyber-btn mini-btn ${sfx ? 'primary' : 'secondary'}`} 
              onClick={handleSfxToggle}
              style={{ width: '100px' }}
            >
              {sfx ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Volume Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', fontFamily: 'var(--font-header)' }}>
              <span>SYNTHESIZER CORE VOLUME</span>
              <span style={{ color: 'var(--neon-blue)' }}>{volume}%</span>
            </div>
            <input
              type="range"
              className="cyber-slider"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              disabled={!sfx}
            />
          </div>

          {/* Particle Density */}
          <div>
            <strong style={{ fontSize: '13px', color: '#fff', display: 'block', marginBottom: '4px' }}>
              NEURAL BACKGROUND PARTICLE DENSITY
            </strong>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '12px' }}>
              Adjust visual coherence load. Higher values elevate GPU operations.
            </span>
            <div className="difficulty-selectors" style={{ gap: '15px' }}>
              {['Low', 'Medium', 'High'].map((density) => (
                <button 
                  key={density}
                  className={`diff-btn ${particleDensity === density ? 'active' : ''}`}
                  onClick={() => handleDensityChange(density)}
                >
                  {density.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '16px', color: '#fff', letterSpacing: '1px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
          CREDENTIAL KEY ROTATION
        </h3>

        <form onSubmit={handleCommit} className="auth-form" style={{ gap: '15px' }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '9px', fontFamily: 'var(--font-header)', color: 'var(--neon-blue)' }}>CURRENT ACCESS KEY</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required 
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                  borderRadius: '4px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '13px'
                }}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '9px', fontFamily: 'var(--font-header)', color: 'var(--neon-blue)' }}>NEW ACCESS KEY</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required 
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                  borderRadius: '4px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>

          <button type="submit" className="cyber-btn primary full-width">
            COMMIT SYSTEM CONFIGURATIONS
          </button>
        </form>

        <div className="game-instruction-alert" style={{ marginTop: '25px', borderColor: 'var(--glass-border)' }}>
          TELEMETRY // {statusMsg.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
