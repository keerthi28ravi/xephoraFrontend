const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Room = require('../models/Room');

// @route   GET api/multiplayer/rooms
// @desc    Retrieve active matching rooms lobby
// @access  Private
router.get('/rooms', auth, async (req, res) => {
  try {
    let rooms = await Room.find({ status: 'WAITING' });
    
    // Seed default rooms to populate lobby if empty
    if (rooms.length === 0) {
      rooms = [
        new Room({ roomId: '#TURING-239', gameMode: 'Memory Nexus', playerCount: 1, maxPlayers: 2, ping: '14ms' }),
        new Room({ roomId: '#QUANTUM-902', gameMode: 'Number Rush', playerCount: 3, maxPlayers: 4, ping: '28ms' }),
        new Room({ roomId: '#COGNITIVE-44', gameMode: 'Logic Arena', playerCount: 1, maxPlayers: 2, ping: '11ms' })
      ];
      await Room.insertMany(rooms);
    }
    
    res.json(rooms);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/multiplayer/room/create
// @desc    Create a private/public room
// @access  Private
router.post('/room/create', auth, async (req, res) => {
  const { gameMode } = req.body;
  const uniqueId = '#' + Math.random().toString(36).substring(2, 8).toUpperCase();

  try {
    const newRoom = new Room({
      roomId: uniqueId,
      gameMode,
      playerCount: 1,
      players: [req.user.id]
    });

    await newRoom.save();
    res.json(newRoom);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/multiplayer/room/join
// @desc    Join an active room
// @access  Private
router.post('/room/join', auth, async (req, res) => {
  const { roomId } = req.body;

  try {
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ msg: 'Room secure routing link not found.' });
    }

    if (room.playerCount >= room.maxPlayers) {
      return res.status(400).json({ msg: 'Room slot allocation is filled.' });
    }

    room.players.push(req.user.id);
    room.playerCount += 1;
    
    if (room.playerCount === room.maxPlayers) {
      room.status = 'ACTIVE';
    }

    await room.save();
    res.json(room);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
