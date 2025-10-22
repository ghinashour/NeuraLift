import React from "react";
import "../../styles/Collaborate.css";

function InvitePopup({ onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Invite via Link</h2>
        <p>Share this link with others:</p>
        <input type="text" value="https://app.com/invite/12345" readOnly />
        <button className="copy-btn">📋 Copy</button>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default InvitePopup;