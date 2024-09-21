const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  profilePic:{type:String, default:"🙂"},
  password: String,
  role: {
    type: String,
    enum: ['reader', 'writer', 'editor', 'admin'],
    default: 'reader',
  },
});

module.exports = mongoose.model('User', userSchema);
