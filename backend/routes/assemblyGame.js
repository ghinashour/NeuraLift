const express = require('express');
const router = express.Router();
const assemblyGameController = require('../controllers/assemblyGameController');

// Start new game
router.post('/start', assemblyGameController.startGame);

// Make a guess
router.post('/guess', assemblyGameController.makeGuess);

// Seed languages (optional - for initial setup)
router.post('/seed', assemblyGameController.seedLanguages);

module.exports = router;