import { useState, useCallback } from 'react';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback((text) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const addAIMessage = useCallback((text, suggestions = []) => {
    const aiMessage = {
      id: `msg-${Date.now()}`,
      text,
      sender: 'ai',
      timestamp: new Date().toISOString(),
      type: 'text',
      suggestions
    };
    
    setMessages(prev => [...prev, aiMessage]);
    return aiMessage;
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    addAIMessage,
    clearChat,
    isTyping,
    setIsTyping
  };
};
