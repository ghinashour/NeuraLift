const User = require('../models/User');
const MoodEntry = require("../models/MoodEntry");
const tasks = require("../models/Task");
const successStories = require("../models/SuccessStory");
// Dashboard overview
exports.getDashboard = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const moodCounts = await MoodEntry.countDocuments();
    const tasksCount = await tasks.countDocuments();
    const successStoriesCount = await successStories.countDocuments();
    res.json({ usersCount,moodCounts,tasksCount,successStoriesCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

