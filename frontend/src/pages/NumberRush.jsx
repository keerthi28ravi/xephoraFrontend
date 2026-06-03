import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { gameAPI } from '../services/api';
import { playSound } from '../services/sound';

export default function NumberRush() {
  const { user, refreshUser } = useAuth();

  const [board, setBoard] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]);
  const [moves, setMoves] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedbackText, setFeedbackText] = useState('RECONSTRUCT THE 1 TO 15 GRID MATRIX.');
  const [feedbackColor, setFeedbackColor] = useState('');

  const timerRef = useRef(null);
  const movesRef = useRef(0);

  // Initialize standard grid on mount
  useEffect(() => {
    initBoard();
    return () => clearInterval(timerRef.current);
  }, []);

  const initBoard = () => {
    setBoard([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]);
    setMoves(0);
    movesRef.current = 0;
    setDuration(0);
    setIsPlaying(false);
    setFeedbackColor('');
    setFeedbackText('RECONSTRUCT THE 1 TO 15 GRID MATRIX.');
    clearInterval(timerRef.current);
  };

  const handleScramble = () => {
    playSound('click');
    clearInterval(timerRef.current);
    
    // Perform 150 legal swaps starting from solved board to ensure solvability
    const tempState = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    
    for (let i = 0; i < 150; i++) {
      const emptyIdx = tempState.indexOf(0);
      const possibleSwaps = [];
      const emptyRow = Math.floor(emptyIdx / 4);
      const emptyCol = emptyIdx % 4;

      if (emptyRow > 0) possibleSwaps.push(emptyIdx - 4); // Up
      if (emptyRow < 3) possibleSwaps.push(emptyIdx + 4); // Down
      if (emptyCol > 0) possibleSwaps.push(emptyIdx - 1); // Left
      if (emptyCol < 3) possibleSwaps.push(emptyIdx + 1); // Right

      const swapIdx = possibleSwaps[Math.floor(Math.random() * possibleSwaps.length)];
      tempState[emptyIdx] = tempState[swapIdx];
      tempState[swapIdx] = 0;
    }

    setBoard(tempState);
    setMoves(0);
    movesRef.current = 0;
    setDuration(0);
    setIsPlaying(true);
    setFeedbackColor('');
    setFeedbackText('MATRIX DISPLACED! TIMER VECTOR INITIATES ON FIRST TRANSLATION.');
  };

  const handleTileClick = (index) => {
    if (!isPlaying) {
      setFeedbackText('SCRAMBLE THE DECK PROTOCOL TO INITIATE GAMEPLAY LOGS.');
      return;
    }

    const emptyIndex = board.indexOf(0);
    const tileRow = Math.floor(index / 4);
    const tileCol = index % 4;
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;

    const dx = Math.abs(tileRow - emptyRow);
    const dy = Math.abs(tileCol - emptyCol);

    // Is neighboring tile? (dx + dy == 1)
    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      playSound('click');

      const nextBoard = [...board];
      nextBoard[emptyIndex] = board[index];
      nextBoard[index] = 0;
      setBoard(nextBoard);

      const nextMoves = moves + 1;
      setMoves(nextMoves);
      movesRef.current = nextMoves;

      // Start timer on first move
      if (nextMoves === 1) {
        startTimer();
      }

      checkVictory(nextBoard);
    }
  };

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  };

  const checkVictory = (currentBoard) => {
    const isWon = currentBoard.slice(0, 15).every((num, idx) => num === idx + 1);
    
    if (isWon) {
      clearInterval(timerRef.current);
      setIsPlaying(false);
      playSound('win');
      setFeedbackColor('var(--neon-green)');
      setFeedbackText('NEXUS SYSTEM SHIFT SUCCESSFUL! DIMENSIONAL BLOCKS RECONSTRUCTED.');

      // Submit score
      const finalScore = Math.max(200, 1500 - movesRef.current * 15 - duration * 2);
      submitGameScore(finalScore, movesRef.current);
    }
  };

  const submitGameScore = async (finalScore, finalMoves) => {
    try {
      const res = await gameAPI.submitScore({
        gameMode: 'Number Rush',
        score: finalScore,
        levelReached: 1,
        moves: finalMoves,
        duration: duration
      });

      if (res.data.user) {
        refreshUser(res.data.user);
      }

      if (res.data.newlyUnlockedBadges?.length > 0) {
        setFeedbackText(`SHIFT SUCCESSFUL! XP: +${res.data.xpGain}! UNLOCKED BADGE: ${res.data.newlyUnlockedBadges.join(', ').toUpperCase()}`);
      } else {
        setFeedbackText(`SHIFT SUCCESSFUL! XP AWARDED: +${res.data.xpGain}!`);
      }
    } catch (err) {
      console.error('Failed to submit puzzle telemetry:', err);
    }
  };

  // Convert duration seconds to MM:SS string
  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="nexus-screen">
      <div className="section-header-block">
        <h2 className="neon-title">NUMBER RUSH</h2>
        <div className="section-subtitle">Tactical Dimensional Sliding Alignment Core</div>
      </div>

      <div className="game-view-layout">
        {/* Left Side Controls */}
        <div className="glass-card game-control-panel">
          <div className="game-badge" style={{ color: 'var(--neon-violet)' }}>COGNITIVE COORDINATION</div>
          <h3>NUMBER SHIFT</h3>
          <p className="game-desc">
            Re-architect spatial vectors by translating scattered numerical blocks into sequential order 1 through 15.
            The timer initializes upon the first active displacement shift.
          </p>

          <div className="game-stats-container">
            <div className="game-stat-item">
              <span className="gstat-lbl">TOTAL MOVES</span>
              <span className="gstat-val text-neon-blue">{moves}</span>
            </div>
            <div className="game-stat-item">
              <span className="gstat-lbl">TIMER LOG</span>
              <span className="gstat-val text-neon-violet">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="action-buttons-stack">
            <button 
              className="cyber-btn primary full-width"
              onClick={handleScramble}
            >
              SCRAMBLE DECK <span className="btn-glow" />
            </button>
            <button 
              className="cyber-btn secondary full-width mini-btn"
              onClick={initBoard}
            >
              RESET MATRIX
            </button>
          </div>

          <div className="game-instruction-alert">
            INSTRUCTION: Click blocks adjacent to the empty grid slot to swap positions. Arrange cells 1 to 15 correctly.
            Crack in under 30 translations to earn the Number Speedrun badge.
          </div>
        </div>

        {/* Right Side Board */}
        <div className="glass-card game-display-panel flex-column">
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
            STATUS: <span style={{ color: feedbackColor }}>{feedbackText}</span>
          </div>

          <div className="puzzle-board-container" style={{ margin: '0 auto' }}>
            <div className="puzzle-grid">
              {board.map((num, idx) => (
                <div 
                  key={idx}
                  className={`puzzle-tile ${num === 0 ? 'empty' : ''}`}
                  onClick={() => handleTileClick(idx)}
                >
                  {num !== 0 && num}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
