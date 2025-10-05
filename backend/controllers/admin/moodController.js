
const MoodEntry = require('../../models/Mood');
const AuditLog = require('../../models/AuditLog');

// GET /api/admin/moods
exports.getMoods = async (req, res) => {
  try {
    const { userId, mood, from, to, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (userId) filter.userId = userId;
    if (mood) filter.mood = mood;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const total = await MoodEntry.countDocuments(filter);
    const moods = await MoodEntry.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ moods, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/moods/:id
exports.deleteMood = async (req, res) => {
  try {
    const mood = await MoodEntry.findByIdAndDelete(req.params.id);
    if (!mood) return res.status(404).json({ message: 'Mood entry not found' });

    await AuditLog.create({
      adminId: req.user._id,
      action: 'delete_mood',
      target: `MoodEntry:${mood._id}`,
      details: { mood: mood.mood, note: mood.note }
    });

    res.json({ message: 'Mood entry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/moods/analytics
exports.getMoodAnalytics = async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = {};
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    // Count moods
    const moodStats = await MoodEntry.aggregate([
      { $match: filter },
      { $group: { _id: "$mood", count: { $sum: 1 } } }
    ]);

    // Daily trend
    const dailyTrend = await MoodEntry.aggregate([
      { $match: filter },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({ moodStats, dailyTrend });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
