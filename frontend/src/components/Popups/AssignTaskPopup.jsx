import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Popup.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

function AssignTaskPopup({ onClose, onSubmit, groups }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    groupId: "",
    dueDate: "",
    priority: "medium"
  });
  const [groupMembers, setGroupMembers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Fetch members when group is selected
  useEffect(() => {
    const fetchGroupMembers = async () => {
      if (!formData.groupId) {
        setGroupMembers([]);
        return;
      }

      setLoadingMembers(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/collaborate/groups/${formData.groupId}/members`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setGroupMembers(response.data);
      } catch (error) {
        console.error("Error fetching group members:", error);
        setGroupMembers([]);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchGroupMembers();
  }, [formData.groupId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.assignedTo) {
      alert('Please fill in required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error assigning task:', error);
      alert('Failed to assign task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="popup-header">
          <h2>📝 Assign New Task</h2>
          <p>Create and assign a task to group members</p>
          <button className="popup-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="popup-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Task Name *</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task name"
                className="form-input"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Task Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
                className="form-textarea"
                rows="3"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Group (Optional)</label>
              <select 
                name="groupId"
                value={formData.groupId}
                onChange={handleChange}
                className="form-select"
                disabled={isSubmitting}
              >
                <option value="">No group</option>
                {groups?.map(group => (
                  <option key={group._id} value={group._id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Assign To *</label>
                <select 
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="form-select"
                  required
                  disabled={isSubmitting || loadingMembers}
                >
                  <option value="">Select member</option>
                  {groupMembers.map(member => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.email})
                    </option>
                  ))}
                  {formData.groupId && groupMembers.length === 0 && !loadingMembers && (
                    <option value="" disabled>No members in this group</option>
                  )}
                </select>
                {loadingMembers && (
                  <div className="helper-text">Loading members...</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select 
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="form-select"
                  disabled={isSubmitting}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input 
                type="date" 
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="form-input"
                disabled={isSubmitting}
                min={new Date().toISOString().split('T')[0]}
              />
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
                disabled={isSubmitting || !formData.title || !formData.assignedTo}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    Assigning...
                  </>
                ) : (
                  'Assign Task'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AssignTaskPopup;