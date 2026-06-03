const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tier: {
    type: String,
    enum: ['FREE', 'PLUS', 'QUANTUM'],
    default: 'FREE'
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'EXPIRED'],
    default: 'ACTIVE'
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default 30 days
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
