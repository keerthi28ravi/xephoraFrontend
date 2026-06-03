/* ==========================================================================
   XEPHORA COGNITIVE APPLICATION ENGINE (app.js)
   Operational logic: canvas backgrounds, state navigation, playable mini-games,
   sound synthesizers, chatbot responses, and telemetry state tracking.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Global State Tracker
  const State = {
    user: {
      name: 'OPERATOR_X',
      level: 24,
      xp: 7420,
      maxXp: 10000,
      score: 8650,
      accuracy: 92,
      solvedCount: 142,
      unlockedBadges: ['splash', 'memory']
    },
    latency: '12ms',
    matchmaking: {
      inQueue: false,
      timer: null,
      seconds: 0
    }
  };

  // ==========================================================================
  // AUDIO SYNTHESIZER MODULE (Web Audio API)
  // Generates sci-fi cyber sound effects on-the-fly without external assets
  // ==========================================================================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playSound(type) {
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } 
      else if (type === 'flash1') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(329.63, now); // E4
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
      else if (type === 'flash2') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(392.00, now); // G4
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
      else if (type === 'flash3') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440.00, now); // A4
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
      else if (type === 'flash4') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
      else if (type === 'win') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.4);
        gainNode.gain.setValueAtTime(0.12, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
      else if (type === 'fail') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch (e) {
      console.warn("Synth Audio blocked or unsupported:", e);
    }
  }

  // ==========================================================================
  // 1. SPLASH SCREEN LOADING SEQUENCER
  // ==========================================================================
  const splashScreen = document.getElementById('splash-screen');
  const loaderBar = document.getElementById('loader-bar');
  const loaderText = document.getElementById('loader-text');
  const enterNexusBtn = document.getElementById('enter-nexus-btn');
  const mainApp = document.getElementById('nexus-app');

  let loadPercent = 0;
  const loadInterval = setInterval(() => {
    loadPercent += Math.floor(Math.random() * 8) + 2;
    if (loadPercent >= 100) {
      loadPercent = 100;
      clearInterval(loadInterval);
      
      loaderText.innerText = "SYNAPTIC LINK SECURED. INTERFACE DEPLOYED.";
      loaderText.style.color = "#39ff14";
      enterNexusBtn.classList.remove('disabled');
      enterNexusBtn.removeAttribute('disabled');
      playSound('win');
    } else {
      loaderText.innerText = `ESTABLISHING SYNAPTIC LINK... ${loadPercent}%`;
    }
    loaderBar.style.width = `${loadPercent}%`;
  }, 100);

  enterNexusBtn.addEventListener('click', () => {
    playSound('click');
    splashScreen.style.transition = 'opacity 0.6s ease';
    splashScreen.style.opacity = '0';
    setTimeout(() => {
      splashScreen.classList.add('hidden');
      mainApp.classList.remove('hidden');
      triggerWelcomeNotif();
    }, 600);
  });

  // ==========================================================================
  // 2. COLLAPSIBLE CYBER SIDEBAR & SCREEN ROUTER
  // ==========================================================================
  const sidebar = document.getElementById('app-sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const navItems = document.querySelectorAll('.nav-item');
  const screens = document.querySelectorAll('.nexus-screen');

  // Router Engine
  function navigateTo(screenId) {
    screens.forEach(screen => {
      screen.classList.remove('active');
      if (screen.id === screenId) {
        screen.classList.add('active');
        // Scroll to top inside viewports
        document.querySelector('.viewports-container').scrollTop = 0;
      }
    });

    // Update Nav item indicators
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-screen') === screenId) {
        item.classList.add('active');
      }
    });
  }

  // Bind Navbar Clicks
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      playSound('click');
      const targetScreen = item.getAttribute('data-screen');
      navigateTo(targetScreen);
      
      // Close mobile sidebar drawer
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
      }
    });
  });

  // Ham drawer toggler
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });

  // Global redirection action anchors (e.g. PLAY NOW triggers, Hub redirects)
  document.querySelectorAll('.action-play-now').forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      navigateTo('screen-hub');
    });
  });

  document.querySelectorAll('.action-explore').forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      navigateTo('screen-about');
    });
  });

  document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => {
      playSound('click');
      const target = card.getAttribute('data-target');
      navigateTo(target);
    });
  });

  document.querySelectorAll('.nav-trigger').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-target');
      navigateTo(target);
    });
  });

  // ==========================================================================
  // 3. CANVAS NEURAL PARTICLE WEB ENGINE
  // ==========================================================================
  const canvas = document.getElementById('neural-bg');
  const ctx = canvas.getContext('2d');

  let particles = [];
  const mouse = { x: null, y: null, radius: 150 };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.size = Math.random() * 2 + 1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.45)';
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce borders
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      // Dodge mouse interaction
      if (mouse.x != null && mouse.y != null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = forceDirectionX * force * 1.5;
          const directionY = forceDirectionY * force * 1.5;
          
          this.x += directionX;
          this.y += directionY;
        }
      }
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 18000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Animate lines and nodes
    for (let i = 0; i < particles.length; i++) {
      particles[i].draw();
      particles[i].update();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          
          const alpha = (110 - distance) / 110 * 0.15;
          ctx.strokeStyle = `rgba(112, 0, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ==========================================================================
  // 4. MEMORY CHALLENGE MODULE (Memory Nexus - Screen 6)
  // Simon Says sequential logic game with level mechanics
  // ==========================================================================
  const startMemoryBtn = document.getElementById('start-memory-btn');
  const memoryGridBoard = document.getElementById('memory-grid-board');
  const memLevelVal = document.getElementById('mem-level');
  const memBestVal = document.getElementById('mem-best');
  const memMessage = document.getElementById('mem-message');
  const memDiffSelectors = document.querySelectorAll('#screen-memory .diff-btn');

  let memSequence = [];
  let memPlayerSequence = [];
  let memLevel = 1;
  let memHighScore = 0;
  let memActiveNodeCount = 4;
  let memIsPlayingPattern = false;

  // Grid dimensions selectors
  memDiffSelectors.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      memDiffSelectors.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const gridCount = parseInt(btn.getAttribute('data-grid'));
      setupMemoryGrid(gridCount);
    });
  });

  function setupMemoryGrid(count) {
    memActiveNodeCount = count;
    memoryGridBoard.innerHTML = '';
    
    if (count === 4) {
      memoryGridBoard.className = 'memory-grid grid-2x2';
    } else {
      memoryGridBoard.className = 'memory-grid grid-3x3';
    }

    for (let i = 0; i < count; i++) {
      const node = document.createElement('div');
      node.className = 'memory-node';
      node.setAttribute('data-index', i);
      node.addEventListener('click', () => handleMemoryNodeClick(i));
      memoryGridBoard.appendChild(node);
    }
    resetMemoryGame();
  }

  function resetMemoryGame() {
    memSequence = [];
    memPlayerSequence = [];
    memLevel = 1;
    memIsPlayingPattern = false;
    memLevelVal.innerText = `Level 1`;
    memMessage.innerText = `READY TO INITIATE. CONFIGURATION SET FOR ${memActiveNodeCount} CELLS.`;
  }

  function handleMemoryNodeClick(index) {
    if (memIsPlayingPattern || memSequence.length === 0) return;
    
    // Play light tone
    const soundKey = `flash${(index % 4) + 1}`;
    playSound(soundKey);
    
    flashNode(index);
    memPlayerSequence.push(index);

    const currentIndex = memPlayerSequence.length - 1;
    
    // Match logic
    if (memPlayerSequence[currentIndex] !== memSequence[currentIndex]) {
      // Game over
      playSound('fail');
      memMessage.innerText = `SYNAPTIC ANOMALY IN CELL CHAIN. SEQUENCE FAILED AT INDEX ${currentIndex + 1}.`;
      resetMemoryGame();
      return;
    }

    if (memPlayerSequence.length === memSequence.length) {
      // Completed level sequence successfully!
      memIsPlayingPattern = true;
      memLevel++;
      if (memLevel > memHighScore) {
        memHighScore = memLevel - 1;
        memBestVal.innerText = memHighScore;
        // Evaluate memory achievement threshold
        if (memHighScore >= 5) {
          unlockAchievement('memory-master');
        }
      }
      
      // Increment Operator XP
      incrementXP(150);

      memLevelVal.innerText = `Level ${memLevel}`;
      memMessage.innerText = `TRANSMISSION SYNCHRONIZED. ACCELERATING NODE GRID PATTERN...`;
      
      setTimeout(() => {
        generateNextPatternStep();
      }, 1000);
    }
  }

  function generateNextPatternStep() {
    memPlayerSequence = [];
    // Add new random node to step
    const nextNodeIndex = Math.floor(Math.random() * memActiveNodeCount);
    memSequence.push(nextNodeIndex);
    playPattern();
  }

  function playPattern() {
    memIsPlayingPattern = true;
    let stepIndex = 0;
    
    const interval = setInterval(() => {
      const nodeIndex = memSequence[stepIndex];
      const soundKey = `flash${(nodeIndex % 4) + 1}`;
      playSound(soundKey);
      flashNode(nodeIndex);
      
      stepIndex++;
      if (stepIndex >= memSequence.length) {
        clearInterval(interval);
        memIsPlayingPattern = false;
        memMessage.innerText = `MATCH RECURSIVE PATTERN MATRIX NOW.`;
      }
    }, 600);
  }

  function flashNode(index) {
    const node = memoryGridBoard.children[index];
    if (node) {
      node.classList.add('flash');
      setTimeout(() => {
        node.classList.remove('flash');
      }, 300);
    }
  }

  startMemoryBtn.addEventListener('click', () => {
    playSound('click');
    resetMemoryGame();
    generateNextPatternStep();
  });

  // Initialize standard 2x2 board first
  setupMemoryGrid(4);

  // ==========================================================================
  // 5. DECRYPTION LOGIC ARENA MODULE (Logic Arena - Screen 7)
  // Deductive numeric guessing puzzle with intelligent AI assistant hints
  // ==========================================================================
  const logicHistoryLog = document.getElementById('logic-history-log');
  const logicAttempts = document.getElementById('logic-attempts');
  const logicHintsCount = document.getElementById('logic-hints-count');
  const logicAdvisorText = document.getElementById('logic-advisor-text');
  const transmitGuessBtn = document.getElementById('submit-guess-btn');
  const requestHintBtn = document.getElementById('logic-hint-btn');
  const rekeyCoreBtn = document.getElementById('reset-logic-btn');

  let secretCode = [];
  let remainingAttempts = 8;
  let hintsLeft = 3;
  
  // Set up inputs navigation auto-focus
  const logicInputs = [
    document.getElementById('l-input-1'),
    document.getElementById('l-input-2'),
    document.getElementById('l-input-3'),
    document.getElementById('l-input-4')
  ];

  logicInputs.forEach((input, index) => {
    input.addEventListener('keyup', (e) => {
      if (e.target.value.length === 1 && index < 3) {
        logicInputs[index + 1].focus();
      }
    });
  });

  function generateSecretCode() {
    const digits = ['1','2','3','4','5','6','7','8','9'];
    secretCode = [];
    for (let i = 0; i < 4; i++) {
      const randIndex = Math.floor(Math.random() * digits.length);
      secretCode.push(digits[randIndex]);
      digits.splice(randIndex, 1); // no duplicates
    }
    console.log("Xephora Engine Core Key:", secretCode.join(''));
  }

  function rekeyMainframe() {
    generateSecretCode();
    remainingAttempts = 8;
    hintsLeft = 3;
    logicAttempts.innerText = remainingAttempts;
    logicHintsCount.innerText = `${hintsLeft} Left`;
    logicHistoryLog.innerHTML = `<div class="history-placeholder">NO DECRYPTION GUESSES RECORDED. SYSTEM IS SECURED.</div>`;
    logicAdvisorText.innerText = `Awaiting transmission. Enter your 4-digit guess using digits 1-9 to trigger system profiling feedback loop.`;
    logicInputs.forEach(input => input.value = '');
    logicInputs[0].focus();
  }

  function evaluateTransmitGuess() {
    const guess = logicInputs.map(input => input.value.trim());
    
    // Validate guess structure
    if (guess.some(digit => digit === '' || isNaN(digit) || digit === '0')) {
      alert("Invalid decryption matrix array. Complete all 4 digit cells with 1-9.");
      return;
    }

    if (new Set(guess).size !== 4) {
      alert("System security forbids duplicate diagnostic numbers.");
      return;
    }

    playSound('click');
    remainingAttempts--;
    logicAttempts.innerText = remainingAttempts;

    // Clear history placeholder
    const placeholder = logicHistoryLog.querySelector('.history-placeholder');
    if (placeholder) placeholder.remove();

    let hits = 0;
    let nears = 0;

    for (let i = 0; i < 4; i++) {
      if (guess[i] === secretCode[i]) {
        hits++;
      } else if (secretCode.includes(guess[i])) {
        nears++;
      }
    }

    // Append to log history
    const logNode = document.createElement('div');
    logNode.className = 'log-entry';
    logNode.innerHTML = `
      <span class="log-code">${guess.join(' ')}</span>
      <div class="log-outcome">
        <span class="outcome-dot hit">HITS: ${hits}</span>
        <span class="outcome-dot near">NEARS: ${nears}</span>
      </div>
    `;
    logicHistoryLog.prepend(logNode);

    // Evaluate Win State
    if (hits === 4) {
      playSound('win');
      logicAdvisorText.innerText = `ACCESS GRANTED! SECURITY BLOCK SECURED. CORE COGNITIVE TRANSMISSION SYNCHRONIZED.`;
      logicAdvisorText.style.color = "#39ff14";
      incrementXP(500);
      unlockAchievement('logic-decrypter');
      return;
    }

    // Evaluate Lose State
    if (remainingAttempts === 0) {
      playSound('fail');
      logicAdvisorText.innerText = `LOCKOUT INITIATED. CORE KEY CHANGED. CORRECT SEQUENCE WAS [${secretCode.join('')}].`;
      logicAdvisorText.style.color = "#ff007b";
      return;
    }

    // Standard profiling guidance
    logicAdvisorText.innerText = `Analyzing data... Pass code yielded hits: ${hits}, nears: ${nears}. Shift vector offsets.`;
    logicAdvisorText.style.color = "";
    
    // Clear inputs and refocus
    logicInputs.forEach(input => input.value = '');
    logicInputs[0].focus();
  }

  function handleAdvisorHint() {
    if (hintsLeft <= 0) {
      alert("Mainframe limits exceeded. Synaptic advice links are depleted.");
      return;
    }
    
    playSound('click');
    hintsLeft--;
    logicHintsCount.innerText = `${hintsLeft} Left`;

    // Dynamic AI logic generation based on core key parameters
    const hintSelection = Math.floor(Math.random() * 3);
    let hintMessage = "";

    if (hintSelection === 0) {
      // Find an actual number in key
      const randIdx = Math.floor(Math.random() * 4);
      hintMessage = `MAINFAST TELEMETRY: Digit ${secretCode[randIdx]} belongs in the active sequence matrix.`;
    } else if (hintSelection === 1) {
      // Evens or odds parameters
      const evensCount = secretCode.filter(digit => parseInt(digit) % 2 === 0).length;
      hintMessage = `COGNITIVE STRUCT: Mainframe sequence contains precisely ${evensCount} even-numbered digits.`;
    } else {
      // Excludes checking numbers
      const nonExistent = ['1','2','3','4','5','6','7','8','9'].filter(digit => !secretCode.includes(digit));
      const chosen = nonExistent[Math.floor(Math.random() * nonExistent.length)];
      hintMessage = `SYNAPSE EXCLUSION: Digit ${chosen} does not exist in the secure registry pattern.`;
    }

    logicAdvisorText.innerText = hintMessage;
  }

  transmitGuessBtn.addEventListener('click', evaluateTransmitGuess);
  requestHintBtn.addEventListener('click', handleAdvisorHint);
  rekeyCoreBtn.addEventListener('click', rekeyMainframe);

  // Initialize Logic core
  generateSecretCode();

  // ==========================================================================
  // 6. SOLVABLE SLIDING PUZZLE MODULE (Number Rush - Screen 8)
  // Fully playable 15-puzzle with move counters and time grids
  // ==========================================================================
  const puzzleGridBoard = document.getElementById('puzzle-grid-board');
  const puzzleMovesVal = document.getElementById('puzzle-moves');
  const puzzleTimerVal = document.getElementById('puzzle-timer');
  const scramblePuzzleBtn = document.getElementById('scramble-puzzle-btn');
  const puzzleFeedback = document.getElementById('puzzle-feedback');

  let puzzleState = []; // 0 signifies blank slot
  let puzzleMoves = 0;
  let puzzleTime = 0;
  let puzzleTimerInterval = null;

  function initPuzzle() {
    puzzleState = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    puzzleMoves = 0;
    puzzleMovesVal.innerText = puzzleMoves;
    clearInterval(puzzleTimerInterval);
    puzzleTime = 0;
    puzzleTimerVal.innerText = "00:00";
    puzzleFeedback.innerText = `RECONSTRUCT THE 1 TO 15 GRID MATRIX.`;
    puzzleFeedback.style.color = "";
    
    renderPuzzleGrid();
  }

  function renderPuzzleGrid() {
    puzzleGridBoard.innerHTML = '';
    
    puzzleState.forEach((num, index) => {
      const tile = document.createElement('div');
      if (num === 0) {
        tile.className = 'puzzle-tile empty';
      } else {
        tile.className = 'puzzle-tile';
        tile.innerText = num;
        tile.addEventListener('click', () => handlePuzzleTileClick(index));
      }
      puzzleGridBoard.appendChild(tile);
    });
  }

  function handlePuzzleTileClick(index) {
    const emptyIndex = puzzleState.indexOf(0);
    
    const tileRow = Math.floor(index / 4);
    const tileCol = index % 4;
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;

    const dx = Math.abs(tileRow - emptyRow);
    const dy = Math.abs(tileCol - emptyCol);

    // Tile is neighbor of blank (dx + dy == 1)
    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      playSound('click');
      
      // Swap elements
      puzzleState[emptyIndex] = puzzleState[index];
      puzzleState[index] = 0;
      
      puzzleMoves++;
      puzzleMovesVal.innerText = puzzleMoves;

      // Start timer on first move
      if (puzzleMoves === 1) {
        startPuzzleTimer();
      }

      renderPuzzleGrid();
      checkPuzzleVictory();
    }
  }

  function startPuzzleTimer() {
    clearInterval(puzzleTimerInterval);
    puzzleTime = 0;
    puzzleTimerInterval = setInterval(() => {
      puzzleTime++;
      const mins = String(Math.floor(puzzleTime / 60)).padStart(2, '0');
      const secs = String(puzzleTime % 60).padStart(2, '0');
      puzzleTimerVal.innerText = `${mins}:${secs}`;
    }, 1000);
  }

  function shufflePuzzleState() {
    // Perform random legal swaps to ensure solvability
    for (let i = 0; i < 150; i++) {
      const emptyIndex = puzzleState.indexOf(0);
      const possibleSwaps = [];
      
      const emptyRow = Math.floor(emptyIndex / 4);
      const emptyCol = emptyIndex % 4;

      if (emptyRow > 0) possibleSwaps.push(emptyIndex - 4); // Up
      if (emptyRow < 3) possibleSwaps.push(emptyIndex + 4); // Down
      if (emptyCol > 0) possibleSwaps.push(emptyIndex - 1); // Left
      if (emptyCol < 3) possibleSwaps.push(emptyIndex + 1); // Right

      const chosenSwap = possibleSwaps[Math.floor(Math.random() * possibleSwaps.length)];
      
      puzzleState[emptyIndex] = puzzleState[chosenSwap];
      puzzleState[chosenSwap] = 0;
    }

    puzzleMoves = 0;
    puzzleMovesVal.innerText = puzzleMoves;
    clearInterval(puzzleTimerInterval);
    puzzleTime = 0;
    puzzleTimerVal.innerText = "00:00";
    puzzleFeedback.innerText = `MATRIX DISPLACED! TIMER VECTOR WILL BEGIN UPON THE FIRST TRANSLATION.`;
    puzzleFeedback.style.color = "";

    renderPuzzleGrid();
  }

  function checkPuzzleVictory() {
    const isWon = puzzleState.slice(0, 15).every((num, i) => num === i + 1);
    if (isWon) {
      clearInterval(puzzleTimerInterval);
      playSound('win');
      puzzleFeedback.innerText = `NEXUS SYSTEM SHIFT SUCCESSFUL! DIMENSIONAL BLOCKS TRANSLATED.`;
      puzzleFeedback.style.color = "#39ff14";
      
      incrementXP(800);
      
      if (puzzleMoves < 30) {
        unlockAchievement('number-speedrun');
      }
    }
  }

  scramblePuzzleBtn.addEventListener('click', () => {
    playSound('click');
    shufflePuzzleState();
  });

  // Init standard sliding board
  initPuzzle();

  // ==========================================================================
  // 7. STRATEGY MISSIONS arena PREVIEW LOADERS (Screen 9)
  // ==========================================================================
  const missionCards = document.querySelectorAll('.mission-card');
  const oppNameText = document.getElementById('opp-name');
  const oppDiffText = document.getElementById('opp-diff');
  const launchTacticalBtn = document.getElementById('launch-tactical-match');

  missionCards.forEach(card => {
    card.addEventListener('click', () => {
      // Avoid locked cards
      if (card.querySelector('.locked')) {
        alert("Sector Node secure firewall active. Elevate Synaptic Levels to gain access permissions.");
        return;
      }
      
      playSound('click');
      missionCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const opponent = card.getAttribute('data-opponent');
      const difficulty = card.getAttribute('data-difficulty');

      oppNameText.innerText = opponent;
      oppDiffText.innerText = `COGNITIVE COMPONENT: ${difficulty.toUpperCase()} AI RADIAL`;
    });
  });

  launchTacticalBtn.addEventListener('click', () => {
    playSound('click');
    alert("Synthesizing local strategic simulation sandbox... Target sector grid vector deployed!");
  });

  // ==========================================================================
  // 8. MULTIPLAYER MATCHMAKING SIMULATOR MODULE (Screen 10)
  // Simulates joining real-time synchronization rooms
  // ==========================================================================
  const quickMatchBtn = document.getElementById('quick-match-btn');
  const matchmakerTimer = document.getElementById('matchmaker-timer');

  quickMatchBtn.addEventListener('click', () => {
    playSound('click');
    
    if (State.matchmaking.inQueue) {
      // Cancel matchmaking queue
      clearInterval(State.matchmaking.timer);
      State.matchmaking.inQueue = false;
      quickMatchBtn.querySelector('.btn-text').innerText = "INITIATE MATCHMAKING";
      matchmakerTimer.innerText = "OFFLINE";
      matchmakerTimer.style.color = "";
    } else {
      // Start matchmaking queue simulation
      State.matchmaking.inQueue = true;
      State.matchmaking.seconds = 0;
      quickMatchBtn.querySelector('.btn-text').innerText = "DISCONNECT QUEUE";
      matchmakerTimer.style.color = "#00f0ff";
      
      State.matchmaking.timer = setInterval(() => {
        State.matchmaking.seconds++;
        const mins = String(Math.floor(State.matchmaking.seconds / 60)).padStart(2, '0');
        const secs = String(State.matchmaking.seconds % 60).padStart(2, '0');
        matchmakerTimer.innerText = `SEARCHING... ${mins}:${secs}`;
        
        // Random secure matching trigger after 5 seconds
        if (State.matchmaking.seconds === 5) {
          clearInterval(State.matchmaking.timer);
          State.matchmaking.inQueue = false;
          playSound('win');
          matchmakerTimer.innerText = "MATCH SECURED!";
          matchmakerTimer.style.color = "#39ff14";
          quickMatchBtn.querySelector('.btn-text').innerText = "INITIATE MATCHMAKING";
          
          setTimeout(() => {
            alert("Lobby secured: Entering #TURING-239 arena with Divergent Mind!");
          }, 600);
        }
      }, 1000);
    }
  });

  // Join private table items
  document.querySelectorAll('.join-room-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      const row = btn.closest('tr');
      const roomId = row.cells[0].innerText;
      alert(`Synchronizing interface vector with room ${roomId}... Connect established.`);
    });
  });

  // ==========================================================================
  // 9. FAQ ACCORDION ENGINE
  // ==========================================================================
  const accordions = document.querySelectorAll('.accordion-header');

  accordions.forEach(header => {
    header.addEventListener('click', () => {
      playSound('click');
      const parent = header.parentElement;
      const isActive = parent.classList.contains('active');
      
      // Close all others
      document.querySelectorAll('.accordion-item').forEach(item => item.classList.remove('active'));
      
      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });

  // ==========================================================================
  // 10. DYNAMIC AI CHAT ASSISTANT SUPPORT MODEL (Screen 19)
  // Smart support chat box answering tactical gaming questions
  // ==========================================================================
  const sendChatBtn = document.getElementById('send-chat-btn');
  const chatInput = document.getElementById('chat-input');
  const aiChatLog = document.getElementById('ai-chat-log');

  function transmitChatMessage() {
    const text = chatInput.value.trim();
    if (text === '') return;

    playSound('click');
    chatInput.value = '';

    // Append operator message
    appendChatBubble('OPERATOR_X', text, 'user');

    // Trigger loading reply
    setTimeout(() => {
      const response = generateAIAnswer(text);
      appendChatBubble('SYSTEM_CORE', response, 'system');
      playSound('flash4');
    }, 850);
  }

  function appendChatBubble(sender, content, className) {
    const bubble = document.createElement('div');
    bubble.className = `chat-message ${className}`;
    bubble.innerHTML = `
      <span class="sender">${sender}:</span>
      <p>${content}</p>
    `;
    aiChatLog.appendChild(bubble);
    aiChatLog.scrollTop = aiChatLog.scrollHeight;
  }

  function generateAIAnswer(input) {
    const query = input.toLowerCase();
    
    if (query.includes('memory') || query.includes('nexus')) {
      return "Memory Nexus measures visual indexing speeds. TIP: Try chunking flashing patterns in visual pairs rather than single entities to maximize retention index thresholds.";
    }
    if (query.includes('logic') || query.includes('decrypt')) {
      return "Logic Arena is a numeric variant of standard decryption. If you receive Hits, numbers are perfectly centered. Use AI hints to rule out non-existent parameters!";
    }
    if (query.includes('number') || query.includes('rush') || query.includes('puzzle')) {
      return "Number Rush translates scrambled matrix indexes. Focus on aligning the top horizontal row (1-4) first, then proceed down coordinates block-by-block.";
    }
    if (query.includes('upgrade') || query.includes('premium') || query.includes('pricing')) {
      return "Upgrade pathways activate double XP multipliers and fully adapt the adaptive difficulty thresholds. Enter the PREMIUM PLANS node in your controller sidebar to learn more.";
    }
    if (query.includes('latency') || query.includes('ping')) {
      return "Your synchronization is running locally inside your secure workspace pipeline. Synaptic response loops operate at less than 15ms latency benchmarks.";
    }
    
    return "Synaptic request parsed. I suggest engaging our mini-games dashboard vectors: Memory Nexus, Logic Arena, or Number Rush to maximize cognitive score profiling.";
  }

  sendChatBtn.addEventListener('click', transmitChatMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      transmitChatMessage();
    }
  });

  // ==========================================================================
  // 11. CHECKOUT MODAL & SUBSCRIPTIONS SIMULATOR (Screen 18)
  // ==========================================================================
  const checkoutModal = document.getElementById('checkout-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalPlanName = document.getElementById('modal-plan-name');
  const modalPlanPrice = document.getElementById('modal-plan-price');
  const paymentForm = document.getElementById('checkout-payment-form');

  document.querySelectorAll('.checkout-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      const plan = btn.getAttribute('data-plan');
      const price = btn.getAttribute('data-price');
      
      modalPlanName.innerText = plan;
      modalPlanPrice.innerText = `${price} / MONTH`;
      checkoutModal.classList.remove('hidden');
    });
  });

  closeModalBtn.addEventListener('click', () => {
    playSound('click');
    checkoutModal.classList.add('hidden');
  });

  paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    playSound('win');
    alert("QUANTUM CHANNEL AUTHORIZED! SUBNET CREDENTIALS UPGRADED. WELCOME TO ADVANCED AI PROTOCOLS.");
    checkoutModal.classList.add('hidden');
  });

  // ==========================================================================
  // 12. TELEMETRY LEVEL & XP CORE CALCULATOR
  // Updates XP parameters instantly across dashboards and sidebars
  // ==========================================================================
  function incrementXP(amount) {
    State.user.xp += amount;
    
    if (State.user.xp >= State.user.maxXp) {
      State.user.level++;
      State.user.xp = State.user.xp - State.user.maxXp;
      
      // Update UI levels
      document.querySelectorAll('.user-brief-rank').forEach(el => {
        el.innerText = `SYNAPTIC LEVEL ${State.user.level}`;
      });
      triggerLevelUpNotification();
    }

    // Refresh Dashboard stats
    updateDashboardTelemetryUI();
  }

  function updateDashboardTelemetryUI() {
    const xpLabels = document.querySelector('.xp-labels span:first-child');
    const xpLevelLvl = document.querySelector('.xp-labels span:last-child');
    const xpFill = document.querySelector('.xp-bar-fill');

    if (xpLabels) xpLabels.innerText = `XP progress: ${State.user.xp} / ${State.user.maxXp}`;
    if (xpLevelLvl) xpLevelLvl.innerText = `Lvl ${State.user.level}`;
    if (xpFill) {
      const percentage = (State.user.xp / State.user.maxXp) * 100;
      xpFill.style.width = `${percentage}%`;
    }
  }

  function unlockAchievement(id) {
    const achCard = document.getElementById(`ach-${id}`);
    if (achCard && achCard.classList.contains('locked')) {
      achCard.classList.remove('locked');
      achCard.classList.add('unlocked');
      
      const label = document.getElementById(`ach-${id === 'memory-master' ? 'mem' : id === 'logic-decrypter' ? 'log' : 'num'}-lbl`);
      if (label) {
        label.innerText = "UNLOCKED";
        label.className = "ach-status-badge unlocked";
      }
      
      // Notify
      triggerNotification("🏆 NEW ACHIEVEMENT UNLOCKED!", `Credentials grid updated with specialized badge.`);
    }
  }

  // ==========================================================================
  // 13. AI RECOMMENDATION GENERATOR ENGINE (Screen 11)
  // ==========================================================================
  const generateRecBtn = document.getElementById('generate-rec-btn');
  const aiRecText = document.getElementById('ai-rec-text');

  generateRecBtn.addEventListener('click', () => {
    playSound('click');
    aiRecText.innerText = "Parsing synaptic profiles...";
    
    setTimeout(() => {
      const recommendList = [
        "Your deduction matrix is running at peak capacity. We recommend trying **Number Rush** to boost spatial reordering speeds.",
        "Working memory limits show huge recovery vectors. Engage **Logic Arena** to strengthen complex hypothesis formulation.",
        "Tactical indicators point to minor delay models in sequences. Continue calibration on **Memory Nexus** to balance indexes."
      ];
      aiRecText.innerHTML = recommendList[Math.floor(Math.random() * recommendList.length)];
      playSound('win');
    }, 600);
  });

  // ==========================================================================
  // 14. CUSTOM SYSTEM NOTIFICATIONS PANEL LOGIC
  // ==========================================================================
  function triggerWelcomeNotif() {
    setTimeout(() => {
      triggerNotification("🌐 NEXUS LINK ONLINE", "Operator welcome sequence authorized. Tap gaming hub nodes to begin cognitive exercises.");
    }, 1000);
  }

  function triggerLevelUpNotification() {
    playSound('win');
    triggerNotification("🚀 SYNAPTIC EVOLUTION COMPLETED!", `Congratulations, Operator! Cognitive rating progressed to Level ${State.user.level}.`);
  }

  function triggerNotification(title, message) {
    // Generate simple floating cyber toast notification
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = 'rgba(13, 6, 27, 0.95)';
    toast.style.border = '1px solid #00f0ff';
    toast.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.4)';
    toast.style.borderRadius = '8px';
    toast.style.padding = '16px 20px';
    toast.style.zIndex = '999999';
    toast.style.maxWidth = '320px';
    toast.style.animation = 'fadeIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
    toast.style.pointerEvents = 'auto';

    toast.innerHTML = `
      <div style="font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: 700; color: #00f0ff; margin-bottom: 6px; letter-spacing: 1px;">${title}</div>
      <div style="font-size: 12px; color: #d0c8db; line-height: 1.4;">${message}</div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'all 0.5s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 500);
    }, 4500);
  }

});
