import React, { useState } from 'react';

export default function AINeuralEngine() {
  const [intensity, setIntensity] = useState(70);
  const [retention, setRetention] = useState(50);
  const [deduction, setDeduction] = useState(60);
  const [calculating, setCalculating] = useState(false);
  const [diagnosticText, setDiagnosticText] = useState('Select parameters and run a diagnostic synapse scan to sync real-time tactical optimizations.');

  const runDiagnostic = () => {
    setCalculating(true);
    setDiagnosticText('CALIBRATING AI NEURAL VECTORS...');
    setTimeout(() => {
      setCalculating(false);
      // Generate intelligent insights based on slider variables
      const load = Math.round((intensity * 0.4) + (retention * 0.3) + (deduction * 0.3));
      let insight = '';
      if (load > 75) {
        insight = `CRITICAL OVERLOAD: Cumulative synapse focus index is high (${load}%). Your neural matrix is primed for Maximum cognitive campaigns, but retention capacity may degrade. Recommend alternating Simon tasks with Logic Arena decrypts.`;
      } else if (load > 45) {
        insight = `SYNAPSE HARMONY: Operational balance verified at stable levels (${load}%). Dynamic coherence between sensory retention and logical deduction. Primed for Multiplayer competitive subnets.`;
      } else {
        insight = `UNDER-CLOCKING: Internal telemetry indicates a conservative synaptic load (${load}%). Recommend ramping up grid dimensions in Memory Nexus or sliding speed thresholds in Number Rush to maximize cognitive output.`;
      }
      setDiagnosticText(insight);
    }, 1500);
  };

  return (
    <div className="nexus-screen">
      <div className="section-header-block">
        <h2 className="neon-title">AI NEURAL ENGINE</h2>
        <div className="section-subtitle">Cognitive parameter calibration & optimization loops</div>
      </div>

      <div className="ai-engine-split">
        {/* Left Adjustments */}
        <div className="glass-card ai-card-details">
          <h3>SYNAPTIC PARAMETER SLIDERS</h3>
          <p>
            Optimize neural capacity allocations. Adjusting parameter vectors alters the focus coefficient 
            processed by Xephora's core strategic decoders.
          </p>

          <div className="engine-slider-block">
            <div className="slider-label">
              <span>INTENSITY COEFFICIENT</span>
              <span style={{ color: 'var(--neon-blue)' }}>{intensity}%</span>
            </div>
            <input
              type="range"
              className="cyber-slider"
              min="10"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
            />
          </div>

          <div className="engine-slider-block">
            <div className="slider-label">
              <span>RETENTION STRENGTH</span>
              <span style={{ color: 'var(--neon-violet)' }}>{retention}%</span>
            </div>
            <input
              type="range"
              className="cyber-slider"
              min="10"
              max="100"
              value={retention}
              onChange={(e) => setRetention(parseInt(e.target.value))}
              style={{ background: 'rgba(112, 0, 255, 0.08)' }}
            />
          </div>

          <div className="engine-slider-block">
            <div className="slider-label">
              <span>DEDUCTIVE COEFFICIENT</span>
              <span style={{ color: 'var(--neon-pink)' }}>{deduction}%</span>
            </div>
            <input
              type="range"
              className="cyber-slider"
              min="10"
              max="100"
              value={deduction}
              onChange={(e) => setDeduction(parseInt(e.target.value))}
            />
          </div>

          <button 
            className="cyber-btn primary full-width"
            onClick={runDiagnostic}
            disabled={calculating}
          >
            {calculating ? 'CALIBRATING SYNAPSE SCAN...' : 'RUN COGNITIVE DIAGNOSTIC'} <span className="btn-glow" />
          </button>
        </div>

        {/* Right Visual and Insights */}
        <div className="glass-card ai-card-visual">
          <h4>NEURAL CALIBRATOR TELEMETRY</h4>
          
          <div className="matrix-canvas-wrapper">
            <svg className="engine-vector-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--neon-blue)" strokeWidth="0.5" strokeDasharray="2 2" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="var(--neon-violet)" strokeWidth="1" />
              
              {/* Rotating polygon */}
              <polygon 
                className="rotating-polygon"
                points="50,22 75,65 25,65" 
                fill="none" 
                stroke="var(--neon-pink)" 
                strokeWidth="1.5"
                style={{
                  // Spin animation speed is tied to the intensity value
                  animationDuration: `${Math.max(5, 60 - intensity * 0.5)}s`
                }}
              />
              <circle cx="50" cy="50" r="10" fill="#07030d" stroke="var(--neon-blue)" strokeWidth="1" />
              <line x1="50" y1="50" x2="50" y2="22" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="1" />
              <line x1="50" y1="50" x2="75" y2="65" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="1" />
              <line x1="50" y1="50" x2="25" y2="65" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="1" />
            </svg>
          </div>

          <div className="glass-card inner-card ai-recommendation-box" style={{ background: 'rgba(0, 240, 255, 0.02)', border: '1px solid rgba(0, 240, 255, 0.15)' }}>
            <h5>🧠 REAL-TIME SYSTEM INTELLIGENCE</h5>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{diagnosticText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
