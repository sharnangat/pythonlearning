const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (payload, expiresIn = '7d') => {
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  return jwt.sign(payload, secret, { expiresIn });
};

// Verify JWT token
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = {
  generateToken,
  verifyToken,
};

