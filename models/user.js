const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true
  },
  name: String,
  email: String,
  stores: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Store'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
