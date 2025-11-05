import React from 'react';
import './ChatbotPage.css';
import ChatInterface from '../../components/Chatbot/ChatInterface/ChatInterface';
import { ChatProvider } from '../../context/ChatContext';

const ChatbotPage = () => {
  return (
    <ChatProvider>
      <div className="chatbot-page">
        <ChatInterface />
      </div>
    </ChatProvider>
  );
};

export default ChatbotPage;