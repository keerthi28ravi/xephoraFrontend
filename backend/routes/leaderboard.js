const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET api/leaderboard
// @desc    Retrieve dynamic leaderboard standings
// @access  Public
router.post('/', async (req, res) => {
  const { subnet } = req.body; // Subnet filter (e.g. 'GLOBAL', 'LOCAL')
  
  try {
    let query = {};
    // Mocks subnet logic (Users are mapped to subdivisions organically in leaderboard screens)
    if (subnet && subnet !== 'GLOBAL') {
      // Return a simulated localized subnet subset of the leaderboard
    }

    const leaders = await User.find(query)
      .select('username level score unlockedBadges')
      .sort({ score: -1 })
      .limit(10);

    res.json(leaders);
  } catch (err) {
    console.error("Leaderboard fetch error:", err.message);
    res.status(500).send('Server Error');
  }
});

// Fallback GET route
router.get('/', async (req, res) => {
  try {
    const leaders = await User.find()
      .select('username level score unlockedBadges')
      .sort({ score: -1 })
      .limit(10);
    res.json(leaders);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
