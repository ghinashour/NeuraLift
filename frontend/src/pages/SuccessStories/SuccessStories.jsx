import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '../../components/SuccessStories/StatsCard';
import StoryCard from '../../components/SuccessStories/StoryCard';
import '../../styles/SuccessStories/SuccessStories.css';

const SuccessStories = () => {
    const [stories, setStories] = useState([]);
    const [stats, setStats] = useState({
        totalStories: 0,
        totalLikes: 0,
        thisWeek: 0
    });


    // Load stats from localStorage
    const loadStatsFromStorage = useCallback(() => {
        try {
            const savedStats = localStorage.getItem('successStoriesStats');
            if (savedStats) {
                const parsedStats = JSON.parse(savedStats);
                setStats(parsedStats);
                return parsedStats;
            }
        } catch (error) {
            console.error('Error loading stats from localStorage:', error);
        }
        return null;
    }, []);

    // Update stats when individual story likes change
    const updateStatsFromLikeChange = useCallback((storyId, isLiked) => {
        setStats(prevStats => {
            // Update total likes based on like/unlike action
            const likeChange = isLiked ? 1 : -1;

            const newStats = {
                ...prevStats,
                totalLikes: Math.max(0, prevStats.totalLikes + likeChange) // Ensure it doesn't go below 0
            };

            // Save updated stats to localStorage
            try {
                localStorage.setItem('successStoriesStats', JSON.stringify(newStats));
            } catch (error) {
                console.error('Error saving stats to localStorage:', error);
            }

            return newStats;
        });
    }, []);

    useEffect(() => {
        // Default stories
        const defaultStories = [
            {
                id: 1,
                author: "Sarah M.",
                title: "Completed 30-Day Meditation Challenge",
                category: "Mindfulness",
                description: "After struggling with stress and anxiety, I committed to meditating for 10 minutes every day. Today marks 30 days straight! I feel more centered, focused, and calm. My relationships have improved and I'm sleeping better than ever.",
                date: "9/3/2025",
                shareCount: 12,
                likeCount: 12
            },
            {
                id: 2,
                author: "Mike R.",
                title: "Finally Established a Morning Routine",
                category: "Habits",
                description: "For years I was chaotic in the mornings. Using the focus timer and task manager here, I built a consistent 6 AM routine: exercise, journaling, and planning my day. It's been 3 weeks and I feel incredible!",
                date: "9/2/2025",
                shareCount: 8,
                likeCount: 8
            },
            {
                id: 3,
                author: "Emma L.",
                title: "Launched My Side Business",
                category: "Goals",
                description: "The task management and focus sessions helped me stay accountable to my business goals. After 6 months of consistent evening work sessions, I finally launched my online store. Already made my first sale!",
                date: "9/1/2025",
                shareCount: 15,
                likeCount: 15
            }
        ];

        // Load stories from localStorage and combine with default stories
        const savedStories = JSON.parse(localStorage.getItem('successStories') || '[]');
        // Combine saved stories (newest first) with default stories, removing duplicates
        const allStories = [...savedStories, ...defaultStories.filter(defaultStory =>
            !savedStories.some(savedStory => savedStory.id === defaultStory.id)
        )];

        setStories(allStories);

        // Load stats from localStorage, if no saved stats exist, calculate them
        const savedStats = loadStatsFromStorage();
        if (!savedStats && allStories.length > 0) {
            // Calculate initial stats directly without using updateStats
            const totalStories = allStories.length;
            const totalLikes = allStories.reduce((sum, story) => sum + (story.likeCount || story.shareCount), 0);
            const thisWeek = allStories.filter(story => {
                const storyDate = new Date(story.date);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return storyDate >= weekAgo;
            }).length;

            const initialStats = {
                totalStories,
                totalLikes,
                thisWeek
            };

            setStats(initialStats);

            // Save initial stats to localStorage
            try {
                localStorage.setItem('successStoriesStats', JSON.stringify(initialStats));
            } catch (error) {
                console.error('Error saving initial stats to localStorage:', error);
            }
        } else if (savedStats) {
            // If we have saved stats, make sure they're up to date with current stories
            const currentTotalStories = allStories.length;
            const currentThisWeek = allStories.filter(story => {
                const storyDate = new Date(story.date);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return storyDate >= weekAgo;
            }).length;

            // Update stats if they don't match current story count
            if (savedStats.totalStories !== currentTotalStories || savedStats.thisWeek !== currentThisWeek) {
                const updatedStats = {
                    ...savedStats,
                    totalStories: currentTotalStories,
                    thisWeek: currentThisWeek
                };

                setStats(updatedStats);
                localStorage.setItem('successStoriesStats', JSON.stringify(updatedStats));
            }
        }
    }, [loadStatsFromStorage]);

    return (
        <div className="success-stories">
            <div className="success-stories-header">
                <div className="header-content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="33" height="32" viewBox="0 0 33 32" fill="none" className="header-icon">
                        <path d="M8.01999 12.0002H6.01999C5.13593 12.0002 4.28809 11.649 3.66296 11.0239C3.03784 10.3987 2.68665 9.55088 2.68665 8.66683C2.68665 7.78277 3.03784 6.93493 3.66296 6.30981C4.28809 5.68469 5.13593 5.3335 6.01999 5.3335H8.01999" stroke="#3C83F6" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M24.02 12.0002H26.02C26.904 12.0002 27.7519 11.649 28.377 11.0239C29.0021 10.3987 29.3533 9.55088 29.3533 8.66683C29.3533 7.78277 29.0021 6.93493 28.377 6.30981C27.7519 5.68469 26.904 5.3335 26.02 5.3335H24.02" stroke="#3C83F6" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5.35332 29.3335H26.6867" stroke="#3C83F6" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13.3533 19.5469V22.6669C13.3533 23.4002 12.7267 23.9735 12.06 24.2802C10.4867 25.0002 9.35332 26.9869 9.35332 29.3335" stroke="#3C83F6" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M18.6867 19.5469V22.6669C18.6867 23.4002 19.3133 23.9735 19.98 24.2802C21.5533 25.0002 22.6867 26.9869 22.6867 29.3335" stroke="#3C83F6" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M24.02 2.6665H8.01999V11.9998C8.01999 14.1216 8.86284 16.1564 10.3631 17.6567C11.8634 19.157 13.8983 19.9998 16.02 19.9998C18.1417 19.9998 20.1766 19.157 21.6768 17.6567C23.1771 16.1564 24.02 14.1216 24.02 11.9998V2.6665Z" stroke="#3C83F6" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h1 className="header-text">Success Stories</h1>
                </div>
                <p className="header-text">Share your achievements and get inspired by others' journeys.</p>
            </div>

            <StatsCard stats={stats} />

            <Link to="/success-stories/my-story" className="share-story-btn">
                <span className="share-story-icon">+</span>
                Share Your Success Story
            </Link>

            <div className="stories-list">
                {stories.map(story => (
                    <StoryCard
                        key={story.id}
                        title={story.title}
                        author={story.author}
                        date={story.date}
                        content={story.description}
                        shareCount={story.likeCount || story.shareCount}
                        category={story.category}
                        storyId={story.id}
                        onLikeChange={(storyId, newLikeCount, isLiked) => {
                            setStories(prevStories =>
                                prevStories.map(story =>
                                    story.id === storyId
                                        ? { ...story, likeCount: newLikeCount }
                                        : story
                                )
                            );
                            // Update stats when individual story likes change
                            updateStatsFromLikeChange(storyId, isLiked);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default SuccessStories;
