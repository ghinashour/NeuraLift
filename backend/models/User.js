const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { 
    type: String,
    required: true, 
    trim: true
  },
  email: {
    type: String, 
    required: true, 
    unique: true,
    lowercase: true 
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    }
  },
  profilePhoto: {
    type: String,
    default: "avatar.jpg"
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String
  },
  verificationTokenExpiry: {
    type: Date
  },
  isSuspended: {
    type: Boolean, 
    default: false
  },
  lastLogin: {
    type: Date
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

userSchema.index({ createdAt: -1 });
userSchema.index({ lastActive: -1 });

module.exports = mongoose.model("User", userSchema);
