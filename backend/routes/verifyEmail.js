const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Verify email route
router.get("/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.json({ msg: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;  