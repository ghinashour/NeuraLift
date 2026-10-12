import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '../../components/SuccessStories/StatsCard';
import StoryCard from '../../components/SuccessStories/StoryCard';
import useSuccessStories from '../../hooks/useSuccessStories';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import AILogo from '../../components/AiLogo';
import { Plus } from 'lucide-react';

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
        <div className="nl-page success-page">
            <div className="nl-hero">
                <div className="nl-hero-copy">
                    <p className="nl-eyebrow">Success Stories</p>
                    <h1 className="nl-title">
                        Celebrate how far
                        <br />you&apos;ve <em>come</em>.
                    </h1>
                    <p className="nl-lede">
                        Share your achievements and get inspired by others&apos; journeys.
                        Every story is proof that progress is possible.
                    </p>
                </div>
                <p className="nl-hero-quote">“Your story could be someone&apos;s survival guide.”</p>
            </div>

            <StatsCard stats={stats} />

            <Link to="/success-stories/my-story" className="btn-primary share-story-btn">
                <Plus size={17} />
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
