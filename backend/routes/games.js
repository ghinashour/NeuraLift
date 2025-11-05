const express = require('express');
const router = express.Router();
const passport = require('passport');
const gameController = require('../controllers/gameController');

// Require authentication for game actions so games are tied to users
// Code quiz
router.post('/code-quiz/start', passport.authenticate('jwt', { session: false }), gameController.startCodeQuiz);
router.post('/code-quiz/submit/:gameId', passport.authenticate('jwt', { session: false }), gameController.submitCodeQuiz);

// Tenzis solo
router.post('/tenzis/start', passport.authenticate('jwt', { session: false }), gameController.startTenzis);
router.post('/tenzis/roll/:gameId', passport.authenticate('jwt', { session: false }), gameController.rollTenzis);

// Common - allow authenticated users to fetch their game state
router.get('/:gameId', passport.authenticate('jwt', { session: false }), gameController.getGameState);

// Leaderboard - top scores per game type
router.get('/leaderboard/:gameType', async (req, res) => {
	try {
		const { gameType } = req.params;
		const User = require('../models/User');
		// Aggregate users by their max score for the given gameType
		const pipeline = [
			{ $unwind: '$gameScores' },
			{ $match: { 'gameScores.gameType': gameType } },
			{ $group: { _id: '$_id', username: { $first: '$username' }, maxScore: { $max: '$gameScores.score' } } },
			{ $sort: { maxScore: -1 } },
			{ $limit: 20 },
		];
		const results = await User.aggregate(pipeline);
		return res.json(results.map(r => ({ userId: r._id, username: r.username, score: r.maxScore })));
	} catch (err) {
		console.error('leaderboard error', err);
		return res.status(500).json({ error: 'Failed to fetch leaderboard' });
	}
});

module.exports = router;
