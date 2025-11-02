import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '../../components/SuccessStories/StatsCard';
import StoryCard from '../../components/SuccessStories/StoryCard';
import useSuccessStories from '../../hooks/useSuccessStories';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import AILogo from '../../components/AiLogo';

import '../../styles/SuccessStories/SuccessStory.css';

const SuccessStory = () => {
    const {
        stories,
        stats,
        loading,
        error,
        toggleLike,
        trackShare
    } = useSuccessStories();

    const { user } = useContext(AuthContext); // Get user from AuthContext

    return (
        <div className="success-story">
            <div className="success-story-header">
                <div className="success-story-header-content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="33" height="32" viewBox="0 0 33 32" fill="none" className="success-story-header-icon">
                        <path d="M8.01999 12.0002H6.01999C5.13593 12.0002 4.28809 11.649 3.66296 11.0239C3.03784 10.3987 2.68665 9.55088 2.68665 8.66683C2.68665 7.78277 3.03784 6.93493 3.66296 6.30981C4.28809 5.68469 5.13593 5.3335 6.01999 5.3335H8.01999" stroke="#3C83F6" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M24.02 12.0002H26.02C26.904 12.0002 27.7519 11.649 28.377 11.0239C29.0021 10.3987 29.3533 9.55088 29.3533 8.66683C29.3533 7.78277 29.0021 6.93493 28.377 6.30981C27.7519 5.68469 26.904 5.3335 26.02 5.3335H24.02" stroke="#3C83F6" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5.35332 29.3335H26.6867" stroke="#3C83F6" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13.3533 19.5469V22.6669C13.3533 23.4002 12.7267 23.9735 12.06 24.2802C10.4867 25.0002 9.35332 26.9869 9.35332 29.3335" stroke="#3C83F6" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M18.6867 19.5469V22.6669C18.6867 23.4002 19.3133 23.9735 19.98 24.2802C21.5533 25.0002 22.6867 26.9869 22.6867 29.3335" stroke="#3C83F6" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M24.02 2.6665H8.01999V11.9998C8.01999 14.1216 8.86284 16.1564 10.3631 17.6567C11.8634 19.157 13.8983 19.9998 16.02 19.9998C18.1417 19.9998 20.1766 19.157 21.6768 17.6567C23.1771 16.1564 24.02 14.1216 24.02 11.9998V2.6665Z" stroke="#3C83F6" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h1 className="success-story-header-title">Success Stories</h1>
                </div>
                <p className="success-story-header-text">Share your achievements and get inspired by others' journeys.</p>
            </div>

            <StatsCard stats={stats} />

            <Link to="/success-stories/my-story" className="share-story-btn">
                <span className="share-story-icon">+</span>
                Share Your Success Story
            </Link>

            {loading && (
                <div className="loading-message">
                    <p>Loading success stories...</p>
                </div>
            )}

            {error && (
                <div className="error-message">
                    <p>Error: {error}</p>
                </div>
            )}

            <div className="story-list">
                {stories.map(story => (
                    <StoryCard
                        key={story._id || story.id}
                        title={story.title}
                        author={story.author}
                        date={story.createdAt}
                        content={story.description}
                        shareCount={story.shareCount || 0}
                        likeCount={story.likeCount || 0}
                        category={story.category}
                        storyId={story._id || story.id}
                        onLikeToggle={toggleLike}
                        onShare={(storyId) => {
                            // Fire and forget - don't await
                            return trackShare(storyId).catch(error => {
                                console.error('Error tracking share:', error);
                            });
                        }}
                        isLikedByCurrentUser={story.likes?.includes(user?.id)} // Pass if current user liked
                        currentUserId={user?.id} // Pass current user ID
                    />
                ))}
            </div>
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 1000
            }}>
                <AILogo />
            </div>
        </div>
    );
};

export default SuccessStory;
