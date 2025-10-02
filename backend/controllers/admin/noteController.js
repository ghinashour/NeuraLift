// backend/controllers/admin/noteController.js
const Note = require("../../models/Note");

// Get all notes (admin only)
exports.getAllNotes = async (req, res) => {
  try {
    const { userId, keyword, from, to, page = 1, limit = 10 } = req.query;
    const query = {};

    if (userId) query.user = userId;
    if (keyword) query.content = { $regex: keyword, $options: "i" };
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const notes = await Note.find(query)
      .populate("user", "name email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Note.countDocuments(query);

    res.json({ total, page: Number(page), notes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a note (admin only)
exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Analytics: count notes per day
exports.noteAnalytics = async (req, res) => {
  try {
    const trend = await Note.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ trend });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
