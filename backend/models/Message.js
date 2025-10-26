const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  group: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'CollaborationGroup', // Changed from 'Group' to 'CollaborationGroup'
    required: true 
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: {
    type: String,
    enum: ['text', 'system', 'file', 'task_update'],
    default: 'text'
  },
  content: { type: String, required: true },
  attachments: [{
    filename: String,
    url: String,
    type: String
  }],
  taskUpdate: {
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'CollaborationTask' }, // Fixed reference
    oldStatus: String,
    newStatus: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);