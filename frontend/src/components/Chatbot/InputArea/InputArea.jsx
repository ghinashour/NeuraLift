import React, { useState } from 'react';
import './InputArea.css';

const InputArea = ({ onSendMessage, placeholder = 'Ask anything', disabled = false }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="input-area">
      <div className="input-container">
        <button type="button" className="input-icon-button" disabled={disabled}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="message-input"
        />
        
        <button type="button" className="input-icon-button" disabled={disabled}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || disabled}
          className="send-button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="22" y1="2" x2="11" y2="13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default InputArea;