import React, { useState, useEffect } from 'react';
import ShareButton from './ShareButton';
import '../../styles/SuccessStories/StoryCard.css';

const StoryCard = ({
    title,
    author,
    date,
    content,
    shareCount,
    likeCount,
    category,
    storyId,
    onLikeChange,
    onShare
}) => {
    // Load user's like state from localStorage (for UI persistence)
    const getStoredLikeState = () => {
        try {
            const stored = localStorage.getItem(`story-${storyId}-liked`);
            return stored ? JSON.parse(stored) : false;
        } catch (error) {
            console.error('Error loading like state:', error);
            return false;
        }
    };

    const [isLiked, setIsLiked] = useState(getStoredLikeState);
    const [currentLikeCount, setCurrentLikeCount] = useState(likeCount || 0);
    const [isProcessing, setIsProcessing] = useState(false);

    // Save user's like state to localStorage (for UI persistence across sessions)
    useEffect(() => {
        try {
            localStorage.setItem(`story-${storyId}-liked`, JSON.stringify(isLiked));
        } catch (error) {
            console.error('Error saving like state:', error);
        }
    }, [isLiked, storyId]);

    // Update like count when likeCount prop changes (from database)
    useEffect(() => {
        setCurrentLikeCount(likeCount || 0);
    }, [likeCount]);

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const handleLike = () => {
        // Prevent double-click glitches
        if (isProcessing) {
            return;
        }

        setIsProcessing(true);
        const previousLikeState = isLiked;

        // INSTANT UI update - no async/await here
        if (isLiked) {
            // Unlike
            setIsLiked(false);
            const newCount = Math.max(0, currentLikeCount - 1);
            setCurrentLikeCount(newCount);
        } else {
            // Like
            setIsLiked(true);
            const newCount = currentLikeCount + 1;
            setCurrentLikeCount(newCount);
        }

        // Fire and forget - don't wait for API response
        if (onLikeChange) {
            onLikeChange(storyId, previousLikeState)
                .then(() => {
                    setIsProcessing(false);
                })
                .catch(error => {
                    // Only revert on error, but don't block the UI
                    console.error('Error toggling like:', error);
                    // Revert the optimistic update on error
                    setIsLiked(previousLikeState);
                    setCurrentLikeCount(likeCount || 0);
                    setIsProcessing(false);
                });
        } else {
            setIsProcessing(false);
        }
    };

    return (
        <div className="story-card" data-story-id={storyId}>
            <div className="story-header">
                <div className="author-avatar">
                    <span className="avatar-text">{getInitials(author)}</span>
                </div>
                <div className="story-meta">
                    <h3 className="story-title">{title}</h3>
                    <p className="story-author">by {author}</p>
                </div>
                <div className="story-category">
                    <span className="category-tag">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="white" />
                        </svg>
                        {category}
                    </span>
                </div>
            </div>

            <div className="story-content">
                <p className="story-description">{content}</p>
            </div>

            <div className="story-footer">
                <div className="story-date">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M5.33333 1.33301V3.99967" stroke="#626A84" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10.6667 1.33301V3.99967" stroke="#626A84" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.6667 2.66699H3.33333C2.59695 2.66699 2 3.26395 2 4.00033V13.3337C2 14.07 2.59695 14.667 3.33333 14.667H12.6667C13.403 14.667 14 14.07 14 13.3337V4.00033C14 3.26395 13.403 2.66699 12.6667 2.66699Z" stroke="#626A84" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 6.66699H14" stroke="#626A84" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{date ? new Date(date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    }) : 'Unknown date'}</span>
                </div>
                <div className="story-engagement">
                    <div className="like-container">
                        <label className="ui-like">
                            <input
                                type="checkbox"
                                checked={isLiked}
                                onChange={handleLike}
                                disabled={isProcessing}
                            />
                            <div className="like">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </div>
                        </label>
                        <span className="like-count">{currentLikeCount}</span>
                    </div>
                    <ShareButton
                        storyId={storyId}
                        shareCount={shareCount}
                        onShare={onShare}
                    />
                </div>
            </div>
        </div>
    );
};

export default StoryCard;
