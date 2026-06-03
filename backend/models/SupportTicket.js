const mongoose = require('mongoose');

const SupportTicketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  email: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['GAMEPLAY', 'BILLING', 'ACCESS', 'OTHER'],
    default: 'GAMEPLAY'
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['OPEN', 'RESOLVED'],
    default: 'OPEN'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SupportTicket', SupportTicketSchema);
