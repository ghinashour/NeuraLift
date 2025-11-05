const SuccessStory = require('../models/SuccessStory');
const User = require('../models/User');
const Notification = require("../models/Notification")
// Get all public success stories with pagination and filtering
const getAllStories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category;
        const sortBy = req.query.sortBy || 'date';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const search = req.query.search;

        // Build filter object
        const filter = { isPublic: true };

        if (category && category !== 'all') {
            filter.category = category;
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        const sort = {};
        if (sortBy === 'date') {
            sort['createdAt'] = sortOrder;
        } else {
            sort[sortBy] = sortOrder;
        }

        const stories = await SuccessStory.find(filter)
            .populate('userId', 'username profilePhoto')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await SuccessStory.countDocuments(filter);

        res.json({
            success: true,
            data: {
                stories,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalStories: total,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                }
            }
        });
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching stories',
            error: error.message
        });
    }
};

// Get featured stories for landing page
const getFeaturedStories = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3;

        const stories = await SuccessStory.find({
            isPublic: true,
            isFeatured: true
        })
            .populate('userId', 'username profilePhoto')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        res.json({
            success: true,
            data: stories
        });
    } catch (error) {
        console.error('Error fetching featured stories:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching featured stories',
            error: error.message
        });
    }
};

// Get a single story by ID
const getStoryById = async (req, res) => {
    try {
        const story = await SuccessStory.findById(req.params.id)
            .populate('userId', 'username profilePhoto');

        if (!story) {
            return res.status(404).json({
                success: false,
                message: 'Story not found'
            });
        }

        res.json({
            success: true,
            data: story
        });
    } catch (error) {
        console.error('Error fetching story:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching story',
            error: error.message
        });
    }
};

// Create a new success story
const createStory = async (req, res) => {
    try {
        const { title, author, description, category, tags, isPublic } = req.body;

        // Validate required fields
        if (!title || !author || !description) {
            return res.status(400).json({
                success: false,
                message: 'Title, author, and description are required'
            });
        }

        const storyData = {
            title,
            author,
            description,
            category: category || 'Habits',
            tags: tags || [],
            isPublic: isPublic !== false, // Default to true
            userId: req.user?.id // Will be null for anonymous stories
        };

        const story = new SuccessStory(storyData);
        await story.save();

        // Populate the user data for response
        await story.populate('userId', 'username profilePhoto');

        res.status(201).json({
            success: true,
            message: 'Success story created successfully',
            data: story
        });
    } catch (error) {
        console.error('Error creating story:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating story',
            error: error.message
        });
    }
};

// Update a success story
const updateStory = async (req, res) => {
    try {
        const { title, author, description, category, tags, isPublic } = req.body;

        const story = await SuccessStory.findById(req.params.id);

        if (!story) {
            return res.status(404).json({
                success: false,
                message: 'Story not found'
            });
        }

        // Check if user owns the story or is admin
        if (story.userId && story.userId.toString() !== req.user?.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this story'
            });
        }

        // Update fields
        if (title) story.title = title;
        if (author) story.author = author;
        if (description) story.description = description;
        if (category) story.category = category;
        if (tags) story.tags = tags;
        if (typeof isPublic === 'boolean') story.isPublic = isPublic;

        await story.save();
        await story.populate('userId', 'username profilePhoto');

        res.json({
            success: true,
            message: 'Story updated successfully',
            data: story
        });
    } catch (error) {
        console.error('Error updating story:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating story',
            error: error.message
        });
    }
};

// Delete a success story
const deleteStory = async (req, res) => {
    try {
        const story = await SuccessStory.findById(req.params.id);

        if (!story) {
            return res.status(404).json({
                success: false,
                message: 'Story not found'
            });
        }

        // Check if user owns the story or is admin
        if (story.userId && story.userId.toString() !== req.user?.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this story'
            });
        }

        await SuccessStory.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Story deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting story:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting story',
            error: error.message
        });
    }
};

