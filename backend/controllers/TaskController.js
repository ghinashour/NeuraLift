const Task = require("../models/Task");

// Create task (authenticated user)
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, category, tags } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ error: "Title and dueDate are required" });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      dueDate,
      priority,
      category,
      tags,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("createTask error:", err);
    res.status(500).json({ error: err.message });
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

// Delete task (owner)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("deleteTask error:", err);
    res.status(500).json({ error: err.message });
  }
};