import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Challenges/AssemblyGame.css'; // Make sure you have this CSS file

const AssemblyGame1 = () => {
  const [game, setGame] = useState(null);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Programming languages that will disappear with wrong guesses
  const programmingLanguages = [
    'JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'Go', 'Rust', 'Swift'
  ];

  // API configuration 
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/assembly-game/start`);
      setGame(response.data);
      setMessage('');
      setGuess('');
      console.log('Game started:', response.data);
    } catch (error) {
      console.error('Error starting game:', error);
      setMessage('Error starting game. Using demo mode.');

      // Fallback demo game
      createDemoGame();
    } finally {
      setLoading(false);
    }
  };

  // Fallback demo game
  const createDemoGame = () => {
    const demoWords = ['JAVASCRIPT', 'PYTHON', 'JAVA', 'REACT'];
    const demoHints = [
      'The language of the web',
      'Known for its simplicity and readability',
      'Write once run anywhere language',
      'Popular frontend library'
    ];

    const randomIndex = Math.floor(Math.random() * demoWords.length);
    const word = demoWords[randomIndex];

    setGame({
      gameId: 'demo-game',
      word: word,
      hint: demoHints[randomIndex],
      currentWordState: Array(word.length).fill('_'),
      incorrectGuesses: 0,
      maxIncorrectGuesses: 6,
      guessedLetters: [],
      status: 'playing'
    });
  };

  const handleGuess = async (e) => {
    e.preventDefault();
    if (!guess || !game || game.status !== 'playing') return;

    // Validate input
    if (!/^[A-Za-z]$/.test(guess)) {
      setMessage('Please enter a single letter (A-Z)');
      return;
    }

    try {
      setLoading(true);

      // If demo game, handle locally
      if (game.gameId === 'demo-game') {
        handleDemoGuess(guess.toUpperCase());
        setGuess('');
        return;
      }

      // Real backend API call
      const response = await axios.post(`${API_BASE}/assembly-game/guess`, {
        gameId: game.gameId,
        letter: guess.toUpperCase()
      });

      setGame(prevGame => ({
        ...prevGame,
        ...response.data
      }));

      // Check game status
      if (response.data.status === 'won') {
        setMessage('🎉 Congratulations! You won! 🎉');
      } else if (response.data.status === 'lost') {
        setMessage(`💀 Game Over! The word was: ${response.data.word}`);
      }

      setGuess('');
    } catch (error) {
      console.error('Error making guess:', error);
      setMessage('Error making guess: ' + (error.response?.data?.error || 'Server error'));
    } finally {
      setLoading(false);
    }
  };

  // Handle demo game guesses
  const handleDemoGuess = (letter) => {
    const upperLetter = letter.toUpperCase();
    const newGame = { ...game };

    // Check if already guessed
    if (newGame.guessedLetters.includes(upperLetter)) {
      setMessage('Letter already guessed!');
      return;
    }

    newGame.guessedLetters.push(upperLetter);

    // Check if letter is in the word
    if (newGame.word.includes(upperLetter)) {
      // Update displayed word
      const wordArray = newGame.word.split('');
      const newWordState = [...newGame.currentWordState];

      wordArray.forEach((char, index) => {
        if (char === upperLetter) {
          newWordState[index] = upperLetter;
        }
      });

      newGame.currentWordState = newWordState;

      // Check if won
      if (!newWordState.includes('_')) {
        newGame.status = 'won';
        setMessage('🎉 Congratulations! You won! 🎉');
      }
    } else {
      // Incorrect guess
      newGame.incorrectGuesses += 1;

      // Check if lost
      if (newGame.incorrectGuesses >= newGame.maxIncorrectGuesses) {
        newGame.status = 'lost';
        newGame.currentWordState = newGame.word.split('');
        setMessage(`💀 Game Over! The word was: ${newGame.word}`);
      } else {
        setMessage(`Wrong guess! ${newGame.maxIncorrectGuesses - newGame.incorrectGuesses} attempts left.`);
      }
    }

    setGame(newGame);
  };

  const getVisibleLanguages = () => {
    if (!game) return programmingLanguages;
    const maxLanguages = programmingLanguages.length;
    const languagesToShow = maxLanguages - game.incorrectGuesses;
    return programmingLanguages.slice(0, Math.max(0, languagesToShow));
  };

  if (!game) {
    return (
      <div className="assembly-game-container">
        <div className="loading">Loading game...</div>
      </div>
    );
  }

  return (
    <div className="assembly-game-container">
      <div className="game-content">
        <div className="assembly-game-hint-section">
          <h3>💡 Hint:</h3>
          <p>{game.hint}</p>
        </div>

        <div className="assembly-game-word-display">
          {game.currentWordState.map((letter, index) => (
            <span key={index} className="assembly-game-letter">
              {letter}
            </span>
          ))}
        </div>

        <div className="assembly-game-programming-languages">
          <h3>🛠️ Programming Languages Remaining:</h3>
          <div className="assembly-game-languages-list">
            {getVisibleLanguages().map((lang, index) => (
              <span key={index} className="assembly-game-language-tag">
                {lang}
              </span>
            ))}
            {getVisibleLanguages().length === 0 && (
              <p className="warning">⚠️ No languages left! Be careful!</p>
            )}
          </div>
          <p className="languages-count">
            {getVisibleLanguages().length} / {programmingLanguages.length} languages remaining
          </p>
        </div>

        <div className="assembly-game-game-stats">
          <p>❌ Incorrect Guesses: {game.incorrectGuesses}/{game.maxIncorrectGuesses}</p>
          <p>🔤 Guessed Letters: {game.guessedLetters.join(', ') || 'None'}</p>
        </div>

        {message && (
          <div className={`assembly-game-message ${game.status === 'won' ? 'won' : game.status === 'lost' ? 'lost' : ''}`}>
            {message}
          </div>
        )}

        {game.status === 'playing' ? (
          <form onSubmit={handleGuess} className="assembly-game-guess-form">
            <input
              type="text"
              maxLength="1"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter a letter"
              disabled={loading}
              autoFocus
            />
            <button type="submit" disabled={loading || !guess}>
              {loading ? 'Guessing...' : '🎯 Guess Letter'}
            </button>
          </form>
        ) : (
          <div className="game-end">
            <button onClick={startNewGame} className="assembly-game-new-game-btn">
              🔄 Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssemblyGame1;