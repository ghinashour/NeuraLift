// controllers/scheduleController.js
const Schedule = require("../../models/Schedule");

// Get all schedules (admin only)
exports.getAllSchedules = async (req, res) => {
  try {
    const { userId, status, date, page = 1, limit = 10 } = req.query;
    const query = {};

    if (userId) query.user = userId;
    if (status) query.status = status;
    if (date) query.date = { $eq: new Date(date) };

    const schedules = await Schedule.find(query)
      .populate("user", "name email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ date: 1 });

    const total = await Schedule.countDocuments(query);

    res.json({ total, page: Number(page), schedules });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete schedule (admin only)
exports.deleteSchedule = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: "Schedule deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update schedule (admin only)
exports.updateSchedule = async (req, res) => {
  try {
    const updated = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Analytics: busiest day
exports.scheduleAnalytics = async (req, res) => {
  try {
    const busiestDay = await Schedule.aggregate([
      { $group: { _id: "$date", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const activeUsers = await Schedule.aggregate([
      { $group: { _id: "$user", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({ busiestDay, activeUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
