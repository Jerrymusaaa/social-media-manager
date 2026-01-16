const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

// Create post (with multiple image uploads - up to 12)
router.post('/', auth, postController.upload.array('images', 12), postController.createPost);

// Get all posts
router.get('/', auth, postController.getPosts);

// Get analytics
router.get('/analytics', auth, postController.getAnalytics);

// Get single post
router.get('/:id', auth, postController.getPost);

// Update post (with multiple image uploads)
router.put('/:id', auth, postController.upload.array('images', 12), postController.updatePost);

// Delete post
router.delete('/:id', auth, postController.deletePost);

module.exports = router;