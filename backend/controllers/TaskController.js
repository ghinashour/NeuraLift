const Task = require("../models/Task");

// Create task (authenticated user)
exports.createTask = async (req, res) => {
  try {
    const { user, title, description, dueDate } = req.body;

    const task = await Task.create({ user, title, description, dueDate });

    // Add task to user
    await User.findByIdAndUpdate(user, { $push: { tasks: task._id } });

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all tasks for current user (with pagination/filter optional)
exports.getUserTasks = async (req, res) => {
  try {
    const { status, from, to, page = 1, limit = 20 } = req.query;
    const query = { user: req.user._id };

    if (status) query.status = status;
    if (from || to) {
      query.dueDate = {};
      if (from) query.dueDate.$gte = new Date(from);
      if (to) query.dueDate.$lte = new Date(to);
    }

    const tasks = await Task.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ dueDate: 1 });

    const total = await Task.countDocuments(query);

    res.json({ total, page: Number(page), tasks });
  } catch (err) {
    console.error("getUserTasks error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get single task by id (must belong to user)
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    console.error("getTaskById error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update task (only owner can update)
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ error: "Task not found" });

    const updates = req.body;
    Object.assign(task, updates);
    const updated = await task.save();

    res.json(updated);
  } catch (err) {
    console.error("updateTask error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete task (owner or admin)
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    // Find the task
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Check if requester is owner or admin
    if (!req.user.isAdmin && task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to delete this task" });
    }

    // Remove task from user's task array (optional if you added tasks array)
    await User.findByIdAndUpdate(task.user, { $pull: { tasks: taskId } });

    // Delete task from Task collection
    await Task.findByIdAndDelete(taskId);

    res.json({ message: "Task deleted successfully for both admin and user" });
  } catch (err) {
    console.error("deleteTask error:", err);
    res.status(500).json({ error: err.message });
  }
};
