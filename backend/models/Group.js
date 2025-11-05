// models/Group.js
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isPublic: { type: Boolean, default: true },
  inviteToken: { type: String }, // For invite links
  avatar: { type: String } // Group avatar URL
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);