// components/Chatbot/ChatInterface/ChatInterface.js
import React, { useState, useRef, useEffect } from 'react';
import './ChatInterface.css';

const ChatInterface = ({ 
  messages, 
  onSendMessage, 
  isTyping, 
  onClearChat,
  title = "AI Assistant"
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputText]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && !isTyping) {
      onSendMessage(inputText.trim());
      setInputText('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chat-interface">
      {/* Header */}
      <div className="chat-header">
        <div className="header-content">
          <div className="bot-avatar">
            <div className="avatar-icon">🤖</div>
          </div>
          <div className="header-info">
            <h2 className="chat-title">{title}</h2>
            <p className="chat-status">
              {isTyping ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
        {onClearChat && messages.length > 0 && (
          <button 
            className="clear-chat-btn"
            onClick={onClearChat}
            title="Clear conversation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>Start a conversation</h3>
            <p>Ask me anything and I'll do my best to help you!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
              >
                <div className="message-avatar">
                  {message.sender === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content">
                  <div className="message-text">
                    {message.text}
                  </div>
                  <div className="message-time">
                    {formatMessageTime(message.timestamp || Date.now())}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message ai-message typing-indicator">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator-content">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="typing-text">AI is typing...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} className="scroll-anchor" />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="input-area">
        <div className="input-container">
          <div className="text-input-wrapper">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              disabled={isTyping}
              className="message-input"
              rows="1"
            />
            <div className="input-actions">
              <button 
                type="button"
                className="action-button"
                onClick={() => setInputText('')}
                disabled={!inputText.trim()}
                title="Clear input"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={!inputText.trim() || isTyping}
            className="send-button"
            title="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
        <div className="input-footer">
          <span className="input-hint">
            Press Enter to send, Shift+Enter for new line
          </span>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;