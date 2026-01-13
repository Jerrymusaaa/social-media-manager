const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Get current user (protected route)
router.get('/me', auth, authController.getMe);

module.exports = router;