const express = require('express');
const router = express.Router();
const { getMoods, addMood , deleteMood} = require('../controllers/moodController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getMoods);
router.post('/', authMiddleware, addMood);
router.delete('/:id', authMiddleware, deleteMood); 

module.exports = router;
