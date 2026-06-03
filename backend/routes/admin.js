const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Helper middleware to check if user has admin privileges
async function verifyAdmin(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ msg: 'Access Denied: Administrative privileges required' });
    }
    next();
  } catch (err) {
    res.status(500).send('Server Error');
  }
}

// @route   GET api/admin/users
// @desc    Retrieve all registered user accounts for management
// @access  Private (Admin Only)
router.get('/users', auth, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("Admin fetch users error:", err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/admin/user/:id/role
// @desc    Update a user's role (promote/demote)
// @access  Private (Admin Only)
router.put('/user/:id/role', auth, verifyAdmin, async (req, res) => {
  const { role } = req.body;
  if (!['USER', 'ADMIN'].includes(role)) {
    return res.status(400).json({ msg: 'Invalid role assignment' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/admin/user/:id
// @desc    Delete a user profile from the database
// @access  Private (Admin Only)
router.delete('/user/:id', auth, verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User account removed from nexus database.' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
