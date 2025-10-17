// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
    streak: {
    current: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null }
  },
  profilePhoto: { type: String, default: "avatar.jpg" },
  isVerified: { type: Boolean, default: false },
  isSuspended: { type: Boolean, default: false },
  lastLogin: { type: Date },
  metadata: { type: mongoose.Schema.Types.Mixed },

  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
