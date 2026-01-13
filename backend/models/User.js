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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);