// components/AILogo/AILogo.js — floating assistant launcher (fixed corner on inner pages)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AILogo.css';

const AssistantMark = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M14 2C10 7 6 9 6 15a8 8 0 0 0 16 0c0-6-4-8-8-13Z" fill="#C9BFE8" />
    <path d="M14 6v16M14 12l-5-3M14 12l5-3M14 17l-4-2M14 17l4-2" stroke="#2E2A44" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const AILogo = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/Chatbot'); // Adjust this path to match your chatbot route
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      type="button"
      className="ai-fab"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label="Open NeuraLift Assistant chat"
      title="NeuraLift Assistant"
    >
      <span className="ai-fab-tip" aria-hidden="true">Chat with NeuraLift</span>
      <span className="ai-fab-orb" aria-hidden="true">
        <AssistantMark />
      </span>
      <span className="ai-fab-status" aria-hidden="true" />
    </button>
  );
};

export default AILogo;
