// controllers/moodController.js
const Mood = require('../models/Mood');

exports.getMoods = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });

  try {
    const moods = await Mood.find({ user: req.user._id }).sort({ date: -1 });
    res.json(moods);
  } catch (error) {
    console.error("getMoods error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addMood = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Request body is missing" });
  }

  const { mood, isStressed = false, note = "" } = req.body;

  if (!mood) return res.status(400).json({ message: "Mood is required" });

  try {
    const newMood = new Mood({
      user: req.user._id,
      mood,
      isStressed,
      note,
    });

    const savedMood = await newMood.save();
    res.status(201).json(savedMood);
  } catch (error) {
    console.error("addMood error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🗑️ DELETE mood by ID
exports.deleteMood = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });

  try {
    const mood = await Mood.findOne({ _id: req.params.id, user: req.user._id });

    if (!mood) {
      return res.status(404).json({ message: "Mood not found or not authorized" });
    }

    await mood.deleteOne();
    res.status(200).json({ message: "Mood deleted successfully" });
  } catch (error) {
    console.error("deleteMood error:", error);
    res.status(500).json({ message: "Server error" });
  }
};