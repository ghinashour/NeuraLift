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

  if (!messages || !Array.isArray(messages)) {
    return <div className="message-list">Loading…</div>;
  }

  return (
    <div className="message-list" aria-live="polite">
      {messages.length <= 1 && (
        <div className="assistant-welcome">
          <strong>Hi, I&apos;m NeuraLift Assistant.</strong>
          <p>Ask me for a focus plan, a 2-minute stress reset, sleep tips, or help using NeuraLift. I&apos;m powered by live AI (Groq) with offline fallback.</p>
        </div>
      )}
      {messages.map((message) => {
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
