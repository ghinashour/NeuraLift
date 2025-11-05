// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: false
  },
  username: { type: String, required: true, trim: true },
   name: {type: String,trim: true},
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: function () { return !this.googleId; } },
  profilePhoto: { type: String, default: "avatar.jpg" },
  isVerified: { type: Boolean, default: false },
  isSuspended: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpiry: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpiry: { type: Date },
  lastLogin: { type: Date },
  streak: {
    current: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null }
  },
  authProvider: {
  type: String,
  enum: ["local", "google"],
  default: "local"
},
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  refreshToken: { type: String }, // optional if you want DB tracking
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

