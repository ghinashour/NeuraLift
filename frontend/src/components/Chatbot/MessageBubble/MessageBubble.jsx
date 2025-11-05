import React from 'react';
import './MessageBubble.css';
import { formatTime } from '../../../utils/messageHelpers';

const MessageBubble = ({ message }) => {
  // Safety check
  if (!message) return null;
  
  const { sender, text, timestamp } = message;
  
  return (
    <div className={`message-bubble ${sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
      <div className="bubble-content">{text}</div>
      {timestamp && (
        <div className="bubble-timestamp">{formatTime(timestamp)}</div>
      )}
    </div>
  );
};

export default MessageBubble;