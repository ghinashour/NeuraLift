const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    color: {
      type: String,
      default: '#b79ced',
    },
    currentSprint: {
      type: String,
      trim: true,
      default: 'Sprint 01',
    },
    status: {
      type: String,
      enum: ['active', 'archived', 'completed'],
      default: 'active',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

projectSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model('Project', projectSchema);
