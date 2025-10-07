// models/MoodEntry.js
const mongoose = require('mongoose');

const MoodEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { 
    type: String, 
    enum: ['excellent', 'good', 'Okay', 'poor', 'terrible'], 
    required: true 
  },
  stressed:{
    type: Boolean,
    default:false
  },
  note: { type: String, default:'' },
  createdAt: { type: Date, default: Date.now }
});
MoodEntrySchema.index({ createdAt: -1 });
MoodEntrySchema.index({ mood: 1, createdAt: -1 });

module.exports = mongoose.model('MoodEntry', MoodEntrySchema);
