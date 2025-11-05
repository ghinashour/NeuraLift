import React, { useState } from "react";
import "../../styles/Popup.css";

function AddMemberPopup({ onClose, onSubmit, groups }) {
  const [formData, setFormData] = useState({
    email: "",
    groupId: "",
    role: "member"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.groupId) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError("");
    
    try {
      await onSubmit(formData);
      // Success - form will be reset by parent component
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
      console.error('Error adding member:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="popup-header">
          <h2>👤 Add Member</h2>
          <p>Invite a new member to your group</p>
          <button className="popup-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="popup-body">
          {error && (
            <div className="error-message" style={{color: 'red', marginBottom: '16px', padding: '8px', background: '#ffeaea', borderRadius: '4px'}}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Select Group *</label>
              <select 
                name="groupId"
                value={formData.groupId}
                onChange={handleChange}
                className="form-select"
                required
                disabled={isSubmitting}
              >
                <option value="">Choose a group</option>
                {groups?.map(group => (
                  <option key={group._id} value={group._id}>
                    {group.name} ({group.members?.length || 0} members)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter member's email address"
                className="form-input"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select 
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-select"
                disabled={isSubmitting}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
              <p className="helper-text">
                Members can post and comment, admins can manage group settings.
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
                disabled={isSubmitting || !formData.email || !formData.groupId}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    Adding...
                  </>
                ) : (
                  'Add Member'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMemberPopup;