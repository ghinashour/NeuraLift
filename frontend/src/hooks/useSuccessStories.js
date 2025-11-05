import { useState, useEffect, useCallback, useContext } from 'react';
import { successStoriesAPI, migrateLocalStorageData } from '../api/successStories';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

export const useSuccessStories = () => {
    const [stories, setStories] = useState([]);
    const [featuredStories, setFeaturedStories] = useState([]);
    const [stats, setStats] = useState({
        totalStories: 0,
        totalLikes: 0,
        thisWeek: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [migrationCompleted, setMigrationCompleted] = useState(false);
    const { user } = useContext(AuthContext); // Use AuthContext to get user

    // Check if migration is needed
    const checkMigration = useCallback(async () => {
        try {
            const hasLocalData = localStorage.getItem('successStories') || localStorage.getItem('successStoriesStats');
            if (hasLocalData && !migrationCompleted) {
                console.log('Found localStorage data, starting migration...');
                const migrationResults = await migrateLocalStorageData();
                console.log('Migration completed:', migrationResults);
                setMigrationCompleted(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Migration error:', error);
            setError('Failed to migrate data from localStorage');
            return false;
        }
    }, [migrationCompleted]);

    // Load all stories
    const loadStories = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await successStoriesAPI.getAllStories(params);
            if (response.success) {
                setStories(response.data.stories);
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to load stories');
            }
        } catch (error) {
            console.error('Error loading stories:', error);
            setError(error.message || 'Failed to load stories');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Load featured stories
    const loadFeaturedStories = useCallback(async (limit = 3) => {
        try {
            const response = await successStoriesAPI.getFeaturedStories(limit);
            if (response.success) {
                setFeaturedStories(response.data);
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to load featured stories');
            }
        } catch (error) {
            console.error('Error loading featured stories:', error);
            setError(error.message || 'Failed to load featured stories');
            throw error;
        }
    }, []);

    // Load statistics
    const loadStats = useCallback(async () => {
        try {
            const response = await successStoriesAPI.getStats();
            if (response.success) {
                setStats(response.data);
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to load stats');
            }
        } catch (error) {
            console.error('Error loading stats:', error);
            setError(error.message || 'Failed to load stats');
            throw error;
        }
    }, []);

    // Create a new story
    const createStory = useCallback(async (storyData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await successStoriesAPI.createStory(storyData);
            if (response.success) {
                // Add the new story to the current list
                setStories(prevStories => [response.data, ...prevStories]);

                // Update stats immediately - increment total stories
                setStats(prevStats => ({
                    ...prevStats,
                    totalStories: prevStats.totalStories + 1,
                    thisWeek: prevStats.thisWeek + 1  // Also increment this week count
                }));

                return response.data;
            } else {
                throw new Error(response.message || 'Failed to create story');
            }
        } catch (error) {
            console.error('Error creating story:', error);
            setError(error.message || 'Failed to create story');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Update a story
    const updateStory = useCallback(async (id, storyData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await successStoriesAPI.updateStory(id, storyData);
            if (response.success) {
                // Update the story in the current list
                setStories(prevStories =>
                    prevStories.map(story =>
                        story._id === id ? response.data : story
                    )
                );
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to update story');
            }
        } catch (error) {
            console.error('Error updating story:', error);
            setError(error.message || 'Failed to update story');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Delete a story
    const deleteStory = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await successStoriesAPI.deleteStory(id);
            if (response.success) {
                // Remove the story from the current list
                setStories(prevStories => prevStories.filter(story => story._id !== id));

                // Update stats immediately - decrement total stories
                setStats(prevStats => ({
                    ...prevStats,
                    totalStories: Math.max(0, prevStats.totalStories - 1),
                    thisWeek: Math.max(0, prevStats.thisWeek - 1)  // Also decrement this week count
                }));

                return true;
            } else {
                throw new Error(response.message || 'Failed to delete story');
            }
        } catch (error) {
            console.error('Error deleting story:', error);
            setError(error.message || 'Failed to delete story');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Toggle like on a story
    const toggleLike = useCallback(async (id) => {

        if (!user) {
            setError('Authentication required to like stories.');
            setLoading(false);
            return; // Exit if no user
        }

        // Optimistically update stats based on the current like state of the story
        const currentStory = stories.find(story => story._id === id) || featuredStories.find(story => story._id === id);
        const wasLiked = currentStory ? currentStory.likes.includes(user.id) : false;

        setStats(prevStats => ({
            ...prevStats,
            totalLikes: prevStats.totalLikes + (wasLiked ? -1 : 1)
        }));

        try {
            const response = await successStoriesAPI.toggleLike(id);
            if (response.success) {
                // Update the story in the current list
                setStories(prevStories =>
                    prevStories.map(story => {
                        if (story._id === id) {
                            // The backend returns isLiked and likeCount directly
                            const updatedLikes = response.data.isLiked
                                ? [...story.likes, user.id]
                                : story.likes.filter(userId => userId !== user.id);
                            return { ...story, likeCount: response.data.likeCount, likes: updatedLikes };
                        }
                        return story;
                    })
                );
                // Update featured stories if the story is there
                setFeaturedStories(prevFeatured =>
                    prevFeatured.map(story => {
                        if (story._id === id) {
                            const updatedLikes = response.data.isLiked
                                ? [...story.likes, user.id]
                                : story.likes.filter(userId => userId !== user.id);
                            return { ...story, likeCount: response.data.likeCount, likes: updatedLikes };
                        }
                        return story;
                    })
                );

                return response.data;
            } else {
                // If backend indicates failure, revert optimistic update and throw error
                setStats(prevStats => ({
                    ...prevStats,
                    totalLikes: prevStats.totalLikes + (wasLiked ? 1 : -1)
                }));
                throw new Error(response.message || 'Failed to toggle like');
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            setError(error.message || 'Failed to toggle like');
            // If there was an error after an optimistic update, revert it
            setStats(prevStats => ({
                ...prevStats,
                totalLikes: prevStats.totalLikes + (wasLiked ? 1 : -1)
            }));
            throw error;
        }
    }, [stories, featuredStories, user]);

    // Track share
    const trackShare = useCallback(async (id) => {
        // Update stats immediately - increment total shares (no await)
        setStats(prevStats => ({
            ...prevStats,
            totalShares: (prevStats.totalShares || 0) + 1
        }));

        try {
            const response = await successStoriesAPI.trackShare(id);
            if (response.success) {
                // Update the story in the current list
                setStories(prevStories =>
                    prevStories.map(story =>
                        story._id === id
                            ? { ...story, shareCount: response.data.shareCount }
                            : story
                    )
                );
                // Update featured stories if the story is there
                setFeaturedStories(prevFeatured =>
                    prevFeatured.map(story =>
                        story._id === id
                            ? { ...story, shareCount: response.data.shareCount }
                            : story
                    )
                );

                return response.data;
            } else {
                throw new Error(response.message || 'Failed to track share');
            }
        } catch (error) {
            console.error('Error tracking share:', error);
            setError(error.message || 'Failed to track share');
            throw error;
        }
    }, []);

    // Initialize data on mount
    useEffect(() => {
        const initializeData = async () => {
            try {
                // Check for migration first
                await checkMigration();

                // Load data from database
                await Promise.all([
                    loadStories(),
                    loadFeaturedStories(),
                    loadStats()
                ]);
            } catch (error) {
                console.error('Error initializing success stories:', error);
                console.error('Full error details:', error);
                setError(`Failed to initialize success stories: ${error.message || 'Please check if the backend server is running'}`);
            }
        };

        initializeData();
    }, [checkMigration, loadStories, loadFeaturedStories, loadStats]);

    return {
        stories,
        featuredStories,
        stats,
        loading,
        error,
        migrationCompleted,
        loadStories,
        loadFeaturedStories,
        loadStats,
        createStory,
        updateStory,
        deleteStory,
        toggleLike,
        trackShare,
        clearError: () => setError(null)
    };
};

export default useSuccessStories;
