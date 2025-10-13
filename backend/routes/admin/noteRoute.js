const express = require("express");
const router = express.Router();
const {
  getAllNotes,
  deleteNote,
  noteAnalytics,
} = require("../../controllers/admin/noteController");

const { protect } = require("../../middleware/admin");

router.get("/", protect, getAllNotes);
router.delete("/:id", protect, deleteNote);
router.get("/analytics/trend", protect, noteAnalytics);

module.exports = router;
