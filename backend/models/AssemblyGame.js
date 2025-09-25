const mongoose = require('mongoose');

const programmingLanguageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  hint: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const AssemblyGameSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true
  },
  hint: {
    type: String,
    required: true
  },
  currentWordState: {
    type: [String],
    default: []
  },
  incorrectGuesses: {
    type: Number,
    default: 0
  },
  maxIncorrectGuesses: {
    type: Number,
    default: 8
  },
  guessedLetters: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['playing', 'won', 'lost'],
    default: 'playing'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = {
  ProgrammingLanguage: mongoose.model('ProgrammingLanguage', programmingLanguageSchema),
  AssemblyGame: mongoose.model('AssemblyGame', AssemblyGameSchema)
};