// backend/routes/admin/taskRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  deleteTask,
  updateTask,
  taskAnalytics,
} = require("../../controllers/admin/taskController");

const {protect} = require("../../middleware/admin");

// Admin routes
router.use("/", protect, getAllTasks);
router.use("/:id",protect, deleteTask);
router.use("/:id", protect, updateTask);
router.use("/analytics/stats", protect, taskAnalytics);

module.exports = router;
