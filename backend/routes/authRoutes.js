const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Test route to check if auth routes are loaded
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working', timestamp: new Date().toISOString() });
});

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router; 