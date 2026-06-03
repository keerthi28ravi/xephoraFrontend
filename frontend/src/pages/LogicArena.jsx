import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { gameAPI } from '../services/api';
import { playSound } from '../services/sound';

export default function LogicArena() {
  const { user, refreshUser } = useAuth();

  const [secretCode, setSecretCode] = useState([]);
  const [attempts, setAttempts] = useState(8);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [advisorText, setAdvisorText] = useState('Awaiting transmission. Enter your 4-digit guess using digits 1-9 to trigger system profiling.');
  const [advisorColor, setAdvisorColor] = useState('');
  const [historyLog, setHistoryLog] = useState([]);
  const [guess, setGuess] = useState(['', '', '', '']);
  const [gameStatus, setGameStatus] = useState('active'); // active, won, lost

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    generateNewSecretCode();
  }, []);

  const generateNewSecretCode = () => {
    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const code = [];
    for (let i = 0; i < 4; i++) {
      const randIdx = Math.floor(Math.random() * digits.length);
      code.push(digits[randIdx]);
      digits.splice(randIdx, 1); // remove to ensure no duplicates
    }
    setSecretCode(code);
    console.log("Xephora Engine Core Key (Dev Debug):", code.join(''));
  };

  const handleRekey = () => {
    playSound('click');
    generateNewSecretCode();
    setAttempts(8);
    setHintsLeft(3);
    setHistoryLog([]);
    setGuess(['', '', '', '']);
    setGameStatus('active');
    setAdvisorColor('');
    setAdvisorText('Awaiting transmission. Enter your 4-digit guess using digits 1-9 to trigger system profiling.');
    setTimeout(() => inputRefs[0].current?.focus(), 50);
  };

  const handleInputChange = (index, val) => {
    const newVal = val.replace(/[^1-9]/g, '').slice(-1); // Only digits 1-9
    const newGuess = [...guess];
    newGuess[index] = newVal;
    setGuess(newGuess);

    // Auto-focus next input cell if filled
    if (newVal !== '' && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleTransmitGuess = async (e) => {
    e.preventDefault();
    if (gameStatus !== 'active') return;

    // Validation
    if (guess.some(digit => digit === '')) {
      alert('Invalid decryption matrix. Please fill all 4 digit cells with 1-9.');
      return;
    }

    if (new Set(guess).size !== 4) {
      alert('System security forbids duplicate diagnostic numbers in guess.');
      return;
    }

    playSound('click');
    const newAttempts = attempts - 1;
    setAttempts(newAttempts);

    // Evaluate HITS and NEARS
    let hits = 0;
    let nears = 0;
    for (let i = 0; i < 4; i++) {
      if (guess[i] === secretCode[i]) {
        hits++;
      } else if (secretCode.includes(guess[i])) {
        nears++;
      }
    }

    // Add to history
    const entry = {
      guess: [...guess].join(' '),
      hits,
      nears,
      id: Date.now()
    };
    setHistoryLog(prev => [entry, ...prev]);

    // Win condition
    if (hits === 4) {
      playSound('win');
      setGameStatus('won');
      setAdvisorColor('var(--neon-green)');
      setAdvisorText('ACCESS GRANTED! CORE COGNITIVE TRANSMISSION SYNCHRONIZED.');
      
      // Submit score
      const movesTaken = 8 - newAttempts;
      const score = Math.max(200, 1000 - movesTaken * 80);
      submitGameScore(score, movesTaken);
      return;
    }

    // Lose condition
    if (newAttempts === 0) {
      playSound('fail');
      setGameStatus('lost');
      setAdvisorColor('var(--neon-pink)');
      setAdvisorText(`LOCKOUT INITIATED. CORRECT CODE SEQUENCE WAS [${secretCode.join('')}].`);
      return;
    }

    // Regular diagnostic output
    setAdvisorText(`Diagnostic profile completed. Hits: ${hits}, Nears: ${nears}. Modify vector alignments.`);
    setGuess(['', '', '', '']);
    setTimeout(() => inputRefs[0].current?.focus(), 50);
  };

  const submitGameScore = async (finalScore, movesTaken) => {
    try {
      const res = await gameAPI.submitScore({
        gameMode: 'Logic Arena',
        score: finalScore,
        levelReached: 1,
        moves: movesTaken,
        duration: 0
      });
      
      if (res.data.user) {
        refreshUser(res.data.user);
      }
      
      if (res.data.newlyUnlockedBadges?.length > 0) {
        setAdvisorText(`ACCESS GRANTED! XP: +${res.data.xpGain}! UNLOCKED ACHIEVEMENT: ${res.data.newlyUnlockedBadges.join(', ').toUpperCase()}`);
      } else {
        setAdvisorText(`ACCESS GRANTED! XP AWARDED: +${res.data.xpGain}!`);
      }
    } catch (err) {
      console.error('Score submit error:', err);
    }
  };

  const handleAdvisorHint = () => {
    if (hintsLeft <= 0) {
      alert('Strategic advisory mainframe links are depleted.');
      return;
    }

    playSound('click');
    setHintsLeft(prev => prev - 1);

    const hintSelection = Math.floor(Math.random() * 3);
    let hintMessage = '';

    if (hintSelection === 0) {
      // Reveal single verified number
      const randIdx = Math.floor(Math.random() * 4);
      hintMessage = `MAINFAST TELEMETRY: Digit ${secretCode[randIdx]} belongs in the active sequence matrix.`;
    } else if (hintSelection === 1) {
      // Evens count
      const evensCount = secretCode.filter(digit => parseInt(digit) % 2 === 0).length;
      hintMessage = `COGNITIVE STRUCT: Mainframe sequence contains precisely ${evensCount} even-numbered digits.`;
    } else {
      // Excluded numbers
      const nonExistent = ['1', '2', '3', '4', '5', '6', '7', '8', '9'].filter(digit => !secretCode.includes(digit));
      const chosen = nonExistent[Math.floor(Math.random() * nonExistent.length)];
      hintMessage = `SYNAPSE EXCLUSION: Digit ${chosen} does not exist in the secure registry pattern.`;
    }

    setAdvisorText(hintMessage);
  };

  return (
    <div className="nexus-screen">
      <div className="section-header-block">
        <h2 className="neon-title">LOGIC ARENA</h2>
        <div className="section-subtitle">Deductive Cryptographic Decryption Mainframe</div>
      </div>

      <div className="game-view-layout">
        {/* Left Controls */}
        <div className="glass-card game-control-panel">
          <div className="game-badge">CRYPTOGRAPHIC NODES</div>
          <h3>DECRYPTION CORES</h3>
          <p className="game-desc">
            Secure neural decryption matrix. Deduce the four-digit unique access key sequence (1-9).
            "HITS" represent correct digits in the correct cell; "NEARS" are correct digits in the wrong position.
          </p>

          <div className="game-stats-container">
            <div className="game-stat-item">
              <span className="gstat-lbl">ATTEMPTS</span>
              <span className="gstat-val text-neon-pink">{attempts}</span>
            </div>
            <div className="game-stat-item">
              <span className="gstat-lbl">ADVISOR HINTS</span>
              <span className="gstat-val text-neon-blue" style={{ fontSize: '12px', marginTop: '6px', display: 'block' }}>
                {hintsLeft} Left
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleTransmitGuess}>
            <div className="logic-inputs-row">
              {guess.map((val, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="text"
                  className="logic-input-cell"
                  maxLength="1"
                  value={val}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  disabled={gameStatus !== 'active'}
                />
              ))}
            </div>

            <div className="action-buttons-stack">
              <button 
                type="submit" 
                className="cyber-btn primary full-width"
                disabled={gameStatus !== 'active'}
              >
                TRANSMIT GUESS <span className="btn-glow" />
              </button>
              
              <div className="secondary-btns-row">
                <button 
                  type="button" 
                  className="cyber-btn secondary half-width mini-btn"
                  onClick={handleAdvisorHint}
                  disabled={gameStatus !== 'active' || hintsLeft <= 0}
                >
                  REQUEST HINT
                </button>
                <button 
                  type="button" 
                  className="cyber-btn secondary half-width mini-btn"
                  style={{ borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)' }}
                  onClick={handleRekey}
                >
                  REKEY CORE
                </button>
              </div>
            </div>
          </form>

          {/* Advisor Panel */}
          <div className="glass-card inner-card ai-hints-panel" style={{ background: 'rgba(112, 0, 255, 0.03)', border: '1px solid rgba(112, 0, 255, 0.15)' }}>
            <div className="ai-panel-title">🧠 COGNITIVE ADVISOR INDEX</div>
            <div id="logic-advisor-text" style={{ color: advisorColor || 'var(--text-secondary)' }}>
              {advisorText}
            </div>
          </div>
        </div>

        {/* Right History Matrix */}
        <div className="glass-card game-display-panel flex-column">
          <div className="terminal-heading">CRYPTOGRAPHIC PROFILE LOGS HISTORY</div>
          
          <div className="logic-history-container">
            {historyLog.length === 0 ? (
              <div className="history-placeholder">
                NO DECRYPTION GUESSES TRANSMITTED. SYSTEM SECURED.
              </div>
            ) : (
              historyLog.map((log) => (
                <div className="log-entry" key={log.id}>
                  <span className="log-code">{log.guess}</span>
                  <div className="log-outcome">
                    <span className="outcome-dot hit">HITS: {log.hits}</span>
                    <span className="outcome-dot near" style={{ marginLeft: '10px' }}>NEARS: {log.nears}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
