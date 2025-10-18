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
                confirmButtonColor: '#3C83F6'
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
                confirmButtonColor: '#3C83F6'
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
                confirmButtonColor: '#3C83F6'
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
        <div className="my-story">
            <div className="my-story-header">
                <div className="header-content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="33" height="32" viewBox="0 0 33 32" fill="none" className="header-icon">
                        <path d="M8.01999 12.0002H6.01999C5.13593 12.0002 4.28809 11.649 3.66296 11.0239C3.03784 10.3987 2.68665 9.55088 2.68665 8.66683C2.68665 7.78277 3.03784 6.93493 3.66296 6.30981C4.28809 5.68469 5.13593 5.3335 6.01999 5.3335H8.01999" stroke="#3C83F6" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M24.02 12.0002H26.02C26.904 12.0002 27.7519 11.649 28.377 11.0239C29.0021 10.3987 29.3533 9.55088 29.3533 8.66683C29.3533 7.78277 29.0021 6.93493 28.377 6.30981C27.7519 5.68469 26.904 5.3335 26.02 5.3335H24.02" stroke="#3C83F6" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5.35332 29.3335H26.6867" stroke="#3C83F6" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13.3533 19.5469V22.6669C13.3533 23.4002 12.7267 23.9735 12.06 24.2802C10.4867 25.0002 9.35332 26.9869 9.35332 29.3335" stroke="#3C83F6" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M18.6867 19.5469V22.6669C18.6867 23.4002 19.3133 23.9735 19.98 24.2802C21.5533 25.0002 22.6867 26.9869 22.6867 29.3335" stroke="#3C83F6" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M24.02 2.6665H8.01999V11.9998C8.01999 14.1216 8.86284 16.1564 10.3631 17.6567C11.8634 19.157 13.8983 19.9998 16.02 19.9998C18.1417 19.9998 20.1766 19.157 21.6768 17.6567C23.1771 16.1564 24.02 14.1216 24.02 11.9998V2.6665Z" stroke="#3C83F6" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h1 className="header-text">Share Your Success Story</h1>
                </div>
                <p className="header-text">Inspire others with your journey and achievements.</p>
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
