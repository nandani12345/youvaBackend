// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../model/User');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if token exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if decoded contains id
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Token payload is invalid' });
    }

    // Find user by ID
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request
    req.user = user;

    // Move to next middleware/controller
    next();

  } catch (err) {
    console.error('Auth error:', err.message);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }

    return res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = auth;