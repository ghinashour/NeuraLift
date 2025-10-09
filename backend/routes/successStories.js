const express = require('express');
const router = express.Router();
const {
    getAllStories,
    getFeaturedStories,
    getStoryById,
    createStory,
    updateStory,
    deleteStory,
    toggleLike,
    trackShare,
    getUserStories,
    getStats
} = require('../controllers/successStoryController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', getAllStories); // Get all public stories with pagination and filtering
router.get('/featured', getFeaturedStories); // Get featured stories for landing page
router.get('/stats', getStats); // Get statistics
router.post('/:id/share', trackShare); // Track share (public route)

// Protected routes (require authentication)
router.post('/', createStory); // Create new story (public for now)
router.put('/:id', auth, updateStory); // Update story
router.delete('/:id', auth, deleteStory); // Delete story
router.post('/:id/like', toggleLike); // Like/Unlike story (public)
router.get('/user/my-stories', auth, getUserStories); // Get user's own stories

router.get('/:id', getStoryById); // Get single story by ID

module.exports = router;
