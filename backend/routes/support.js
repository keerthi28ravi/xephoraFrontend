const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   POST api/support/ticket
// @desc    Submit a support ticket
// @access  Public/Private
router.post('/ticket', async (req, res) => {
  const { category, subject, message } = req.body;

  // Basic validation
  if (!subject || !message) {
    return res.status(400).json({ msg: 'Subject and message are required fields.' });
  }

  try {
    // Try to pull user email from auth token if available
    let userEmail = null;
    let userId = null;

    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'xephora_neural_nexus_secret_key_2026_synaptic_matrix');
        const user = await User.findById(decoded.user.id).select('email');
        if (user) {
          userEmail = user.email;
          userId = user._id;
        }
      } catch (e) {
        // Token invalid or missing — proceed without user
      }
    }

    const ticket = new SupportTicket({
      userId,
      email: userEmail,
      category: category || 'GAMEPLAY',
      subject,
      message,
      status: 'OPEN'
    });

    await ticket.save();
    res.json({ msg: 'Support ticket transmitted to Net Admin Core successfully.', ticket });
  } catch (err) {
    console.error('Support ticket error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/support/tickets
// @desc    Get all support tickets (admin use)
// @access  Private (Admin)
router.get('/tickets', auth, async (req, res) => {
  try {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 }).limit(50);
    res.json(tickets);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
