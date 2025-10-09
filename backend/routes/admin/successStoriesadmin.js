const express = require("express");
const router = express.Router();
const {
  getAllStories,
  deleteStory,
  toggleFeature,
  storyAnalytics
} = require("../../controllers/admin/successStoriesAdmin");

const {protect } = require("../../middleware/admin");

// Admin routes
router.use("/", protect, getAllStories);
router.use("/:id", protect, deleteStory);
router.use("/feature/:id", protect, toggleFeature);
router.use("/analytics/stats", protect, storyAnalytics);

module.exports = router;
