import React from 'react';
import './TypingIndicator.css';

const TypingIndicator = ({ isVisible, name = 'AI' }) => {
  if (!isVisible) return null;

  return (
    <div className="typing-indicator-container">
      <div className="typing-indicator">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;