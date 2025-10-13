const express = require("express");
const router = express.Router();
const {protect} = require("../../middleware/admin"); // check if user is admin
const {
  getAllStories,
  updateStory,
  deleteStory,
  toggleFeatureStory
} = require("../../controllers/admin/successStoriesAdmin");

// All routes are protected & admin only
router.use( protect);

router.get("/", getAllStories);
router.put("/:id", updateStory);
router.delete("/:id", deleteStory);
router.put("/feature/:id", toggleFeatureStory);

module.exports = router;
