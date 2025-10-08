// routes/scheduleRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllSchedules,
  deleteSchedule,
  updateSchedule,
  scheduleAnalytics
} = require("../../controllers/admin/scheduleController");

const { protect } = require("../../middleware/admin");

// Admin routes
router.get("/", protect, getAllSchedules);
router.delete("/:id", protect, deleteSchedule);
router.put("/:id", protect, updateSchedule);
router.get("/analytics/stats", protect, scheduleAnalytics);

module.exports = router;
