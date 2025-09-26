const Score = require("../models/tenzisScore");

exports.saveScore = async (req, res) => {
  try {
    const { rolls } = req.body;
    const newScore = new Score({ rolls });
    await newScore.save();
    res.status(201).json(newScore);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getScores = async (req, res) => {
  try {
    const scores = await Score.find().sort({ rolls: 1 }).limit(10);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
