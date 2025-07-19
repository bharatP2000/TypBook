const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
  description: {type: String, required: true},
  date: {type: Date,required: true,},
  cancelled: { type: Boolean, default: false },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming you have a User model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
});

module.exports = mongoose.model("Event", eventSchema);
