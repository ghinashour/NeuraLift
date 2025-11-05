import React from 'react';
import './Header.css';
import Avatar from '../Header/image.png';
const Header = ({ title = "Chatbot", subtitle = "Support Agent" }) => {
  return (
    <div className="chat-header">
      <div className="header-left">
        <img src={Avatar} alt="Avatar" className="avatar" />
        <div className="header-text">
          <h1 className="header-title">{title}</h1>
          <p className="header-subtitle">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default Header;