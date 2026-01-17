const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caption: {
    type: String,
    required: true
  },
  userDescription: {
    type: String,
    required: true
  },
  // Media files (images and videos)
  media: {
    type: [{
      type: String, // file path
      mediaType: {
        type: String,
        enum: ['image', 'video'],
        default: 'image'
      }
    }],
    default: []
  },
  // Backwards compatibility
  image: {
    type: String
  },
  images: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'posted', 'failed'],
    default: 'draft'
  },
  scheduledFor: {
    type: Date,
    default: null
  },
  postedAt: {
    type: Date,
    default: null
  },
  platform: {
    type: String,
    enum: ['linkedin', 'twitter', 'instagram', 'tiktok', 'reddit'],
    required: true
  },
  // Platform-specific post IDs
  platformPostIds: {
    linkedin: { type: String, default: null },
    twitter: { type: String, default: null },
    instagram: { type: String, default: null },
    tiktok: { type: String, default: null },
    reddit: { type: String, default: null }
  },
  // Cross-posting
  crossPost: {
    enabled: { type: Boolean, default: false },
    platforms: [{ type: String, enum: ['linkedin', 'twitter', 'instagram', 'tiktok', 'reddit'] }]
  },
  analytics: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    views: { type: Number, default: 0 }, // For video content
    engagement: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);