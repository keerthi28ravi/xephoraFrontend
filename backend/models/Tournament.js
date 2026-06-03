const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  prizePool: {
    type: String,
    required: true
  },
  countdownDate: {
    type: Date,
    required: true
  },
  registrants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['UPCOMING', 'ACTIVE', 'FINISHED'],
    default: 'UPCOMING'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tournament', TournamentSchema);
