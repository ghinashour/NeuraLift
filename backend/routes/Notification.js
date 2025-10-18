// routes/notification.js
const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// Get notifications for a user
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Mark as read
router.patch("/read/:id", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json(notification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
