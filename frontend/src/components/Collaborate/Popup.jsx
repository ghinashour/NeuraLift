// src/components/collaborate/Popup.js
import React from "react";
import "../../styles/Collaborate.css";

/**
 * Reusable popup modal. Children are the content.
 */
export default function Popup({ children, onClose }) {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}