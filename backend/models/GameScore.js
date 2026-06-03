const mongoose = require('mongoose');

const GameScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameMode: {
    type: String,
    required: true,
    enum: ['Memory Nexus', 'Logic Arena', 'Number Rush']
  },
  score: {
    type: Number,
    required: true
  },
  levelReached: {
    type: Number,
    default: 1
  },
  moves: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0 // In seconds
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GameScore', GameScoreSchema);
