const jwt = require('jsonwebtoken');

// JWT secret directly in code
const JWT_SECRET = '2a3c4d747321489d273d77b8ab0c3afce85878c77ab432b74ca0f5fd1905a1b6';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}; 