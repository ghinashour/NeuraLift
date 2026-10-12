import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSuccessStories from '../../hooks/useSuccessStories';
import useUserData from '../../hooks/useUserData';
import Swal from 'sweetalert2';
import '../../styles/SuccessStories/MyStory.css';

const MyStory = () => {
    const navigate = useNavigate();
    const { createStory } = useSuccessStories();
    const { user, loading: userLoading } = useUserData();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        author: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update author field when user data is loaded
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                author: user.username || user.name || ''
            }));
        }
    }, [user]);

    const categories = [
        'Mindfulness',
        'Habits',
        'Goals',
        'Health',
        'Career',
        'Relationships',
        'Learning',
        'Fitness'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.category) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Please fill in all required fields',
                confirmButtonColor: '#6757A3'
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Create story using database
            const storyData = {
                title: formData.title,
                author: formData.author,
                description: formData.description,
                category: formData.category,
                isPublic: true
            };

            await createStory(storyData);

            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Story Shared!',
                text: 'Your success story has been shared! Thank you for inspiring others.',
                confirmButtonColor: '#6757A3'
            });

            // Reset form
            setFormData({
                title: '',
                description: '',
                category: '',
                author: user?.username || user?.name || ''
            });

            // Navigate back to success stories page
            navigate('/success-stories');
        } catch (error) {
            console.error('Error submitting story:', error);
            console.error('Error details:', error.response?.data || error.message);
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: error.response?.data?.message || error.message || 'Please check your connection and try again.',
                confirmButtonColor: '#6757A3'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    // Show loading state while fetching user data
    if (userLoading) {
        return (
            <div className="my-story">
                <div className="loading-message">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if user is not authenticated
    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="nl-page my-story-page">
            <div className="nl-hero">
                <div className="nl-hero-copy">
                    <p className="nl-eyebrow">Share Your Story</p>
                    <h1 className="nl-title">
                        Inspire someone
                        <br />with your <em>journey</em>.
                    </h1>
                    <p className="nl-lede">
                        Tell us what you overcame and what you achieved — your words
                        might be exactly what someone else needs today.
                    </p>
                </div>
                <p className="nl-hero-quote">“Every win deserves to be told.”</p>
            </div>

            <div className="my-story-content">
                <div className="form-section">
                    <form onSubmit={handleSubmit} className="story-form">
                        <div className="my-story-form-group">
                            <label htmlFor="title">Story Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="What's your success story about?"
                                required
                            />
                        </div>

                        <div className="my-story-form-group">
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                            >
                                <option value="">Select a category</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div className="my-story-form-group">
                            <label htmlFor="description">Your Story *</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Share the details of your success story. What challenges did you face? How did you overcome them? What did you achieve?"
                                rows="6"
                                required
                            />
                        </div>


                        <div className="my-story-form-actions">
                            <button
                                type="button"
                                onClick={() => navigate('/success-stories')}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Publishing...' : 'Publish Story'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="preview-section">
                    <h3>Preview</h3>
                    <div className="story-preview">
                        {formData.title || formData.author || formData.description ? (
                            <div className="preview-card">
                                <div className="story-header">
                                    <div className="author-avatar">
                                        <span className="avatar-text">
                                            {formData.author ? getInitials(formData.author) : '??'}
                                        </span>
                                    </div>
                                    <div className="story-meta">
                                        <h3 className="story-title">
                                            {formData.title || 'Your Story Title'}
                                        </h3>
                                        <p className="story-author">
                                            by {formData.author || 'Your Name'}
                                        </p>
                                    </div>
                                </div>

                                {formData.category && (
                                    <div className="story-category">
                                        <span className="category-tag">{formData.category}</span>
                                    </div>
                                )}

                                <div className="story-content">
                                    <p className="story-description">
                                        {formData.description || 'Your story description will appear here...'}
                                    </p>
                                </div>

                                <div className="story-footer">
                                    <div className="story-date">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M5.33333 1.33301V3.99967" stroke="#626A84" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M10.6667 1.33301V3.99967" stroke="#626A84" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12.6667 2.66699H3.33333C2.59695 2.66699 2 3.26395 2 4.00033V13.3337C2 14.07 2.59695 14.667 3.33333 14.667H12.6667C13.403 14.667 14 14.07 14 13.3337V4.00033C14 3.26395 13.403 2.66699 12.6667 2.66699Z" stroke="#626A84" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2 6.66699H14" stroke="#626A84" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span>{new Date().toLocaleDateString('en-US', {
                                            month: 'numeric',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}</span>
                                    </div>
                                    <div className="story-engagement">
                                        <div className="likes">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                                <path d="M12.9367 9.33333C13.93 8.36 14.9367 7.19333 14.9367 5.66667C14.9367 4.69421 14.5504 3.76158 13.8627 3.07394C13.1751 2.38631 12.2425 2 11.27 2C10.0967 2 9.27 2.33333 8.27 3.33333C7.27 2.33333 6.44333 2 5.27 2C4.29754 2 3.36491 2.38631 2.67727 3.07394C1.98964 3.76158 1.60333 4.69421 1.60333 5.66667C1.60333 7.2 2.60333 8.36667 3.60333 9.33333L8.27 14L12.9367 9.33333Z" stroke="#626A84" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span>0</span>
                                        </div>
                                        <button className="share-btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                                <path d="M12.84 5.33301C13.9446 5.33301 14.84 4.43758 14.84 3.33301C14.84 2.22844 13.9446 1.33301 12.84 1.33301C11.7355 1.33301 10.84 2.22844 10.84 3.33301C10.84 4.43758 11.7355 5.33301 12.84 5.33301Z" stroke="#626A84" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M4.84003 10C5.9446 10 6.84003 9.10457 6.84003 8C6.84003 6.89543 5.9446 6 4.84003 6C3.73546 6 2.84003 6.89543 2.84003 8C2.84003 9.10457 3.73546 10 4.84003 10Z" stroke="#626A84" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M12.84 14.667C13.9446 14.667 14.84 13.7716 14.84 12.667C14.84 11.5624 13.9446 10.667 12.84 10.667C11.7355 10.667 10.84 11.5624 10.84 12.667C10.84 13.7716 11.7355 14.667 12.84 14.667Z" stroke="#626A84" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M6.56671 9.00684L11.12 11.6602" stroke="#626A84" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M11.1134 4.33984L6.56671 6.99318" stroke="#626A84" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Share
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="preview-placeholder">
                                <p>Fill out the form to see a preview of your story</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyStory;
