import React from 'react';
import './Header.css';
import logo from "./image.png";

const Header = ({ title, status, onMinimize }) => {
  return (
    <div className="chat-header">
      <div className="header-content">
        <div className="bot-avatar-small">
          <img src={logo} alt="logo" />
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