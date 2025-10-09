import React from 'react';
import './Header.css';

const Header = ({ title, status, onMinimize }) => {
  return (
    <div className="chat-header">
      <div className="header-content">
        <div className="bot-avatar-small">
          <svg className="bot-icon-small" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h2v2H7v-2zm8 0h2v2h-2v-2zm-4 0h2v2h-2v-2z"/>
          </svg>
          <div className="status-dot"></div>
        </div>
        <div className="agent-info">
          <h2 className="agent-title">{title}</h2>
          <p className="agent-status">{status}</p>
        </div>
      </div>
      {onMinimize && (
        <button onClick={onMinimize} className="minimize-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
            <line x1="8" y1="12" x2="16" y2="12" strokeWidth="2"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default Header;