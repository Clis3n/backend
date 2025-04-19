const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String }, // Ini penting, bukan picture
  role: {
    type: String,
    enum: ['user'],
    default: 'user', // WAJIB: default 'user'
  },
});

module.exports = mongoose.model('User', UserSchema);
