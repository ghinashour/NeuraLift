const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createPost,
  getPosts,
  addReply,
  updatePostLikes,
  createGroup,
  getGroups,
  addMemberToGroup,
  assignTask,
  getUserTasks,
  generateInviteLink,
  verifyInvite,
  joinGroupViaInvite
} = require('../controllers/collaborateController');

// Post routes
router.post('/posts', auth, createPost);
router.get('/posts', auth, getPosts);
router.post('/posts/:postId/replies', auth, addReply);
router.put('/posts/:postId/likes', auth, updatePostLikes);

// Group routes
router.post('/groups', auth, createGroup);
router.get('/groups', auth, getGroups);
router.post('/groups/:groupId/members', auth, addMemberToGroup);

// Invite routes
router.get('/groups/:groupId/generate-invite', auth, generateInviteLink);
router.get('/groups/:groupId/verify-invite', verifyInvite);
router.post('/groups/:groupId/join', auth, joinGroupViaInvite);

// Task routes
router.post('/tasks', auth, assignTask);
router.get('/tasks/my-tasks', auth, getUserTasks);

module.exports = router;