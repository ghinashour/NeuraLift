const Post = require('../models/Post');
const CollaborationGroup = require('../models/CollaborationGroup');
const CollaborationTask = require('../models/CollaborationTask');
const GroupInvite = require('../models/GroupInvite');
const User = require('../models/User');
const crypto = require('crypto');

// Post Controllers (keep existing ones)
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const post = new Post({
      user: req.user.id,
      content
    });

    await post.save();
    await post.populate('user', 'name avatar');

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name avatar')
      .populate('replies.user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

exports.addReply = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Reply text is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const reply = {
      user: req.user.id,
      text
    };

    post.replies.push(reply);
    await post.save();

    await post.populate('replies.user', 'name avatar');
    const newReply = post.replies[post.replies.length - 1];

    res.status(201).json(newReply);
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ message: 'Error adding reply', error: error.message });
  }
};

exports.updatePostLikes = async (req, res) => {
  try {
    const { postId } = req.params;
    const { likes } = req.body;

    const post = await Post.findByIdAndUpdate(
      postId,
      { likes },
      { new: true }
    ).populate('user', 'name avatar')
      .populate('replies.user', 'name avatar');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Update likes error:', error);
    res.status(500).json({ message: 'Error updating likes', error: error.message });
  }
};

// Group Controllers
exports.createGroup = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const group = new CollaborationGroup({
      name,
      description,
      creator: req.user.id,
      members: [req.user.id],
      isPublic: isPublic !== undefined ? isPublic : true
    });

    await group.save();
    await group.populate('creator', 'name avatar');
    await group.populate('members', 'name avatar');

    res.status(201).json(group);
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ message: 'Error creating group', error: error.message });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const groups = await CollaborationGroup.find()
      .populate('creator', 'name avatar')
      .populate('members', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ message: 'Error fetching groups', error: error.message });
  }
};

exports.addMemberToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const group = await CollaborationGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    group.members.push(userId);
    await group.save();

    await group.populate('members', 'name avatar');

    res.json(group);
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: 'Error adding member', error: error.message });
  }
};

