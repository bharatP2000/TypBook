const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: String,
  user: {type: mongoose.Schema.Types.ObjectId,ref: 'User',},
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  createdAt: {type: Date,default: Date.now,},
  seen: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', notificationSchema);