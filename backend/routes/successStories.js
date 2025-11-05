const express = require('express');
const router = express.Router();
const {
  getAllStories,
  getFeaturedStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
  trackShare,
  getUserStories,
  getStats,
    toggleLike,
} = require('../controllers/successStoryController');
const auth = require('../middleware/auth');

const Story = require('../models/SuccessStory');
const Notification = require('../models/Notification');

// ------------------------
// Public routes
// ------------------------
router.get('/', getAllStories); // Get all public stories with pagination and filtering
router.get('/featured', getFeaturedStories); // Get featured stories for landing page
router.get('/stats', getStats); // Get statistics
router.post('/:id/share', trackShare); // Track share (public route)

// Protected routes (require authentication)
router.post('/', auth, createStory); // Create new story (public for now)
router.put('/:id', auth, updateStory); // Update story
router.delete('/:id', auth, deleteStory); // Delete story
router.post('/:id/like', auth, toggleLike); // Like/Unlike story (public)
router.get('/user/my-stories', auth, getUserStories); // Get user's own stories

// ------------------------
// Get single story by ID
// ------------------------
router.get('/:id', getStoryById);

// ------------------------
// LIKE / UNLIKE STORY + SOCKET.IO Notification
// ------------------------
router.post("/:id/like", async (req, res) => {
  try {
    const storyId = req.params.id;
    const { userId, hasLikedBefore } = req.body;

    console.log("🟢 Like Request Received:", { storyId, userId, hasLikedBefore });

    if (!storyId || !userId) {
      return res.status(400).json({ success: false, message: "Story ID or User ID missing" });
    }

    const story = await SuccessStory.findById(storyId);
    if (!story) {
      return res.status(404).json({ success: false, message: "Story not found" });
    }

    const alreadyLiked = story.likes.includes(userId);

    if (alreadyLiked) {
      story.likes.pull(userId);
      story.likeCount = Math.max(0, story.likeCount - 1);
    } else {
      story.likes.push(userId);
      story.likeCount += 1;
    }

    await story.save();

    return res.status(200).json({
      success: true,
      message: alreadyLiked ? "Like removed" : "Story liked",
      data: { likeCount: story.likeCount },
    });
  } catch (err) {
    console.error("❌ Error toggling like:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});




module.exports = router;
