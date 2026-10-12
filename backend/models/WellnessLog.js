const mongoose = require('mongoose');

// One log per user per calendar day.
const wellnessLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    waterCups: {
      type: Number,
      default: 0,
      min: 0,
      max: 50,
    },
    sleepHours: {
      type: Number,
      default: 0,
      min: 0,
      max: 24,
    },
  },
  { timestamps: true }
);

wellnessLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('WellnessLog', wellnessLogSchema);
