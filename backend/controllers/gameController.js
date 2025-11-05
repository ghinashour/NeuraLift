const Game = require('../models/Game');
const User = require('../models/User');

// Simple in-repo question bank for code-quiz
const CODE_QUIZ_QS = [
  {
    id: 'q1',
    question: 'What is the output of: console.log(typeof NaN);',
    answer: 'number',
  },
  {
    id: 'q2',
    question: 'Which array method returns a new array with elements that pass the test?',
    answer: 'filter',
  },
  {
    id: 'q3',
    question: 'What keyword is used to create an ES6 class?',
    answer: 'class',
  },
];

// Start a code-quiz game: returns a random question and gameId
exports.startCodeQuiz = async (req, res) => {
  try {
    const q = CODE_QUIZ_QS[Math.floor(Math.random() * CODE_QUIZ_QS.length)];
    const game = new Game({ type: 'code-quiz', state: { questionId: q.id, attempts: [] } });
    // If authenticated, add player
    if (req.user && req.user.id) {
      game.players = game.players || [];
      game.players.push(req.user.id);
    }
    await game.save();
    return res.json({ gameId: game._id, question: q.question });
  } catch (err) {
    console.error('startCodeQuiz error', err);
    return res.status(500).json({ error: 'Failed to start quiz' });
  }
};

// Submit answer to code-quiz
exports.submitCodeQuiz = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { answer } = req.body;
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    const q = CODE_QUIZ_QS.find((x) => x.id === game.state.questionId);
    const correct = q && q.answer.toLowerCase().trim() === (answer || '').toLowerCase().trim();
    game.state.attempts = game.state.attempts || [];
    game.state.attempts.push({ answer, correct, at: new Date() });
    await game.save();

    // Persist score to user if correct or when attempts exhausted
    if (req.user && req.user.id) {
      try {
        const user = await User.findById(req.user.id);
        if (user) {
          const attemptsCount = game.state.attempts.length;
          // Score heuristic: 100 for correct, minus 10 per previous attempt
          const score = correct ? Math.max(10, 100 - (attemptsCount - 1) * 10) : 0;
          if (score > 0) {
            user.gameScores = user.gameScores || [];
            user.gameScores.push({ gameType: 'code-quiz', score });
            await user.save();
          }
        }
      } catch (err) {
        console.warn('Failed to persist user score', err.message);
      }
    }

    return res.json({ correct, attempts: game.state.attempts });
  } catch (err) {
    console.error('submitCodeQuiz error', err);
    return res.status(500).json({ error: 'Failed to submit answer' });
  }
};

// -----------------------
// Tenzis - simple solo dice game
// -----------------------
// Start a tenzis solo game
exports.startTenzis = async (req, res) => {
  try {
    // initial roll: five dice
    const roll = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
    const score = roll.reduce((s, v) => s + v, 0);
    const state = { roll, score, rollsLeft: 2, finished: false };
    const game = new Game({ type: 'tenzis-solo', state });
    if (req.user && req.user.id) {
      game.players = game.players || [];
      game.players.push(req.user.id);
    }
    await game.save();
    return res.json({ gameId: game._id, state });
  } catch (err) {
    console.error('startTenzis error', err);
    return res.status(500).json({ error: 'Failed to start tenzis' });
  }
};

// Roll dice for tenzis: consumes one rollsLeft
exports.rollTenzis = async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    if (game.type !== 'tenzis-solo') return res.status(400).json({ error: 'Invalid game type' });
    if (game.state.finished) return res.status(400).json({ error: 'Game already finished' });
    if (game.state.rollsLeft <= 0) return res.status(400).json({ error: 'No rolls left' });

    const roll = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
    const score = roll.reduce((s, v) => s + v, 0);
    game.state.roll = roll;
    game.state.score = score;
    game.state.rollsLeft -= 1;
    // simple win rule: score >= 25
    if (score >= 25 || game.state.rollsLeft <= 0) {
      game.state.finished = true;
      game.state.result = { won: score >= 25, finalScore: score };
    }
    await game.save();

    // Persist score to user when game finishes
    if (game.state.finished && req.user && req.user.id) {
      try {
        const user = await User.findById(req.user.id);
        if (user) {
          user.gameScores = user.gameScores || [];
          user.gameScores.push({ gameType: 'tenzis-solo', score });
          await user.save();
        }
      } catch (err) {
        console.warn('Failed to persist tenzis score', err.message);
      }
    }
    return res.json({ state: game.state });
  } catch (err) {
    console.error('rollTenzis error', err);
    return res.status(500).json({ error: 'Failed to roll' });
  }
};

// Get game state
exports.getGameState = async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    return res.json({ gameId: game._id, type: game.type, state: game.state });
  } catch (err) {
    console.error('getGameState error', err);
    return res.status(500).json({ error: 'Failed to get game state' });
  }
};
