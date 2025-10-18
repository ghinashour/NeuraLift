// routes/profile.js
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const authMiddleware = require("../middleware/auth.js");
const upload = require("../middleware/upload.js");

const router = express.Router();

// GET user profile
router.get("/", authMiddleware, async (req, res) => {
  res.json(req.user);
});

// UPDATE profile (name, email, photo)
router.put("/", authMiddleware, upload.single("photo"), async (req, res) => {
  try {
    const { name, email } = req.body;
    const updateData = {};

    if (name) updateData.username = name; // Update username field instead of name
    if (email) updateData.email = email;
    if (req.file) updateData.profilePhoto = req.file.filename; // save photo filename

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CHANGE password
router.put("/password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
