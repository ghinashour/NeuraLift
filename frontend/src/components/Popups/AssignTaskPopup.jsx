import React from "react";
import "../../styles/Collaborate.css";

function AssignTaskPopup({ onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>📝 Assign New Task</h2>
        <p>Create and assign a task to group members</p>
        <label>Task Name</label>
        <input type="text" placeholder="Enter task name" />
        <label>Task Description</label>
        <textarea placeholder="Enter task description"></textarea>
        <label>Assign To</label>
        <select>
          <option>John Doe</option>
          <option>Sarah Johnson</option>
        </select>
        <div className="attach">
          📎 Add attachments (images, pdf, etc.)
        </div>
        <button>Submit Task</button>
        <button className="close-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default AssignTaskPopup;