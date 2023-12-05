const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['admin', 'user']
  },
  name: String,
  googleId: {
    type: String,
    required: true
  },
  email: String,
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
