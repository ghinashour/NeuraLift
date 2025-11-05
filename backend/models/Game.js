const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // e.g., 'code-quiz' | 'tenzis'
    state: { type: mongoose.Schema.Types.Mixed, default: {} },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Game', GameSchema);
