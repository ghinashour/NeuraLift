// routes/admin/moods.js
const express = require('express');
const router = express.Router();
const moodController = require('../../controllers/admin/moodController');
const{protect} = require("../../middleware/admin");

// GET all moods with filters
router.get('/',protect, moodController.getMoods);

// DELETE a mood entry
router.delete('/:id',protect, moodController.deleteMood);

// GET mood analytics
router.get('/analytics/stats', protect,moodController.getMoodAnalytics);

module.exports = router;
