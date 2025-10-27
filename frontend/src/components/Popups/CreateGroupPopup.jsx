import React, { useState } from "react";
import "../../styles/Popup.css";

function CreateGroupPopup({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError("");
    
    try {
      await onSubmit(formData);
      // If successful, the parent component should close the popup
    } catch (error) {
      console.error('Error creating group:', error);
      // Get detailed error message
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to create group. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="popup-header">
          <h2>👥 Create Group</h2>
          <p>Set up your group to start collaborating</p>
          <button className="popup-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="popup-body">
          {/* Error Display */}
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Group Name *</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter group name"
                className="form-input"
                required
                maxLength="50"
                disabled={isSubmitting}
              />
              <div className="character-count">
                {formData.name.length}/50
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Group Description *</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                className="form-textarea"
                rows="4"
                required
                maxLength="200"
                disabled={isSubmitting}
              />
              <div className="character-count">
                {formData.description.length}/200
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="checkbox-input"
                  disabled={isSubmitting}
                />
                <span className="checkbox-custom"></span>
                Public Group
              </label>
              <p className="helper-text">
                Public groups can be discovered by anyone. Private groups are invite-only.
              </p>
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
                disabled={isSubmitting || !formData.name.trim() || !formData.description.trim()}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    Creating...
                  </>
                ) : (
                  'Create Group'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateGroupPopup;