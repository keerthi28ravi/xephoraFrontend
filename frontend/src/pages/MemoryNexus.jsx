import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { gameAPI } from '../services/api';
import { playSound } from '../services/sound';

export default function MemoryNexus() {
  const { user, refreshUser } = useAuth();

  // Grid type: 4 (2x2) or 9 (3x3)
  const [gridSize, setGridSize] = useState(4);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [statusText, setStatusText] = useState('READY TO INITIATE. CONFIGURATION SET.');
  const [isPlayingPattern, setIsPlayingPattern] = useState(false);
  const [activeNode, setActiveNode] = useState(null);
  const [gameState, setGameState] = useState('idle'); // idle, playing_pattern, player_turn, won, game_over

  const sequenceRef = useRef([]);
  const playerSequenceRef = useRef([]);
  const flashTimeoutRef = useRef(null);

  // High score lookup in user history/stats
  useEffect(() => {
    if (user?.unlockedBadges?.includes('memory-master')) {
      setHighScore(5);
    }
  }, [user]);

  const handleDifficultyChange = (size) => {
    playSound('click');
    setGridSize(size);
    resetGame();
    setStatusText(`READY TO INITIATE. CONFIGURATION SET FOR ${size} CELLS.`);
  };

  const resetGame = () => {
    sequenceRef.current = [];
    playerSequenceRef.current = [];
    setLevel(1);
    setIsPlayingPattern(false);
    setActiveNode(null);
    setGameState('idle');
  };

  const flashNode = (nodeIdx) => {
    setActiveNode(nodeIdx);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    flashTimeoutRef.current = setTimeout(() => {
      setActiveNode(null);
    }, 300);
  };

  const playSequence = async (seq) => {
    setIsPlayingPattern(true);
    setGameState('playing_pattern');
    setStatusText('MONITOR SEQUENCING TELEMETRY...');
    
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const nodeIndex = seq[i];
      const soundKey = `flash${(nodeIndex % 4) + 1}`;
      playSound(soundKey);
      flashNode(nodeIndex);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    setIsPlayingPattern(false);
    setGameState('player_turn');
    setStatusText('MATCH RECURSIVE PATTERN MATRIX NOW.');
  };

  const startNextLevel = () => {
    playerSequenceRef.current = [];
    const nextNodeIndex = Math.floor(Math.random() * gridSize);
    sequenceRef.current.push(nextNodeIndex);
    playSequence([...sequenceRef.current]);
  };

  const handleNodeClick = async (nodeIdx) => {
    if (isPlayingPattern || gameState !== 'player_turn') return;

    const soundKey = `flash${(nodeIdx % 4) + 1}`;
    playSound(soundKey);
    flashNode(nodeIdx);

    playerSequenceRef.current.push(nodeIdx);
    const currentIndex = playerSequenceRef.current.length - 1;

    // Check match correctness
    if (playerSequenceRef.current[currentIndex] !== sequenceRef.current[currentIndex]) {
      // Game Over!
      playSound('fail');
      setStatusText(`SYNAPTIC ANOMALY IN CELL CHAIN. SEQUENCE FAILED AT INDEX ${currentIndex + 1}.`);
      setGameState('game_over');

      // Submit score on failure if level is high
      if (level > 1) {
        submitGameScore(level - 1);
      }
      return;
    }

    // Level sequence fully matched!
    if (playerSequenceRef.current.length === sequenceRef.current.length) {
      const nextLevel = level + 1;
      setLevel(nextLevel);
      if (nextLevel - 1 > highScore) {
        setHighScore(nextLevel - 1);
      }

      setStatusText('TRANSMISSION SYNCHRONIZED. ACCELERATING MATRIX...');
      setGameState('playing_pattern');

      setTimeout(() => {
        startNextLevel();
      }, 1000);
    }
  };

  const submitGameScore = async (scoreLevel) => {
    try {
      const scoreAmount = scoreLevel * 100;
      const res = await gameAPI.submitScore({
        gameMode: 'Memory Nexus',
        score: scoreAmount,
        levelReached: scoreLevel,
        moves: sequenceRef.current.length,
        duration: sequenceRef.current.length * 2 // approximation in seconds
      });
      
      if (res.data.user) {
        refreshUser(res.data.user);
      }
      
      if (res.data.newlyUnlockedBadges?.length > 0) {
        setStatusText(`TELEMETRY EXCELLENT. XP AWARDED: +${res.data.xpGain}! UNLOCKED: ${res.data.newlyUnlockedBadges.join(', ').toUpperCase()}`);
      } else {
        setStatusText(`TELEMETRY SYNCED. XP AWARDED: +${res.data.xpGain}!`);
      }
    } catch (err) {
      console.error('Failed to sync telemetry:', err);
    }
  };

  const initiateNexusGame = () => {
    playSound('click');
    resetGame();
    setTimeout(() => {
      playerSequenceRef.current = [];
      const firstNode = Math.floor(Math.random() * gridSize);
      sequenceRef.current = [firstNode];
      playSequence([firstNode]);
    }, 300);
  };

  return (
    <div className="nexus-screen">
      <div className="section-header-block">
        <h2 className="neon-title">MEMORY NEXUS</h2>
        <div className="section-subtitle">Cognitive Retention & Pattern Calibration Terminal</div>
      </div>

      <div className="game-view-layout">
        {/* Left Control Panel */}
        <div className="glass-card game-control-panel">
          <div className="game-badge">RETENTION TELEMETRY</div>
          <h3>SIMON SAYS CORE</h3>
          <p className="game-desc">
            Xephora's memory matrix expands sensory recognition capacities. Replicate the sequential flashes 
            of high-frequency neon energy nodes to solidify neural pathways.
          </p>

          <div className="game-stats-container">
            <div className="game-stat-item">
              <span className="gstat-lbl">CURRENT LEVEL</span>
              <span className="gstat-val text-neon-blue">{level}</span>
            </div>
            <div className="game-stat-item">
              <span className="gstat-lbl">BEST RETENTION</span>
              <span className="gstat-val text-neon-violet">{highScore}</span>
            </div>
          </div>

          <div className="difficulty-group">
            <label>ARENA MATRIX DESIGN</label>
            <div className="difficulty-selectors">
              <button 
                className={`diff-btn ${gridSize === 4 ? 'active' : ''}`}
                onClick={() => handleDifficultyChange(4)}
              >
                2X2 DEPLOYMENT
              </button>
              <button 
                className={`diff-btn ${gridSize === 9 ? 'active' : ''}`}
                onClick={() => handleDifficultyChange(9)}
              >
                3X3 DEPLOYMENT
              </button>
            </div>
          </div>

          <button 
            className="cyber-btn primary full-width"
            onClick={initiateNexusGame}
            style={{ marginBottom: '20px' }}
          >
            INITIATE SEQUENCE <span className="btn-glow" />
          </button>

          <div className="game-instruction-alert">
            INSTRUCTION: Monitor sequence illumination. Once completed, repeat the chronological grid order precisely. 
            Calibrate up to level 5 to claim Memory Master Badge.
          </div>
        </div>

        {/* Right Board Display Panel */}
        <div className="glass-card game-display-panel" style={{ flexDirection: 'column' }}>
          <div 
            style={{ 
              fontFamily: 'var(--font-header)', 
              fontSize: '11px', 
              color: 'var(--neon-blue)', 
              marginBottom: '20px', 
              textAlign: 'center',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}
          >
            STATUS: {statusText}
          </div>

          <div className="memory-grid-wrapper">
            <div className={`memory-grid ${gridSize === 4 ? 'grid-2x2' : 'grid-3x3'}`}>
              {Array.from({ length: gridSize }).map((_, idx) => (
                <div 
                  key={idx}
                  className={`memory-node ${activeNode === idx ? 'flash' : ''}`}
                  onClick={() => handleNodeClick(idx)}
                  style={{
                    // Vary colors slightly to look extremely dynamic
                    background: activeNode === idx ? '' : `rgba(112, 0, 255, ${0.05 + (idx % 3) * 0.03})`,
                    borderColor: activeNode === idx ? '' : `rgba(112, 0, 255, ${0.15 + (idx % 3) * 0.15})`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
