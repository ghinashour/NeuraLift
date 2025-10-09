import React, { useRef, useEffect } from 'react';
import MessageBubble from '../MessageBubble/MessageBubble';
import './MessageList.css';

const MessageList = ({ messages, onQuickReply }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="message-list">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isUser={message.sender === 'user'}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;