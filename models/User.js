const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user', // Peran default adalah 'user'
  },
});

module.exports = mongoose.model('User', UserSchema);
