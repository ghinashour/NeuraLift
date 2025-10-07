const express = require('express');
const router = express.Router();
const { getMoods, addMood } = require('../controllers/moodController');
const protect  = require('../middleware/auth');

router.get('/', protect, getMoods);
router.post('/', protect, addMood);

module.exports = router;