// Invite Controllers
exports.generateInviteLink = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await CollaborationGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is group member
    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'You are not a member of this group' });
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');

    // Create invite
    const invite = new GroupInvite({
      group: groupId,
      token,
      createdBy: req.user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    await invite.save();

    const inviteLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/join/${groupId}?token=${token}`;

    res.json({
      inviteLink,
      expiresAt: invite.expiresAt,
      group: {
        _id: group._id,
        name: group.name,
        description: group.description
      }
    });
  } catch (error) {
    console.error('Generate invite error:', error);
    res.status(500).json({ message: 'Error generating invite link', error: error.message });
  }
};

exports.verifyInvite = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { token } = req.query;

    const invite = await GroupInvite.findOne({
      group: groupId,
      token,
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).populate('group', 'name description creator members');

    if (!invite) {
      return res.status(404).json({ message: 'Invalid or expired invitation' });
    }

    res.json({
      valid: true,
      group: invite.group,
      expiresAt: invite.expiresAt
    });
  } catch (error) {
    console.error('Verify invite error:', error);
    res.status(500).json({ message: 'Error verifying invitation', error: error.message });
  }
};

exports.joinGroupViaInvite = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { token } = req.body;

    const invite = await GroupInvite.findOne({
      group: groupId,
      token,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!invite) {
      return res.status(404).json({ message: 'Invalid or expired invitation' });
    }

    const group = await CollaborationGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is already a member
    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already a member of this group' });
    }

    // Add user to group
    group.members.push(req.user.id);
    await group.save();

    // Update invite usage
    invite.usedCount += 1;
    await invite.save();

    await group.populate('creator', 'name avatar')
      .populate('members', 'name avatar');

    res.json({
      message: 'Successfully joined group',
      group
    });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ message: 'Error joining group', error: error.message });
  }
};

// Task Controllers (keep existing ones)
exports.assignTask = async (req, res) => {
  try {
    const { title, description, assignedTo, groupId, dueDate, priority } = req.body;

    if (!title || !description || !assignedTo) {
      return res.status(400).json({
        message: 'Title, description, and assignedTo are required'
      });
    }

    const task = new CollaborationTask({
      title,
      description,
      assignedTo,
      assignedBy: req.user.id,
      group: groupId,
      dueDate,
      priority: priority || 'medium'
    });

    await task.save();
    await task.populate('assignedTo', 'name avatar');
    await task.populate('assignedBy', 'name avatar');
    await task.populate('group', 'name');

    res.status(201).json(task);
  } catch (error) {
    console.error('Assign task error:', error);
    res.status(500).json({ message: 'Error assigning task', error: error.message });
  }
};

exports.getUserTasks = async (req, res) => {
  try {
    const tasks = await CollaborationTask.find({ assignedTo: req.user.id })
      .populate('assignedBy', 'name avatar')
      .populate('group', 'name')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get user tasks error:', error);
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Add to your collaborateController.js

// Invite member by email
exports.inviteMemberByEmail = async (req, res) => {
  try {
    const { groupId, email, role } = req.body;

    if (!groupId || !email) {
      return res.status(400).json({ message: 'Group ID and email are required' });
    }

    const group = await CollaborationGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user has permission to add members
    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'You are not a member of this group' });
    }

    // Find user by email (you need a User model)
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Check if user is already a member
    if (group.members.includes(userToAdd._id)) {
      return res.status(400).json({ message: 'User is already a member of this group' });
    }

    // Add user to group
    group.members.push(userToAdd._id);
    await group.save();

    // Here you would typically send an email notification
    console.log(`Invited ${email} to group ${group.name}`);

    await group.populate('members', 'name email avatar');

    res.json({
      message: 'Member added successfully',
      group
    });
  } catch (error) {
    console.error('Invite member error:', error);
    res.status(500).json({ message: 'Error inviting member', error: error.message });
  }
};

// Get group members for task assignment
exports.getGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await CollaborationGroup.findById(groupId)
      .populate('members', 'name email avatar role');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(group.members);
  } catch (error) {
    console.error('Get group members error:', error);
    res.status(500).json({ message: 'Error fetching group members', error: error.message });
  }
};

// Get tasks assigned by current user
exports.getAssignedTasks = async (req, res) => {
  try {
    const tasks = await CollaborationTask.find({ assignedBy: req.user.id })
      .populate('assignedTo', 'name avatar email')
      .populate('assignedBy', 'name avatar')
      .populate('group', 'name')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get assigned tasks error:', error);
    res.status(500).json({ message: 'Error fetching assigned tasks', error: error.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, assignedTo, dueDate, priority, status } = req.body;

    const task = await CollaborationTask.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is the task creator
    if (task.assignedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit tasks you created' });
    }

    const updatedTask = await CollaborationTask.findByIdAndUpdate(
      taskId,
      {
        title,
        description,
        assignedTo,
        dueDate,
        priority,
        status
      },
      { new: true }
    )
      .populate('assignedTo', 'name avatar email')
      .populate('assignedBy', 'name avatar')
      .populate('group', 'name');

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await CollaborationTask.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is the task creator
    if (task.assignedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete tasks you created' });
    }

    await CollaborationTask.findByIdAndDelete(taskId);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};
// Get single task details
exports.getTaskDetails = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await CollaborationTask.findById(taskId)
      .populate('assignedTo', 'name avatar email')
      .populate('assignedBy', 'name avatar')
      .populate('group', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is either the assignee or the assigner
    if (task.assignedTo._id.toString() !== req.user.id && task.assignedBy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task details error:', error);
    res.status(500).json({ message: 'Error fetching task details', error: error.message });
  }
};

// Update task status (for task assignee)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await CollaborationTask.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is the task assignee
    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only update tasks assigned to you' });
    }

    const updatedTask = await CollaborationTask.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    )
      .populate('assignedTo', 'name avatar email')
      .populate('assignedBy', 'name avatar')
      .populate('group', 'name');

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ message: 'Error updating task status', error: error.message });
  }
};


// Join group (for chat integration)
exports.joinGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await CollaborationGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is already a member
    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already a member of this group' });
    }

    // Add user to group
    group.members.push(req.user.id);
    await group.save();

    await group.populate('creator', 'name avatar')
      .populate('members', 'name avatar');

    res.json({
      message: 'Successfully joined group',
      group
    });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ message: 'Error joining group', error: error.message });
  }
};