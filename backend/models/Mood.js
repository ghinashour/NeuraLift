// models/MoodEntry.js
const mongoose = require('mongoose');

const MoodEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { 
    type: String, 
    enum: ['Terrible', 'poor', 'Okay', 'Good', 'Excellent'], 
    required: true 
  },
  stressed:{
    type: String,
    enum:['No', 'Yes']
  },
  note: { type: String },
  createdAt: { type: Date, default: Date.now }
});
MoodEntrySchema.index({ createdAt: -1 });
MoodEntrySchema.index({ mood: 1, createdAt: -1 });

module.exports = mongoose.model('MoodEntry', MoodEntrySchema);
