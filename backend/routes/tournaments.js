const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const auth = require('../middleware/auth');

// @route   GET api/tournaments
// @desc    Retrieve all tournaments (with auto-seeding if empty)
// @access  Public
router.get('/', async (req, res) => {
  try {
    let list = await Tournament.find().sort({ createdAt: 1 });
    
    // Auto-seeding if empty
    if (list.length === 0) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const inThreeDays = new Date();
      inThreeDays.setDate(inThreeDays.getDate() + 3);

      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 2);

      const defaultTournaments = [
        {
          title: 'Memory Nexus Calibration Cup',
          description: 'Calibrate high-frequency patterns and establish the longest Simon sequence matching chains.',
          prizePool: '5,000 SC',
          countdownDate: tomorrow,
          status: 'ACTIVE'
        },
        {
          title: 'Logic Decryption Championship',
          description: 'Crack secure 4-digit logic encryption keys in less than 5 decryption attempts against global brackets.',
          prizePool: '12,500 SC',
          countdownDate: inThreeDays,
          status: 'UPCOMING'
        },
        {
          title: 'Number Rush Grand Prix',
          description: 'Slide puzzle displaced matrices back to corrected rows under extreme time restrictions.',
          prizePool: '20,000 SC',
          countdownDate: pastDate,
          status: 'FINISHED'
        }
      ];

      await Tournament.insertMany(defaultTournaments);
      list = await Tournament.find().sort({ createdAt: 1 });
    }

    res.json(list);
  } catch (err) {
    console.error('Tournaments fetch error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/tournaments/register/:id
// @desc    Register user for a tournament
// @access  Private
router.post('/register/:id', auth, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ msg: 'Tournament matrix not found.' });
    }

    if (tournament.status === 'FINISHED') {
      return res.status(400).json({ msg: 'Tournament has already finished.' });
    }

    // Check if already registered
    if (tournament.registrants.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Operator already registered in this subnet.' });
    }

    tournament.registrants.push(req.user.id);
    await tournament.save();

    res.json({ msg: 'Operator linked to tournament bracket successfully.', tournament });
  } catch (err) {
    console.error('Tournament registration error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
