const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Email is already registered' });
    }

    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'Username is already taken' });
    }

    user = new User({ username, email, password });
    await user.save();

    // Create JWT Token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'xephora_neural_nexus_secret_key_2026_synaptic_matrix',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            level: user.level,
            xp: user.xp,
            score: user.score,
            accuracy: user.accuracy,
            solvedCount: user.solvedCount,
            unlockedBadges: user.unlockedBadges
          }
        });
      }
    );
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'xephora_neural_nexus_secret_key_2026_synaptic_matrix',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            level: user.level,
            xp: user.xp,
            score: user.score,
            accuracy: user.accuracy,
            solvedCount: user.solvedCount,
            unlockedBadges: user.unlockedBadges
          }
        });
      }
    );
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/auth/verify
// @desc    Get user by token
// @access  Private
router.get('/verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/forgot-password
// @desc    Initiate OTP reset verification
// @access  Public
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'No operator found with that email context' });
    }
    // Mocks OTP creation (In a production loop this will execute nodemailer email routes)
    res.json({ msg: 'Synaptic OTP code 123456 routed to operator mail feed successfully.' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/verify-otp
// @desc    Check mock OTP code values
// @access  Public
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (otp === '123456') {
    res.json({ msg: 'Security OTP verified successfully.', token: 'otp_authorized_handshake_key_902' });
  } else {
    res.status(400).json({ msg: 'Invalid security code sequence.' });
  }
});

// @route   POST api/auth/reset-password
// @desc    Reset password with validated OTP handshake
// @access  Public
router.post('/reset-password', async (req, res) => {
  const { email, newPassword, token } = req.body;
  
  if (token !== 'otp_authorized_handshake_key_902') {
    return res.status(403).json({ msg: 'Unauthorized password reset request.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'Operator not found.' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ msg: 'Core security credentials updated successfully.' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
