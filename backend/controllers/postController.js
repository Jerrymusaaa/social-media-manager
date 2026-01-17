const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Helper function to validate schedule time
const validateScheduleTime = (scheduledFor) => {
  if (!scheduledFor) return { valid: true }; // No schedule is valid
  
  const scheduleDate = new Date(scheduledFor);
  const now = new Date();
  
  // Must be at least 5 minutes in the future
  const minFutureTime = new Date(now.getTime() + 5 * 60000);
  
  if (scheduleDate < minFutureTime) {
    return {
      valid: false,
      message: 'Schedule time must be at least 5 minutes in the future'
    };
  }
  
  // Cannot be more than 1 year in the future
  const maxFutureTime = new Date(now.getTime() + 365 * 24 * 60 * 60000);
  
  if (scheduleDate > maxFutureTime) {
    return {
      valid: false,
      message: 'Schedule time cannot be more than 1 year in the future'
    };
  }
  
  return { valid: true };
};

// Configure multer for media uploads (images and videos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'media-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2GB limit
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const allowedVideoTypes = /mp4|mov|avi|mkv|webm/;
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    const isImage = allowedImageTypes.test(extname) && mimetype.startsWith('image/');
    const isVideo = allowedVideoTypes.test(extname) && mimetype.startsWith('video/');

    if (isImage || isVideo) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'));
    }
  }
});

// Create new post (supports multiple media files)
exports.createPost = async (req, res) => {
  try {
    const { caption, userDescription, status, scheduledFor, platform, crossPost } = req.body;
    const files = req.files || [];

    if (!caption || !userDescription || files.length === 0) {
      return res.status(400).json({ 
        message: 'Please provide caption, description, and at least one media file' 
      });
    }

    if (files.length > 12) {
      return res.status(400).json({ 
        message: 'Maximum 12 media files allowed per post' 
      });
    }

    // Validate scheduled time if status is 'scheduled'
    if (status === 'scheduled') {
      if (!scheduledFor) {
        return res.status(400).json({
          message: 'Please provide a schedule time for scheduled posts'
        });
      }

      const validation = validateScheduleTime(scheduledFor);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }
    }

    // Process media files
    const media = files.map(file => file.path);

    const post = new Post({
      user: req.userId,
      caption,
      userDescription,
      media: media,
      image: media[0], // For backwards compatibility
      images: media,
      status: status || 'draft',
      scheduledFor: status === 'scheduled' ? new Date(scheduledFor) : null,
      platform: platform || 'linkedin',
      crossPost: crossPost ? JSON.parse(crossPost) : { enabled: false, platforms: [] }
    });

    await post.save();

    res.status(201).json({
      message: status === 'scheduled' 
        ? `Post scheduled for ${new Date(scheduledFor).toLocaleString()}` 
        : 'Post created successfully',
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

// Get scheduled posts
exports.getScheduledPosts = async (req, res) => {
  try {
    const { platform } = req.query;
    
    let query = { 
      user: req.userId,
      status: 'scheduled'
    };
    
    if (platform) {
      query.platform = platform;
    }

    const posts = await Post.find(query).sort({ scheduledFor: 1 });

    res.json({
      count: posts.length,
      posts
    });

  } catch (error) {
    console.error('Get scheduled posts error:', error);
    res.status(500).json({ 
      message: 'Error fetching scheduled posts', 
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

    // Validate scheduled time if changing to 'scheduled'
    if (status === 'scheduled' && scheduledFor) {
      const validation = validateScheduleTime(scheduledFor);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }
    }

    // Update fields if provided
    if (caption) post.caption = caption;
    if (userDescription) post.userDescription = userDescription;
    if (status) post.status = status;
    if (scheduledFor) post.scheduledFor = new Date(scheduledFor);
    if (platform) post.platform = platform;

    // If new media uploaded
    if (req.files && req.files.length > 0) {
      // Delete old media files
      if (post.media && post.media.length > 0) {
        post.media.forEach(mediaPath => {
          if (fs.existsSync(mediaPath)) {
            fs.unlinkSync(mediaPath);
          }
        });
      }
      
      const newMedia = req.files.map(file => file.path);
      post.media = newMedia;
      post.image = newMedia[0];
      post.images = newMedia;
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

    // Delete all media files
    if (post.media && post.media.length > 0) {
      post.media.forEach(mediaPath => {
        if (fs.existsSync(mediaPath)) {
          fs.unlinkSync(mediaPath);
        }
      });
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
    const { platform } = req.query;
    
    let query = { user: req.userId };
    if (platform) {
      query.platform = platform;
    }

    const posts = await Post.find(query);

    const stats = {
      totalPosts: posts.length,
      draftPosts: posts.filter(p => p.status === 'draft').length,
      scheduledPosts: posts.filter(p => p.status === 'scheduled').length,
      postedPosts: posts.filter(p => p.status === 'posted').length,
      failedPosts: posts.filter(p => p.status === 'failed').length,
      totalLikes: posts.reduce((sum, p) => sum + p.analytics.likes, 0),
      totalComments: posts.reduce((sum, p) => sum + p.analytics.comments, 0),
      totalShares: posts.reduce((sum, p) => sum + p.analytics.shares, 0),
      totalImpressions: posts.reduce((sum, p) => sum + p.analytics.impressions, 0),
      totalViews: posts.reduce((sum, p) => sum + p.analytics.views, 0),
      platform: platform || 'all'
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