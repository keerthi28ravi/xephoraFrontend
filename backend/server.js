const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Body parser

// REST API Routes integration
app.use('/api/auth', require('./routes/auth'));
app.use('/api/game', require('./routes/game'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/multiplayer', require('./routes/multiplayer'));
app.use('/api/support', require('./routes/support'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/tournaments', require('./routes/tournaments'));

// Base Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'XEPHORA NEURAL STRATEGY NEXUS API SERVER',
    timestamp: new Date()
  });
});

// Port and MongoDB setup
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/xephora';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('>>> MONGODB CONNECTION SYNCHRONIZED SUCCESSFUL.');
    app.listen(PORT, () => {
      console.log(`>>> XEPHORA SYSTEM IS LISTENING ON PORT ${PORT}`);
    });
  })
  .catch(err => {
    console.error('>>> DATABASE ANOMALY - MONGODB CONNECTION FAILED:', err.message);
    
    // Server startup fallback for testing environment in case MongoDB is missing local services
    console.log('>>> STANDBY SYSTEM STARTUP COMPLETED IN DIAGNOSTIC MODE.');
    app.listen(PORT, () => {
      console.log(`>>> XEPHORA DIAGNOSTIC MODE ENGINE ACTIVE ON PORT ${PORT}`);
    });
  });
