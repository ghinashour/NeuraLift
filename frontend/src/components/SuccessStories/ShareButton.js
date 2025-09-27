import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/SuccessStories/ShareButton.css';

const ShareButton = ({ storyId, shareCount, onShare }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isShared, setIsShared] = useState(false);
    const [sharedPlatform, setSharedPlatform] = useState('');

    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape' && isDropdownOpen) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            document.body.style.paddingRight = '15px'; // Prevent layout shift
            // Add class to the specific story card
            const storyCard = document.querySelector(`[data-story-id="${storyId}"]`);
            if (storyCard) {
                storyCard.classList.add('share-modal-open');
            }
        } else {
            document.body.style.overflow = 'unset'; // Restore scrolling
            document.body.style.paddingRight = '0px'; // Restore padding
            // Remove class from the specific story card
            const storyCard = document.querySelector(`[data-story-id="${storyId}"]`);
            if (storyCard) {
                storyCard.classList.remove('share-modal-open');
            }
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
            // Remove class from the specific story card
            const storyCard = document.querySelector(`[data-story-id="${storyId}"]`);
            if (storyCard) {
                storyCard.classList.remove('share-modal-open');
            }
        };
    }, [isDropdownOpen, storyId]);

    const getPlatformName = (platform) => {
        const platformNames = {
            'copy': 'Clipboard',
            'twitter': 'Twitter',
            'facebook': 'Facebook',
            'linkedin': 'LinkedIn',
            'whatsapp': 'WhatsApp',
            'email': 'Email',
            'landing': 'Landing Page'
        };
        return platformNames[platform] || 'Platform';
    };

    const handleShareOption = (option) => {
        console.log('Share option clicked:', option); // Debug log
        setIsShared(true);
        setSharedPlatform(option);

        const storyUrl = `${window.location.origin}/success-stories#story-${storyId}`;
        const shareText = `Check out this inspiring success story!`;

        // Handle different share options
        switch (option) {
            case 'copy':
                // Copy story link to clipboard
                navigator.clipboard.writeText(storyUrl).then(() => {
                    console.log('Story link copied to clipboard');
                }).catch(err => {
                    console.error('Failed to copy:', err);
                });
                break;
            case 'landing':
                // Add to landing page
                try {
                    // Get the current story data from the page
                    const storyElement = document.querySelector(`[data-story-id="${storyId}"]`);
                    if (storyElement) {
                        const title = storyElement.querySelector('.story-title')?.textContent || 'Success Story';
                        const author = storyElement.querySelector('.story-author')?.textContent?.replace('by ', '') || 'Anonymous';
                        const content = storyElement.querySelector('.story-description')?.textContent || '';
                        const category = storyElement.querySelector('.category-tag')?.textContent?.trim() || 'General';
                        const date = storyElement.querySelector('.story-date span')?.textContent || new Date().toLocaleDateString();

                        // Create story object for landing page
                        const landingPageStory = {
                            id: `landing-${storyId}-${Date.now()}`,
                            author: author,
                            category: category,
                            description: content,
                            achievement: `Shared from Success Stories`,
                            likeCount: 0,
                            date: date,
                            originalStoryId: storyId,
                            sharedToLanding: true
                        };

                        // Get existing landing page stories
                        const existingStories = JSON.parse(localStorage.getItem('landingPageStories') || '[]');

                        // Check if this story is already shared to landing page
                        const alreadyShared = existingStories.some(story => story.originalStoryId === storyId);

                        if (alreadyShared) {
                            alert('This story has already been added to the landing page!');
                        } else {
                            // Add to landing page stories
                            const updatedStories = [...existingStories, landingPageStory];
                            localStorage.setItem('landingPageStories', JSON.stringify(updatedStories));

                            // Dispatch custom event to notify other components
                            const event = new CustomEvent('landingPageStoriesUpdated', {
                                detail: { stories: updatedStories, newStory: landingPageStory }
                            });
                            window.dispatchEvent(event);

                            console.log(`Story ${storyId} added to landing page`);
                            alert('Story successfully added to the landing page! It will appear in the Success Stories section.');
                        }
                    } else {
                        alert('Unable to find story data. Please try again.');
                    }
                } catch (error) {
                    console.error('Error adding story to landing page:', error);
                    alert('Failed to add story to landing page. Please try again.');
                }
                break;
            case 'twitter':
                // Share on Twitter
                const twitterUrl = encodeURIComponent(storyUrl);
                const twitterText = encodeURIComponent(shareText);
                window.open(`https://twitter.com/intent/tweet?text=${twitterText}&url=${twitterUrl}`, '_blank');
                break;
            case 'facebook':
                // Share on Facebook
                const facebookUrl = encodeURIComponent(storyUrl);
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${facebookUrl}`, '_blank');
                break;
            case 'linkedin':
                // Share on LinkedIn
                const linkedinUrl = encodeURIComponent(storyUrl);
                const linkedinTitle = encodeURIComponent('Inspiring Success Story');
                const linkedinSummary = encodeURIComponent(shareText);
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${linkedinUrl}&title=${linkedinTitle}&summary=${linkedinSummary}`, '_blank');
                break;
            case 'whatsapp':
                // Share on WhatsApp
                const whatsappText = encodeURIComponent(`${shareText} ${storyUrl}`);
                window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
                break;
            case 'email':
                // Share via email
                const emailSubject = encodeURIComponent('Inspiring Success Story');
                const emailBody = encodeURIComponent(`${shareText}\n\n${storyUrl}`);
                window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`, '_self');
                break;
            default:
                console.log(`Share option ${option} selected`);
        }

        onShare && onShare(storyId, option);
        setIsDropdownOpen(false);

        // Reset the shared state after 3 seconds
        setTimeout(() => {
            setIsShared(false);
            setSharedPlatform('');
        }, 3000);
    };

    // SVG Icon Components
    const Copy = (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 408 480" {...props}>
            <path fill="currentColor" d="M299 5v43H43v299H0V48q0-18 12.5-30.5T43 5h256zm64 86q17 0 29.5 12.5T405 133v299q0 18-12.5 30.5T363 475H128q-18 0-30.5-12.5T85 432V133q0-17 12.5-29.5T128 91h235zm0 341V133H128v299h235z"></path>
        </svg>
    );

    const Facebook = (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 224 432" {...props}>
            <path fill="currentColor" d="M145 429H66V235H0v-76h66v-56q0-48 27-74t72-26q36 0 59 3v67l-41 1q-22 0-30 9t-8 27v49h76l-10 76h-66v194z"></path>
        </svg>
    );

    const Whatsapp = (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 432 432" {...props}>
            <path fill="currentColor" d="M364.5 65Q427 127 427 214.5T364.5 364T214 426q-54 0-101-26L0 429l30-109Q2 271 2 214q0-87 62-149T214 3t150.5 62zM214 390q73 0 125-51.5T391 214T339 89.5T214 38T89.5 89.5T38 214q0 51 27 94l4 6l-18 65l67-17l6 3q42 25 90 25zm97-132q9 5 10 7q4 6-3 25q-3 8-15 15.5t-21 9.5q-18 2-33-2q-17-6-30-11q-8-4-15.5-8.5t-14.5-9t-13-9.5t-11.5-10t-10.5-10.5t-8.5-9.5t-7-8.5t-5.5-7t-3.5-5L128 222q-22-29-22-55q0-24 19-44q6-7 14-7q6 0 10 1q8 0 12 9q2 3 6 13l7 17.5l3 8.5q3 5 1 9q-3 7-5 9l-3 3l-3 3.5l-2 2.5q-6 6-3 11q13 22 30 37q13 11 43 26q7 3 11-1q12-15 17-21q4-6 12-3q6 3 36 17z"></path>
        </svg>
    );

    const Home = (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 432 384" {...props}>
            <path fill="currentColor" d="M171 363H64V192H0L213 0l214 192h-64v171H256V235h-85v128z"></path>
        </svg>
    );

    const X = (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 251 256" {...props}>
            <path fill="currentColor" d="M149.079 108.399L242.33 0h-22.098l-80.97 94.12L74.59 0H0l97.796 142.328L0 256h22.1l85.507-99.395L175.905 256h74.59L149.073 108.399zM118.81 143.58l-9.909-14.172l-78.84-112.773h33.943l63.625 91.011l9.909 14.173l82.705 118.3H186.3l-67.49-96.533z"></path>
        </svg>
    );

    const Linkedin = (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1025 1024" {...props}>
            <path fill="currentColor" d="M896.428 1024h-768q-53 0-90.5-37.5T.428 896V128q0-53 37.5-90.5t90.5-37.5h768q53 0 90.5 37.5t37.5 90.5v768q0 53-37.5 90.5t-90.5 37.5zm-640-864q0-13-9.5-22.5t-22.5-9.5h-64q-13 0-22.5 9.5t-9.5 22.5v64q0 13 9.5 22.5t22.5 9.5h64q13 0 22.5-9.5t9.5-22.5v-64zm0 192q0-13-9.5-22.5t-22.5-9.5h-64q-13 0-22.5 9.5t-9.5 22.5v512q0 13 9.5 22.5t22.5 9.5h64q13 0 22.5-9.5t9.5-22.5V352zm640 160q0-80-56-136t-136-56q-44 0-96.5 14t-95.5 39v-21q0-13-9.5-22.5t-22.5-9.5h-64q-13 0-22.5 9.5t-9.5 22.5v512q0 13 9.5 22.5t22.5 9.5h64q13 0 22.5-9.5t9.5-22.5V576q0-53 37.5-90.5t90.5-37.5t90.5 37.5t37.5 90.5v288q0 13 9.5 22.5t22.5 9.5h64q13 0 22.5-9.5t9.5-22.5V512z"></path>
        </svg>
    );

    const Email = (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
            <path fill="currentColor" d="m16.484 11.976l6.151-5.344v10.627zm-7.926.905l2.16 1.875c.339.288.781.462 1.264.462h.017h-.001h.014c.484 0 .926-.175 1.269-.465l-.003.002l2.16-1.875l6.566 5.639H1.995zM1.986 5.365h20.03l-9.621 8.356a.612.612 0 0 1-.38.132h-.014h.001h-.014a.61.61 0 0 1-.381-.133l.001.001zm-.621 1.266l6.15 5.344l-6.15 5.28zm21.6-2.441c-.24-.12-.522-.19-.821-.19H1.859a1.87 1.87 0 0 0-.835.197l.011-.005A1.856 1.856 0 0 0 0 5.855v12.172a1.86 1.86 0 0 0 1.858 1.858h20.283a1.86 1.86 0 0 0 1.858-1.858V5.855c0-.727-.419-1.357-1.029-1.66l-.011-.005z"></path>
        </svg>
    );

    const shareOptions = [
        { id: 'copy', label: 'Copy Link', icon: <Copy /> },
        { id: 'twitter', label: 'Share on Twitter', icon: <X /> },
        { id: 'facebook', label: 'Share on Facebook', icon: <Facebook /> },
        { id: 'linkedin', label: 'Share on LinkedIn', icon: <Linkedin /> },
        { id: 'whatsapp', label: 'Share on WhatsApp', icon: <Whatsapp /> },
        { id: 'email', label: 'Share via Email', icon: <Email /> },
        { id: 'landing', label: 'Add to Landing Page', icon: <Home /> }
    ];

    return (
        <>
            <div className="share-container">
                <button
                    className={`share-btn ${isShared ? 'shared' : ''}`}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                        <path d="M12.84 5.33301C13.9446 5.33301 14.84 4.43758 14.84 3.33301C14.84 2.22844 13.9446 1.33301 12.84 1.33301C11.7355 1.33301 10.84 2.22844 10.84 3.33301C10.84 4.43758 11.7355 5.33301 12.84 5.33301Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4.84003 10C5.9446 10 6.84003 9.10457 6.84003 8C6.84003 6.89543 5.9446 6 4.84003 6C3.73546 6 2.84003 6.89543 2.84003 8C2.84003 9.10457 3.73546 10 4.84003 10Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.84 14.667C13.9446 14.667 14.84 13.7716 14.84 12.667C14.84 11.5624 13.9446 10.667 12.84 10.667C11.7355 10.667 10.84 11.5624 10.84 12.667C10.84 13.7716 11.7355 14.667 12.84 14.667Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6.56671 9.00684L11.12 11.6602" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M11.1134 4.33984L6.56671 6.99318" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {isShared ? `Shared to ${getPlatformName(sharedPlatform)}!` : 'Share'}
                </button>
            </div>

            {isDropdownOpen && createPortal(
                <div
                    className="share-modal-overlay"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDropdownOpen(false);
                    }}
                >
                    <div
                        className="share-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="share-modal-header">
                            <h3>Share Success Story</h3>
                            <button
                                className="close-btn"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div className="share-modal-content">
                            <p className="share-description">Choose how you'd like to share this inspiring success story:</p>
                            <div className="share-options-grid">
                                {shareOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        className="share-option-card"
                                        onClick={() => handleShareOption(option.id)}
                                    >
                                        <span className="option-icon">{option.icon}</span>
                                        <span className="option-label">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default ShareButton;
