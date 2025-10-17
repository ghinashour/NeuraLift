import React, { createContext, useContext, useState, useEffect } from 'react';
import puter from 'puter-js';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [chatState, setChatState] = useState({
    isConnected: false,
    agentStatus: 'offline',
    sessionId: `session-${Date.now()}`,
    userName: null,
  });

  const [ai, setAi] = useState(null);

  useEffect(() => {
    const initAI = async () => {
      try {
        const chat = await puter.ai.chat();
        setAi(chat);
        setChatState(prev => ({
          ...prev,
          isConnected: true,
          agentStatus: 'online',
        }));
      } catch (error) {
        console.error('Error initializing AI:', error);
      }
    };

    initAI();
  }, []);

  const updateChatState = (updates) => {
    setChatState(prev => ({ ...prev, ...updates }));
  };

  return (
    <ChatContext.Provider value={{ chatState, updateChatState, ai }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
};