// Like/Unlike a story
const toggleLike = async (req, res) => {
    try {
        const story = await SuccessStory.findById(req.params.id);

        if (!story) {
            return res.status(404).json({
                success: false,
                message: 'Story not found'
            });
        }

        let isLiked;

        if (req.user) {
            // Authenticated user - toggle like
            // Use _id for Mongoose documents
            const userId = req.user._id?.toString() || req.user.id?.toString();
            isLiked = story.toggleLike(userId);
            await story.save();

            // Send notification to the story author if exists and not liking own story
            const storyOwnerId = story.userId?.toString();
            const currentUserId = userId;

            if (storyOwnerId && storyOwnerId !== currentUserId && isLiked) {
                // Create notification in database
                const notification = await Notification.create({
                    userId: story.userId,
                    type: "like",
                    message: `Someone liked your success story: "${story.title}"`
                });

                // Get the socket.io instance from the app
                const io = req.app.get('io');

                // Emit real-time notification to the story owner
                if (io) {
                    // Ensure userId is converted to string to match socket room name
                    // The socket room is joined using socket.user.id (from JWT payload.id)
                    // which is the user._id as a string
                    const targetUserId = storyOwnerId;

                    io.to(targetUserId).emit('newNotification', {
                        _id: notification._id,
                        userId: notification.userId,
                        type: notification.type,
                        message: notification.message,
                        read: notification.read,
                        createdAt: notification.createdAt
                    });
                }
            }
        } else {
            // Anonymous user - simple like count increment/decrement
            const hasLikedBefore = req.body.hasLikedBefore || false;

            if (hasLikedBefore) {
                // User is unliking
                story.likeCount = Math.max(0, story.likeCount - 1);
                isLiked = false;
            } else {
                // User is liking
                story.likeCount += 1;
                isLiked = true;
            }

            await story.save();
            // No notifications for anonymous likes
        }

        res.json({
            success: true,
            message: isLiked ? 'Story liked' : 'Story unliked',
            data: {
                isLiked,
                likeCount: story.likeCount
            }
        });
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({
            success: false,
            message: 'Error toggling like',
            error: error.message
        });
    }
};

// Get user's own stories
const getUserStories = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const userId = req.user._id?.toString() || req.user.id?.toString();
        const stories = await SuccessStory.find({ userId: userId })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await SuccessStory.countDocuments({ userId: userId });

        res.json({
            success: true,
            data: {
                stories,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalStories: total,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                }
            }
        });
    } catch (error) {
        console.error('Error fetching user stories:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user stories',
            error: error.message
        });
    }
};

// Track share
const trackShare = async (req, res) => {
    try {
        const story = await SuccessStory.findById(req.params.id);

        if (!story) {
            return res.status(404).json({
                success: false,
                message: 'Story not found'
            });
        }

        // Increment share count
        story.shareCount += 1;
        await story.save();

        res.json({
            success: true,
            message: 'Share tracked successfully',
            data: {
                shareCount: story.shareCount
            }
        });
    } catch (error) {
        console.error('Error tracking share:', error);
        res.status(500).json({
            success: false,
            message: 'Error tracking share',
            error: error.message
        });
    }
};

// Get statistics
const getStats = async (req, res) => {
    try {
        const totalStories = await SuccessStory.countDocuments({ isPublic: true });
        const totalLikes = await SuccessStory.aggregate([
            { $match: { isPublic: true } },
            { $group: { _id: null, total: { $sum: '$likeCount' } } }
        ]);

        const totalShares = await SuccessStory.aggregate([
            { $match: { isPublic: true } },
            { $group: { _id: null, total: { $sum: '$shareCount' } } }
        ]);

        const thisWeek = await SuccessStory.countDocuments({
            isPublic: true,
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        });

        const categoryStats = await SuccessStory.aggregate([
            { $match: { isPublic: true } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            data: {
                totalStories,
                totalLikes: totalLikes[0]?.total || 0,
                totalShares: totalShares[0]?.total || 0,
                thisWeek,
                categoryStats
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching stats',
            error: error.message
        });
    }
};

module.exports = {
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
};
