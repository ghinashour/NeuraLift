// components/ChatbotPage/ChatbotPage.js
import React, { useState } from "react";
import { useChat } from "../../hooks/useChat";
import Header from "../../components/Chatbot/Header/Header";
import WelcomeScreen from "../../components/Chatbot/WelcomeScreen/WelcomeScreen";
import ChatInterface from "../../components/Chatbot/ChatInterface/ChatInterface";
import "./ChatbotPage.css";

const ChatbotContent = () => {
  const { messages, sendMessage, isTyping, clearChat } = useChat();
  const [showWelcome, setShowWelcome] = useState(true);

  const suggestedTopics = [
    { id: 1, text: "How can I add a story?" },
    { id: 2, text: "Tell me about NEURALIFT" },
    { id: 3, text: "Get started" },
  ];

  const handleSendMessage = async (text) => {
    if (showWelcome) setShowWelcome(false);
    await sendMessage(text);
  };

  const handleStartChat = (initialMessage) => {
    setShowWelcome(false);
    handleSendMessage(initialMessage);
  };

  const handleRestart = () => {
    clearChat();
    setShowWelcome(true);
  };

  return (
    <div className="chatbot-page">
      {!showWelcome && (
        <Header 
          title="NEURALIFT Assistant" 
          status="Online" 
          onMinimize={handleRestart}
        />
      )}
      <div className="chatbot-content">
        {showWelcome ? (
          <WelcomeScreen
            onStartChat={handleStartChat}
            suggestedTopics={suggestedTopics}
          />
        ) : (
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
          />
        )}
      </div>
    </div>
  );
};

const ChatbotPage = () => {
  return <ChatbotContent />;
};

export default ChatbotPage;