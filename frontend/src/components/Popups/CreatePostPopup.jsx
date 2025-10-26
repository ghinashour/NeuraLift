import React, { useState } from "react";
import "../../styles/Popup.css";

function CreatePostPopup({ onClose, onSubmit }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Please enter some content');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ content });
      setContent('');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="popup-header">
          <h2>✍️ Create Post</h2>
          <p>Share your thoughts with the community</p>
          <button className="popup-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="popup-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Your Post *</label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind? Share your questions, ideas, or updates..."
                className="form-textarea"
                rows="6"
                required
                maxLength="500"
              />
              <div className="character-count">
                {content.length}/500
              </div>
            </div>
            
            <div className="popup-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting || !content.trim()}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    Posting...
                  </>
                ) : (
                  'Share Post'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePostPopup;