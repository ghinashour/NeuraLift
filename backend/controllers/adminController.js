const User = require('../models/User');
//const Challenge = require('../models/Challenge');
//const Task = require('../models/Task');
const events = require("../models/Event");
// Dashboard overview
exports.getDashboard = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const eventcount = await events.countDocuments();
    //const challengesCount = await Challenge.countDocuments();
   // const tasksCount = await Task.countDocuments();
    res.json({ usersCount,eventcount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Get challenges
/*exports.getChallenges = async (req, res) => {
  try {
   // const challenges = await Challenge.find();
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};*/

/*// Get tasks
exports.getTasks = async (req, res) => {
  try {
   // const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
*/