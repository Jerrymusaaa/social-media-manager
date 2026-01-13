const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'post-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Create new post
exports.createPost = async (req, res) => {
  try {
    const { caption, userDescription, status, scheduledFor, platform } = req.body;
    const image = req.file ? req.file.path : null;

    if (!caption || !userDescription || !image) {
      return res.status(400).json({ 
        message: 'Please provide caption, description, and image' 
      });
    }

    const post = new Post({
      user: req.userId,
      caption,
      userDescription,
      image,
      status: status || 'draft',
      scheduledFor: scheduledFor || null,
      platform: platform || 'linkedin'
    });

    await post.save();

    res.status(201).json({
      message: 'Post created successfully',
      post
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ 
      message: 'Error creating post', 
      error: error.message 
    });
  }
};

// Get all posts for current user
exports.getPosts = async (req, res) => {
  try {
    const { status, platform } = req.query;
    
    let query = { user: req.userId };
    
    if (status) {
      query.status = status;
    }
    
    if (platform) {
      query.platform = platform;
    }

    const posts = await Post.find(query).sort({ createdAt: -1 });

    res.json({
      count: posts.length,
      posts
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ 
      message: 'Error fetching posts', 
      error: error.message 
    });
  }
};

// Get single post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ 
      message: 'Error fetching post', 
      error: error.message 
    });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const { caption, userDescription, status, scheduledFor, platform } = req.body;

    const post = await Post.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Update fields if provided
    if (caption) post.caption = caption;
    if (userDescription) post.userDescription = userDescription;
    if (status) post.status = status;
    if (scheduledFor) post.scheduledFor = scheduledFor;
    if (platform) post.platform = platform;

    // If new image uploaded
    if (req.file) {
      // Delete old image
      if (post.image && fs.existsSync(post.image)) {
        fs.unlinkSync(post.image);
      }
      post.image = req.file.path;
    }

    await post.save();

    res.json({
      message: 'Post updated successfully',
      post
    });

  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ 
      message: 'Error updating post', 
      error: error.message 
    });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete image file
    if (post.image && fs.existsSync(post.image)) {
      fs.unlinkSync(post.image);
    }

    await Post.deleteOne({ _id: req.params.id });

    res.json({ message: 'Post deleted successfully' });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ 
      message: 'Error deleting post', 
      error: error.message 
    });
  }
};

// Get analytics dashboard
exports.getAnalytics = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId });

    const stats = {
      totalPosts: posts.length,
      draftPosts: posts.filter(p => p.status === 'draft').length,
      scheduledPosts: posts.filter(p => p.status === 'scheduled').length,
      postedPosts: posts.filter(p => p.status === 'posted').length,
      totalLikes: posts.reduce((sum, p) => sum + p.analytics.likes, 0),
      totalComments: posts.reduce((sum, p) => sum + p.analytics.comments, 0),
      totalShares: posts.reduce((sum, p) => sum + p.analytics.shares, 0),
      totalImpressions: posts.reduce((sum, p) => sum + p.analytics.impressions, 0)
    };

    res.json(stats);

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ 
      message: 'Error fetching analytics', 
      error: error.message 
    });
  }
};

// Export multer upload middleware
exports.upload = upload;