const express = require('express');
const router = express.Router();
const { getMoods, addMood } = require('../controllers/moodController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getMoods);
router.post('/', authMiddleware, addMood);

module.exports = router;
