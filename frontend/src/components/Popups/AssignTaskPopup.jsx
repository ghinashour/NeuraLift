import React, { useState } from "react";
import "../../styles/Popup.css";

function AssignTaskPopup({ onClose, onSubmit, groups }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    groupId: "",
    dueDate: "",
    priority: "medium"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
              />
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
                >
                  <option value="">Select member</option>
                  <option value="user1">John Doe</option>
                  <option value="user2">Sarah Johnson</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select 
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Group (Optional)</label>
                <select 
                  name="groupId"
                  value={formData.groupId}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">No group</option>
                  {groups?.map(group => (
                    <option key={group._id} value={group._id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input 
                  type="date" 
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="attach-section">
              <div className="attach-icon">📎</div>
              <div className="attach-text">Add attachments (images, PDF, etc.)</div>
              <input type="file" style={{ display: 'none' }} />
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
                disabled={isSubmitting}
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