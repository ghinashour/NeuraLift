const express = require('express');
const Question = require('../models/Question');
const router = express.Router();

// Create a new question
// GET /api/questions/truefalse
router.get("/TrueFalse", async (req, res) => {
  try {
    // Fetch 5 random questions
    const questions = await Question.aggregate([{ $sample: { size: 5 } }]);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

module.exports = router;