import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { loadChatHistory, saveChatHistory, clearChatHistory as clearHistoryUtil } from '../utils/localStorage';

const ChatContext = createContext();

// Initial bot message for a fresh start
const INITIAL_MESSAGE = { 
  id: 1, 
  sender: "bot", 
  text: "Welcome to NeuraLift! How can I help you today?",
  timestamp: new Date()
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Load chat history on mount
  useEffect(() => {
    const history = loadChatHistory();
    if (history && history.length > 0) {
      setMessages(history);
    } else {
      setMessages([INITIAL_MESSAGE]);
    }
  }, []);

  // Save chat history whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  const addMessage = useCallback((message) => {
    const newMessage = {
      id: Date.now(),
      timestamp: new Date(),
      ...message
    };
    // Use functional update to ensure we get the latest state
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const clearMessages = useCallback(() => {
    clearHistoryUtil(); // Clear localStorage
    setMessages([INITIAL_MESSAGE]);
  }, []);

  return (
    <ChatContext.Provider value={{
      messages,
      isTyping,
      setIsTyping,
      addMessage,
      clearMessages
    }}>
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