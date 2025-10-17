const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  deleteTask,
  updateTask,
  taskAnalytics,
} = require("../../controllers/admin/taskController");
const { protect } = require("../../middleware/admin");

router.get("/", protect, getAllTasks);
router.delete("/:id", protect, deleteTask);
router.put("/:id", protect, updateTask);
router.get("/analytics/stats", protect, taskAnalytics);

module.exports = router;
