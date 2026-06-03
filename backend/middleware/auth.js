const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from headers
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Expect header format: Bearer <token>
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ msg: 'Token format is invalid. Use Bearer <token>' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'xephora_neural_nexus_secret_key_2026_synaptic_matrix');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
