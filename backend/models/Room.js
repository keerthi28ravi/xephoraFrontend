const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  gameMode: {
    type: String,
    required: true
  },
  playerCount: {
    type: Number,
    default: 1
  },
  maxPlayers: {
    type: Number,
    default: 2
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  ping: {
    type: String,
    default: '25ms'
  },
  status: {
    type: String,
    enum: ['WAITING', 'ACTIVE', 'COMPLETED'],
    default: 'WAITING'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Room', RoomSchema);
