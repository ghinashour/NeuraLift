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
    password: {
  type: String,
  required: function () {
    return !this.googleId; // password required only if no googleId
  }
}

  },
  profilePhoto: {
    type: String,
    default: "avatar.jpg"
  },
  isVerified:{
    type: Boolean,
    default: false
  },
  verificationToken:{
    type: String,
  },
  isSuspended:{
    type: Boolean, 
    default: false
  },
  lastLogin:{
    type: Date
  },
  metadata:{
    type: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
