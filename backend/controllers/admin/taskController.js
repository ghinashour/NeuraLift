const Task = require("../../models/Task");
const mongoose = require("mongoose");

// Get all tasks 
exports.getAllTasks = async (req, res) => {
  try {
    const { userId, status, from, to, page = 1, limit = 10 } = req.query;
    const query = {};

    if (userId) {
      if (mongoose.Types.ObjectId.isValid(userId)) query.user = userId;
      else return res.status(400).json({ error: "Invalid userId" });
    }

    if (status) query.status = status;
    if (from || to) {
      query.dueDate = {};
      if (from) query.dueDate.$gte = new Date(from);
      if (to) query.dueDate.$lte = new Date(to);
    }

    const tasks = await Task.find(query)
      .populate("user", "name email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ dueDate: 1 });

    const total = await Task.countDocuments(query);

    res.json({ total, page: Number(page), tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update task (status/title/description/dueDate)
exports.updateTask = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Analytics: tasks completed per day & overdue tasks
exports.taskAnalytics = async (req, res) => {
  try {
    const completedPerDay = await Task.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$dueDate" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const overdueTasks = await Task.find({ status: "overdue" }).count();

    const activeUsers = await Task.aggregate([
      { $group: { _id: "$user", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({ completedPerDay, overdueTasks, activeUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
