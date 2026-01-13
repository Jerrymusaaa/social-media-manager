const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

// Generate caption (protected route)
router.post('/generate-caption', auth, aiController.generateCaption);

// Regenerate caption (protected route)
router.post('/regenerate-caption', auth, aiController.regenerateCaption);

module.exports = router;