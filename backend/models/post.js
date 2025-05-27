// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  text: String,
  imageBase64: String, // Store base64 string here
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);