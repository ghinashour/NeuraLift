const CollaborationGroup = require('../models/CollaborationGroup');
const Message = require('../models/Message');
const CollaborationTask = require('../models/CollaborationTask');

// Get user's groups
exports.getUserGroups = async (req, res) => {
  try {
    const groups = await CollaborationGroup.find({ 
      members: req.user.id 
    })
    .populate('creator', 'name avatar')
    .populate('members', 'name avatar')
    .sort({ updatedAt: -1 });

    res.json(groups);
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ message: 'Error fetching groups', error: error.message });
  }
};

// Get group messages
exports.getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    
    const messages = await Message.find({ group: groupId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { content, type = 'text', attachments = [] } = req.body;

    // Check if user is member of the group
    const group = await CollaborationGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not a member of this group' });
    }

    const message = new Message({
      group: groupId,
      sender: req.user.id,
      type,
      content,
      attachments
    });

    await message.save();
    await message.populate('sender', 'name avatar');

    // Update group's last activity
    group.updatedAt = new Date();
    await group.save();

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

// Get group tasks
exports.getGroupTasks = async (req, res) => {
  try {
    const { groupId } = req.params;
    
    const tasks = await CollaborationTask.find({ group: groupId })
      .populate('assignedTo', 'name avatar')
      .populate('assignedBy', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get group tasks error:', error);
    res.status(500).json({ message: 'Error fetching group tasks', error: error.message });
  }
};

// Create system message for task status change
exports.createTaskUpdateMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { taskId, taskTitle, oldStatus, newStatus } = req.body;

    const message = new Message({
      group: groupId,
      sender: req.user.id,
      type: 'task_update',
      content: `${req.user.name} changed "${taskTitle}" status from ${oldStatus} to ${newStatus}`,
      taskUpdate: { taskId, oldStatus, newStatus }
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error('Create task update message error:', error);
    res.status(500).json({ message: 'Error creating task update', error: error.message });
  }
};