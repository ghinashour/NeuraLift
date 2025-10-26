// routes/profile.js
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const authMiddleware = require("../middleware/auth.js");
const upload = require("../middleware/upload.js");

const router = express.Router();

// GET user profile
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE profile (name, email, photo)
router.put("/", authMiddleware, upload.single("photo"), async (req, res) => {
  try {
    const { name, email, username } = req.body; // Added name and username
    const updateData = {};

    // Update name field (NEW)
    if (name) updateData.name = name;
    
    // Update username if provided
    if (username) updateData.username = username;
    
    // Update email if provided
    if (email) {
      // Check if email already exists (excluding current user)
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.user._id } 
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      updateData.email = email;
    }
    
    // Update profile photo if uploaded
    if (req.file) updateData.profilePhoto = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CHANGE password
router.put("/password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

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

// GET public profile (for other users to view)
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("name username profilePhoto createdAt");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;