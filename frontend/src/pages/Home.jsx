import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NeuralBackground from '../components/NeuralBackground';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div style={{ position: 'relative', width: '100vw', minHeight: '100vh', overflowX: 'hidden' }}>
      <NeuralBackground />

      {/* Main landing container */}
      <div className="hologram-grid-overlay" />
      
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '0 30px' }}>
        {/* Navigation Bar */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '90px',
          borderBottom: '1px solid var(--glass-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" fill="none" stroke="#00f0ff" strokeWidth="6" />
              <circle cx="50" cy="50" r="15" fill="#7000ff" />
            </svg>
            <span style={{ 
              fontFamily: 'var(--font-header)', 
              fontSize: '20px', 
              fontWeight: 800, 
              letterSpacing: '3px',
              background: 'linear-gradient(to right, var(--neon-blue), #fff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>XEPHORA</span>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            {user ? (
              <button className="cyber-btn primary mini-btn" onClick={() => navigate('/app/dashboard')}>
                ENTER NEXUS <span className="btn-glow" />
              </button>
            ) : (
              <>
                <button className="cyber-btn secondary mini-btn" onClick={() => navigate('/login')}>
                  LOG IN
                </button>
                <button className="cyber-btn primary mini-btn" onClick={() => navigate('/register')}>
                  INITIATE SYSTEM <span className="btn-glow" />
                </button>
              </>
            )}
          </div>
        </header>

        {/* Hero split section */}
        <div className="hero-split-grid">
          <div>
            <div className="cyber-badge">SYSTEM STABLE // PROT v2.4.9</div>
            <h1 className="hero-glitch-title">XEPHORA</h1>
            <div className="hero-subheading">Neural Strategy Nexus for Advanced Minds</div>
            <p className="hero-desc">
              Connect your synaptic nodes to the cyber arena. Xephora is a comprehensive cognitive 
              training facility designed to elevate logical processing, sensory retention, and tactical response. 
              Compete against the global network, unlock latent cognitive classifications, and optimize your cerebral capacity.
            </p>
            <div className="hero-actions">
              {user ? (
                <button className="cyber-btn primary" onClick={() => navigate('/app/dashboard')}>
                  OPEN COMMAND CENTER <span className="btn-glow" />
                </button>
              ) : (
                <>
                  <button className="cyber-btn primary" onClick={() => navigate('/register')}>
                    CREATE OPERATOR LINK <span className="btn-glow" />
                  </button>
                  <button className="cyber-btn secondary" onClick={() => navigate('/login')}>
                    SECURE SIGN-IN
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Hologram visualizer */}
          <div className="hero-visual-block">
            <div className="hologram-core-container">
              <div className="hologram-ring outer" />
              <div className="hologram-ring middle" />
              <div className="hologram-ring inner" />
              
              {/* Spinning visual SVG core */}
              <svg className="hologram-brain" width="140" height="140" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="30" fill="none" stroke="var(--neon-blue)" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M50 20 L50 80 M20 50 L80 50" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" />
                {/* Connective nodes */}
                <circle cx="50" cy="20" r="4" fill="var(--neon-pink)" className="pulse-glow-dot" />
                <circle cx="50" cy="80" r="4" fill="var(--neon-pink)" className="pulse-glow-dot" />
                <circle cx="20" cy="50" r="4" fill="var(--neon-blue)" className="pulse-glow-dot" />
                <circle cx="80" cy="50" r="4" fill="var(--neon-blue)" className="pulse-glow-dot" />
                <circle cx="50" cy="50" r="10" fill="#7000ff" opacity="0.6" />
                <polygon points="50,38 62,50 50,62 38,50" fill="none" stroke="var(--neon-violet)" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Dynamic statistics */}
        <section className="about-flex-layout" style={{ marginTop: '0', paddingBottom: '60px' }}>
          <div className="about-card-left glass-card">
            <h3>NEXUS PROTOCOLS</h3>
            <p>
              Xephora monitors multi-dimensional mental telemetry across key strategic arenas.
              Through dynamic sensory-memory tasks, numerical arrangement puzzles, and logical code decryption, 
              your operational capacity is stored and visualised in real-time.
            </p>
            <div className="stat-highlight-row">
              <div className="stat-box">
                <div className="stat-num neon-blue">3</div>
                <div className="stat-label">CORE ARENAS</div>
              </div>
              <div className="stat-box">
                <div className="stat-num neon-violet">100%</div>
                <div className="stat-label">SYNAPTIC TRACKING</div>
              </div>
            </div>
          </div>

          <div className="about-card-right glass-card">
            <h3>SYSTEM METRICS</h3>
            <div className="tech-schematics">
              <div className="schematic-item">
                <div className="tech-icon">🧠</div>
                <div>
                  <strong>Memory Nexus Simon Core</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Porting advanced auditory-visual sequencing algorithms to optimize neuroplasticity.
                  </span>
                </div>
              </div>
              <div className="schematic-item">
                <div className="tech-icon">🧩</div>
                <div>
                  <strong>Logic Decryption Decoders</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Advanced cryptographic decoding suites that benchmark deductive analysis speed.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scroll indicator */}
        <div className="hero-scroll-indicator" style={{ paddingBottom: '50px' }}>
          <div className="mouse-icon">
            <div className="mouse-wheel" />
          </div>
          <div className="scroll-label">SECURE LINK ESTABLISHED</div>
        </div>
      </div>
    </div>
  );
}
