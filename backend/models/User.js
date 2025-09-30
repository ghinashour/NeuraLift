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
    name:{
      type: String,
      required: true,
      trim: true
    },
  password: { 
    type: String,
    required: true 
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
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
