const express = require('express');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route working' });
});

// TODO: Add login, register routes later

module.exports = router;