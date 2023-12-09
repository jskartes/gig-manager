const mongoose = require('mongoose');

const availableTimeSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  forStores: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Store'
  },
  isSelected: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true
  },
  name: String,
  email: String,
  availableTimes: [availableTimeSchema],
  stores: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Store'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
