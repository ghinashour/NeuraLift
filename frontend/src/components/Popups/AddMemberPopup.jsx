import React from "react";
import "../../styles/Collaborate.css";

function AddMemberPopup({ onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>➕ Add Member</h2>
        <p>Invite a new member to your group</p>
        <label>Email</label>
        <input type="email" placeholder="Enter member email" />
        <button>Add Member</button>
        <button className="close-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default AddMemberPopup;