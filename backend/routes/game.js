const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const GameScore = require('../models/GameScore');

// @route   POST api/game/score
// @desc    Submit a newly achieved score, update player levels, XP, and badges
// @access  Private
router.post('/score', auth, async (req, res) => {
  const { gameMode, score, levelReached, moves, duration } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Operator profile not found.' });
    }

    // 1. Create and Save GameScore log
    const gameScore = new GameScore({
      userId: user.id,
      gameMode,
      score,
      levelReached,
      moves,
      duration
    });
    await gameScore.save();

    // 2. Telemetry calculations: Increment cumulative stats
    user.solvedCount += 1;
    user.score += parseInt(score);

    // Calculate dynamic accuracy index based on moves/duration ranges
    let accuracyFactor = 95;
    if (gameMode === 'Logic Arena' && moves > 4) {
      accuracyFactor = Math.max(50, 95 - (moves - 4) * 8);
    } else if (gameMode === 'Number Rush' && moves > 30) {
      accuracyFactor = Math.max(40, 95 - (moves - 30) * 1.5);
    }
    user.accuracy = Math.round((user.accuracy * 0.7) + (accuracyFactor * 0.3));

    // 3. Dynamic XP Engine
    // Average baseline score XP gains
    let xpGain = Math.floor(score * 0.5) + 100;
    user.xp += xpGain;

    // Check level up (10,000 XP per synaptic level)
    let leveledUp = false;
    const maxXp = 10000;
    while (user.xp >= maxXp) {
      user.level += 1;
      user.xp -= maxXp;
      leveledUp = true;
    }

    // 4. Badges / Achievements Unlock Checker
    const newlyUnlockedBadges = [];
    
    if (gameMode === 'Memory Nexus' && levelReached >= 5 && !user.unlockedBadges.includes('memory-master')) {
      user.unlockedBadges.push('memory-master');
      newlyUnlockedBadges.push('memory-master');
    }
    
    if (gameMode === 'Logic Arena' && moves <= 4 && !user.unlockedBadges.includes('logic-decrypter')) {
      user.unlockedBadges.push('logic-decrypter');
      newlyUnlockedBadges.push('logic-decrypter');
    }

    if (gameMode === 'Number Rush' && moves <= 30 && !user.unlockedBadges.includes('number-speedrun')) {
      user.unlockedBadges.push('number-speedrun');
      newlyUnlockedBadges.push('number-speedrun');
    }

    await user.save();

    res.json({
      msg: 'Telemetry data synchronized successfully.',
      score: gameScore,
      xpGain,
      leveledUp,
      newLevel: user.level,
      newlyUnlockedBadges,
      user: {
        id: user.id,
        username: user.username,
        level: user.level,
        xp: user.xp,
        score: user.score,
        accuracy: user.accuracy,
        solvedCount: user.solvedCount,
        unlockedBadges: user.unlockedBadges
      }
    });

  } catch (err) {
    console.error("Game score submit error:", err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/game/history
// @desc    Get current user's score log history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const scores = await GameScore.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(scores);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
