import React from "react";
import "../../styles/Collaborate.css";

function CreateGroupPopup({ onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>👥 Create Group</h2>
        <p>Set up your group to start collaborating</p>
        <label>Group Name</label>
        <input type="text" placeholder="Enter group name" />
        <label>Group Description</label>
        <textarea placeholder="Enter description"></textarea>
        <button>Create Group</button>
        <button className="close-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default CreateGroupPopup;