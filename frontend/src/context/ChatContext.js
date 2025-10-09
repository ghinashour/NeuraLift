import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [chatState, setChatState] = useState({
    isConnected: true,
    agentStatus: 'online',
    sessionId: `session-${Date.now()}`,
    userName: null
  });

  const updateChatState = (updates) => {
    setChatState(prev => ({ ...prev, ...updates }));
  };

  return (
    <ChatContext.Provider value={{ chatState, updateChatState }}>
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