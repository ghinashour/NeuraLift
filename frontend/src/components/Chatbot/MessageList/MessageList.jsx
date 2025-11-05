import React, { useRef, useEffect } from 'react';
import './MessageList.css';
import MessageBubble from '../MessageBubble/MessageBubble';
import TypingIndicator from '../TypingIndicator/TypingIndicator';
import { useChat } from '../../../context/ChatContext';

const MessageList = () => {
  const { messages, isTyping } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Safety check for messages
  if (!messages || !Array.isArray(messages)) {
    return <div className="message-list">Loading...</div>;
  }

  return (
    <div className="message-list">
      {messages.map((message) => {
        // Safety check for each message
        if (!message || !message.id) return null;
        
        return (
          <div
            key={message.id}
            className={`message-wrapper ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <MessageBubble message={message} />
          </div>
        );
      })}
      
      {isTyping && (
        <div className="message-wrapper bot-message">
          <div className="typing-bubble">
            <TypingIndicator />
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;