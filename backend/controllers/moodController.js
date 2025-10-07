const Mood = require('../models/Mood');

// @desc    Get all moods for logged-in user
// @route   GET /api/moods
// @access  Private
exports.getMoods = async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user._id }).sort({ date: -1 });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add new mood entry
// @route   POST /api/moods
// @access  Private
exports.addMood = async (req, res) => {
  const { mood, isStressed, note } = req.body;
  try {
    const newMood = new Mood({
      user: req.user._id,
      mood,
      isStressed,
      note
    });
    const savedMood = await newMood.save();
    res.status(201).json(savedMood);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
