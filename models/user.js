const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  isAdmin: Boolean,
  name: String,
  googleId: {
    type: String,
    required: true
  },
  email: String,
  avatar: String
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
