const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// List all users (optionally with search)
router.get('/', auth, userController.listUsers);

module.exports = router; 