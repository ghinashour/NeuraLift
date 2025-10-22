import React from "react";
import "../../styles/Collaborate.css";

function CreatePostPopup({ onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>✍ Share a Post</h2>
        <label>Your Name</label>
        <input type="text" placeholder="Enter your name" />
        <label>Your Question / Post</label>
        <textarea placeholder="What's on your mind?"></textarea>
        <button>Share Post</button>
        <button className="close-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default CreatePostPopup;