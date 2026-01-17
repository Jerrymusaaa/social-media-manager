const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // LinkedIn
  linkedinAccessToken: {
    type: String,
    default: null
  },
  linkedinRefreshToken: {
    type: String,
    default: null
  },
  linkedinTokenExpiry: {
    type: Date,
    default: null
  },
  linkedinConnected: {
    type: Boolean,
    default: false
  },
  // Instagram
  instagramAccessToken: {
    type: String,
    default: null
  },
  instagramUserId: {
    type: String,
    default: null
  },
  instagramConnected: {
    type: Boolean,
    default: false
  },
  // Twitter/X
  twitterAccessToken: {
    type: String,
    default: null
  },
  twitterAccessSecret: {
    type: String,
    default: null
  },
  twitterUserId: {
    type: String,
    default: null
  },
  twitterConnected: {
    type: Boolean,
    default: false
  },
  // TikTok
  tiktokAccessToken: {
    type: String,
    default: null
  },
  tiktokRefreshToken: {
    type: String,
    default: null
  },
  tiktokUserId: {
    type: String,
    default: null
  },
  tiktokConnected: {
    type: Boolean,
    default: false
  },
  // Reddit
  redditAccessToken: {
    type: String,
    default: null
  },
  redditRefreshToken: {
    type: String,
    default: null
  },
  redditUsername: {
    type: String,
    default: null
  },
  redditConnected: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);