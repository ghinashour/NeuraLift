const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Notification = require("../models/Notification");

// Get notifications for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Mark notifications as read
router.post("/mark-read", auth, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Mark a single notification as read
router.put("/read/:id", auth, async (req, res) => {
  try {
    const notifId = req.params.id;
    const notif = await Notification.findOneAndUpdate(
      { _id: notifId, userId: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notif) return res.status(404).json({ message: 'Notification not found' });

    res.json({ success: true, notification: notif });
  } catch (err) {
    console.error('Mark single notification read error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
