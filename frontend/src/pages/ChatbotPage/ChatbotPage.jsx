// src/pages/ChatbotPage/ChatbotPage.jsx
import React from "react";
import "./ChatbotPage.css";
import { useChat } from "../../hooks/useChat";
import ChatInterface from "../../components/Chatbot/ChatInterface/ChatInterface";

const ChatbotPage = () => {
  const { messages, sendMessage, isTyping, chatEndRef } = useChat();

  return (
    <div className="chatbot-page">
      <ChatInterface
        messages={messages}
        onSendMessage={sendMessage}
        isTyping={isTyping}
        chatEndRef={chatEndRef}
      />
    </div>
  );
};

export default ChatbotPage;
