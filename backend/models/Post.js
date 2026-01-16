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
  image: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'posted'],
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
    enum: ['linkedin', 'twitter', 'instagram'],
    default: 'linkedin'
  },
  linkedinPostId: {
    type: String,
    default: null
  },
  analytics: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);