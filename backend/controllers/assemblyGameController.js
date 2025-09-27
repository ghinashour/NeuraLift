const { ProgrammingLanguage, AssemblyGame } = require('../models/AssemblyGame');

// Get random programming language for the game
const getRandomProgrammingLanguage = async () => {
  const count = await ProgrammingLanguage.countDocuments();
  const random = Math.floor(Math.random() * count);
  const language = await ProgrammingLanguage.findOne().skip(random);
  return language;
};

// Start new game
exports.startGame = async (req, res) => {
  try {
    const language = await getRandomProgrammingLanguage();
    
    // Create word state with underscores
    const word = language.name.toUpperCase();
    const currentWordState = Array(word.length).fill('_');
    
    const game = new AssemblyGame({
      word: word,
      hint: language.hint,
      currentWordState: currentWordState,
      userId: req.user?._id // if you have user authentication
    });
    
    await game.save();
    
    res.json({
      gameId: game._id,
      currentWordState: game.currentWordState,
      hint: game.hint,
      incorrectGuesses: game.incorrectGuesses,
      maxIncorrectGuesses: game.maxIncorrectGuesses,
      guessedLetters: game.guessedLetters,
      status: game.status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Make a guess
exports.makeGuess = async (req, res) => {
  try {
    const { gameId, letter } = req.body;
    const game = await AssemblyGame.findById(gameId);
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    if (game.status !== 'playing') {
      return res.status(400).json({ error: 'Game has already ended' });
    }
    
    const upperLetter = letter.toUpperCase();
    
    // Check if letter was already guessed
    if (game.guessedLetters.includes(upperLetter)) {
      return res.status(400).json({ error: 'Letter already guessed' });
    }
    
    // Add to guessed letters
    game.guessedLetters.push(upperLetter);
    
    // Check if letter is in the word
    if (game.word.includes(upperLetter)) {
      // Update current word state
      const wordArray = game.word.split('');
      wordArray.forEach((char, index) => {
        if (char === upperLetter) {
          game.currentWordState[index] = upperLetter;
        }
      });
      
      // Check if game is won
      if (!game.currentWordState.includes('_')) {
        game.status = 'won';
      }
    } else {
      // Incorrect guess
      game.incorrectGuesses += 1;
      
      // Check if game is lost
      if (game.incorrectGuesses >= game.maxIncorrectGuesses) {
        game.status = 'lost';
        game.currentWordState = game.word.split(''); // Reveal the word
      }
    }
    
    await game.save();
    
    res.json({
      currentWordState: game.currentWordState,
      incorrectGuesses: game.incorrectGuesses,
      maxIncorrectGuesses: game.maxIncorrectGuesses,
      guessedLetters: game.guessedLetters,
      status: game.status,
      word: game.status !== 'playing' ? game.word : undefined
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

