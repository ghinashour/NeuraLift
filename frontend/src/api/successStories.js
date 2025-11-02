import axios from './axios';

const API_BASE_URL = '/success-stories';

export const successStoriesAPI = {
    // Get all public success stories with pagination and filtering
    getAllStories: async (params = {}) => {
        try {
            const response = await axios.get(API_BASE_URL, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching stories:', error);
            throw error;
        }
    },

    // Get featured stories for landing page
    getFeaturedStories: async (limit = 3) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/featured`, {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching featured stories:', error);
            throw error;
        }
    },

    // Get a single story by ID
    getStoryById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching story:', error);
            throw error;
        }
    },

    // Create a new success story
    createStory: async (storyData) => {
        try {
            console.log('Creating story with data:', storyData);
            console.log('API URL:', API_BASE_URL);
            const response = await axios.post(API_BASE_URL, storyData);
            console.log('Story created successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating story:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            throw error;
        }
    },

    // Update a success story
    updateStory: async (id, storyData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/${id}`, storyData);
            return response.data;
        } catch (error) {
            console.error('Error updating story:', error);
            throw error;
        }
    },

    // Delete a success story
    deleteStory: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting story:', error);
            throw error;
        }
    },

    // Like / Unlike a story
    toggleLike: async (id, hasLikedBefore = false) => {
  try {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?._id; // make sure your user object uses "_id"

    const response = await axios.post(`${API_BASE_URL}/${id}/like`, {
      userId,
      hasLikedBefore,
    });

    return response.data;
  } catch (error) {
    console.error("Error toggling like:", error.response?.data || error);
    throw error;
  }
},


    // Track share
    trackShare: async (id) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/${id}/share`);
            return response.data;
        } catch (error) {
            console.error('Error tracking share:', error);
            throw error;
        }
    },

    // Get user's own stories
    getUserStories: async (params = {}) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/user/my-stories`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching user stories:', error);
            throw error;
        }
    },

    // Get statistics
    getStats: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/stats`);
            return response.data;
        } catch (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }
    }
};

// Helper function to migrate localStorage data to database
export const migrateLocalStorageData = async () => {
    try {
        // Get data from localStorage
        const savedStories = JSON.parse(localStorage.getItem('successStories') || '[]');
        const savedStats = JSON.parse(localStorage.getItem('successStoriesStats') || '{}');
        const savedLandingStories = JSON.parse(localStorage.getItem('landingPageStories') || '[]');

        console.log('Found localStorage data:', {
            stories: savedStories.length,
            stats: savedStats,
            landingStories: savedLandingStories.length
        });

        // Migrate stories to database
        const migrationResults = {
            storiesMigrated: 0,
            storiesSkipped: 0,
            errors: []
        };

        for (const story of savedStories) {
            try {
                // Skip default stories (they have specific IDs)
                if (story.id && typeof story.id === 'string' && story.id.length < 10) {
                    migrationResults.storiesSkipped++;
                    continue;
                }

                // Prepare story data for database
                const storyData = {
                    title: story.title || 'Success Story',
                    author: story.author || 'Anonymous',
                    description: story.description || story.content || '',
                    category: story.category || 'Personal Growth',
                    achievement: story.achievement || 'Achieved personal goals',
                    tags: story.tags || [],
                    isPublic: true
                };

                await successStoriesAPI.createStory(storyData);
                migrationResults.storiesMigrated++;
            } catch (error) {
                console.error('Error migrating story:', story, error);
                migrationResults.errors.push({
                    story: story.title || 'Untitled',
                    error: error.message
                });
            }
        }

        // Clear localStorage after successful migration
        if (migrationResults.storiesMigrated > 0) {
            localStorage.removeItem('successStories');
            localStorage.removeItem('successStoriesStats');
            localStorage.removeItem('landingPageStories');
            console.log('LocalStorage data cleared after migration');
        }

        return migrationResults;
    } catch (error) {
        console.error('Error during migration:', error);
        throw error;
    }
};

export default successStoriesAPI;
