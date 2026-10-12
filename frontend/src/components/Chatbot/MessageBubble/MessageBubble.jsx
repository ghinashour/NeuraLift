import React from 'react';
import './MessageBubble.css';
import { formatTime } from '../../../utils/messageHelpers';

const BotMark = () => (
  <svg width="16" height="16" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M14 2C10 7 6 9 6 15a8 8 0 0 0 16 0c0-6-4-8-8-13Z" fill="#8E7FB8" />
    <path d="M14 6v16M14 12l-5-3M14 12l5-3M14 17l-4-2M14 17l4-2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const MessageBubble = ({ message }) => {
  // Safety check
  if (!message) return null;

  const { sender } = message;
  const isUser = sender === 'user';

  return (
    <div className={`message-row ${isUser ? 'row-user' : 'row-bot'}`}>
      {!isUser && (
        <span className="bubble-avatar" aria-hidden="true">
          <BotMark />
        </span>
      )}
      <div className={`message-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`}>
        <div className="bubble-content">{message.text}</div>
        {message.timestamp && (
          <div className="bubble-timestamp">{formatTime(message.timestamp)}</div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
