// routes/profile.js
import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// GET user profile
router.get("/", authMiddleware, async (req, res) => {
  res.json(req.user);
});

// UPDATE profile (name, email, photo)
router.put("/", authMiddleware, upload.single("photo"), async (req, res) => {
  try {
    const { name, email } = req.body;
    const updateData = { name, email };
    if (req.file) updateData.photo = req.file.filename; // save photo filename

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select("-password");
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CHANGE password
router.put("/password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const isMatch = await bcrypt.compare(currentPassword, req.user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    req.user.password = hashedPassword;
    await req.user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
