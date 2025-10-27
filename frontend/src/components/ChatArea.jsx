// src/components/ChatArea.jsx
import React, { useState, useRef, useEffect } from "react";
import "../styles/ChatArea.css";

const ChatArea = ({
  group = null,
  messages = [],
  onPostMessage,
  loading = false,
  onBackToGroups = null
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (onPostMessage) {
      onPostMessage(newMessage);
      setNewMessage("");
      setIsTyping(false);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    if (!messages || !Array.isArray(messages)) return {};

    const grouped = {};
    
    messages.forEach(message => {
      if (!message) return;
      
      const date = formatDate(message.createdAt || message.ts);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });

    return grouped;
  };

  const groupedMessages = groupMessagesByDate();

  if (loading) {
    return (
      <div className="chat-area">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="chat-area">
        <div className="no-group-selected">
          <div className="empty-state-icon">💬</div>
          <h3>Welcome to Collaboration</h3>
          <p>Select a group from the sidebar to start chatting with your team</p>
          {onBackToGroups && (
            <button className="browse-groups-btn" onClick={onBackToGroups}>
              Browse Groups
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="chat-area">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="header-left">
          {onBackToGroups && (
            <button className="back-btn mobile-only" onClick={onBackToGroups}>
              ←
            </button>
          )}
          <div className="group-info">
            <div className="group-avatar">
              {group.name ? group.name.charAt(0).toUpperCase() : 'G'}
            </div>
            <div>
              <h3>{group.name || "Unnamed Group"}</h3>
              <p>
                {group.members ? group.members.length : 0} members • 
                {group.description || "Collaboration group"}
              </p>
            </div>
          </div>
        </div>
        
        <div className="header-actions">
          <button className="header-btn" title="Video call">
            📹
          </button>
          <button className="header-btn" title="Group info">
            ℹ️
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {Object.keys(groupedMessages).length === 0 ? (
          <div className="no-messages">
            <div className="empty-state-icon">💭</div>
            <h4>No messages yet</h4>
            <p>Be the first to start the conversation in this group!</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="message-date-group">
              <div className="date-divider">
                <span>{date}</span>
              </div>
              
              {dateMessages.map((message, index) => {
                if (!message) return null;

                const isSystem = message.type === 'system' || message.type === 'task_update';
                const isConsecutive = index > 0 && 
                  dateMessages[index - 1]?.sender?._id === message.sender?._id &&
                  !isSystem;
                
                return (
                  <div
                    key={message._id || message.id || index}
                    className={`message ${isSystem ? 'system-message' : 'user-message'} ${
                      isConsecutive ? 'consecutive' : ''
                    }`}
                  >
                    {!isSystem && message.sender && !isConsecutive && (
                      <div className="message-avatar" title={message.sender.name}>
                        {message.sender.avatar ? (
                          <img 
                            src={message.sender.avatar} 
                            alt={message.sender.name} 
                          />
                        ) : (
                          <span>
                            {message.sender.name ? 
                              message.sender.name.charAt(0).toUpperCase() : 'U'
                            }
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="message-content">
                      {!isSystem && message.sender && !isConsecutive && (
                        <div className="message-sender">
                          {message.sender.name || 'Unknown User'}
                          <span className="message-time">
                            {formatTime(message.createdAt || message.ts)}
                          </span>
                        </div>
                      )}
                      
                      <div className="message-bubble">
                        <div className="message-text">
                          {message.content}
                        </div>
                        
                        {(isSystem || isConsecutive) && (
                          <div className="message-time compact">
                            {formatTime(message.createdAt || message.ts)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="message-input-form">
        <div className="input-container">
          <button type="button" className="attach-btn" title="Attach file">
            📎
          </button>
          
          <div className="text-input-wrapper">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message... (Press Enter to send, Shift+Enter for new line)"
              disabled={!group}
              rows={1}
              className="message-textarea"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={!newMessage.trim() || !group}
            className="send-btn"
            title="Send message"
          >
            {newMessage.trim() ? '↑' : '➤'}
          </button>
        </div>
        
        <div className="input-actions">
          <span className="char-count">
            {newMessage.length}/1000
          </span>
        </div>
      </form>
    </div>
  );
};

export default ChatArea;