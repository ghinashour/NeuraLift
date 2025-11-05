import React, { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    { 
      id: Date.now(), 
      sender: "bot", 
      text: "Welcome to NeuraLift! How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = useCallback((message) => {
    const newMessage = {
      id: Date.now() + Math.random(), // Ensure unique ID
      timestamp: new Date(),
      ...message
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      { 
        id: Date.now(), 
        sender: "bot", 
        text: "Welcome to NeuraLift! How can I help you today?",
        timestamp: new Date()
      }
    ]);
  }, []);

  const value = {
    messages,
    isTyping,
    setIsTyping,
    addMessage,
    clearMessages
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};