const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

// Create post (with image upload)
router.post('/', auth, postController.upload.single('image'), postController.createPost);

// Get all posts
router.get('/', auth, postController.getPosts);

// Get analytics
router.get('/analytics', auth, postController.getAnalytics);

// Get single post
router.get('/:id', auth, postController.getPost);

// Update post
router.put('/:id', auth, postController.upload.single('image'), postController.updatePost);

// Delete post
router.delete('/:id', auth, postController.deletePost);

module.exports = router;