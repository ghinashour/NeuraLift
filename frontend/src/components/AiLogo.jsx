// components/AILogo/AILogo.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AILogo.css';

const AILogo = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/Chatbot'); // Adjust this path to match your chatbot route
  };

  return (
    <div className="ai-logo-container" onClick={handleClick}>
      <div className="ai-logo">
        <div className="ai-logo-core"></div>
      </div>
      <span className="ai-logo-text">NeuraLift Assistant</span>
    </div>
  );
};

export default AILogo;