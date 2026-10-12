import React from 'react';
import './Header.css';
import { useChat } from '../../../context/ChatContext';

const LandingMark = () => (
  <svg width="30" height="30" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M14 2C10 7 6 9 6 15a8 8 0 0 0 16 0c0-6-4-8-8-13Z" fill="#8E7FB8" />
    <path d="M14 6v16M14 12l-5-3M14 12l5-3M14 17l-4-2M14 17l4-2" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const sourceLabel = (source) => {
  if (source === 'groq') return 'Live AI · Groq';
  if (source === 'openai') return 'Live AI · OpenAI';
  if (source === 'openrouter') return 'Live AI';
  if (source === 'local') return 'Offline mode';
  return 'AI Assistant';
};

const Header = ({ source, title = 'NeuraLift Assistant', subtitle = 'Calm focus & wellness support' }) => {
  const { clearMessages } = useChat();
  return (
    <div className="chat-header nl-assistant-header">
      <div className="header-left">
        <span className="assistant-mark"><LandingMark /></span>
        <div className="header-text">
          <h1 className="header-title">{title}</h1>
          <p className="header-subtitle">
            <span className="online-dot" aria-hidden="true" />
            {subtitle} · <span className="source-badge">{sourceLabel(source)}</span>
          </p>
        </div>
      </div>
      <div className="header-right">
        <button className="header-clear" onClick={clearMessages} title="Start new conversation">
          New chat
        </button>
      </div>
    </div>
  );
};

export default Header;
