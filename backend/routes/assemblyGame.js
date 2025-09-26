const express = require('express');
const router = express.Router();
const assemblyGameController = require('../controllers/assemblyGameController');

// Start new game
router.post('/start', assemblyGameController.startGame);

// Make a guess
router.post('/guess', assemblyGameController.makeGuess);


module.exports = router;