const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Active'],
    default: 'Pending'
  },
  confirmationCode: {
    type: String,
    unique: true
  },
  email: { type: String, required: true },
  hhnAccount: { type: Boolean, default: false },
  description: { type: String },
  coins: { type: Number, default: 0 },
  avatar: { type: String, default: null },
  role: { type: String, default: 'user' },
  language: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
