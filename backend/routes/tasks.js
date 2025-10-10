// backend/routes/tasks.js
const express = require("express");
const router = express.Router();
const {
  createTask,
  getUserTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/TaskController");

const  protect  = require("../middleware/auth");

// All user routes protected
router.post("/", protect, createTask);
router.get("/", protect, getUserTasks);
router.get("/:id", protect, getTaskById);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

module.exports = router;
