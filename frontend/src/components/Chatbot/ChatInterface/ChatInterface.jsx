import React from 'react';
import { useChat } from '../../hooks/useChat';
import ChatInterface from '../../components/Chatbot/ChatInterface/ChatInterface';

const ChatbotPage = () => {
  const { messages, sendMessage, isTyping } = useChat();

  const handleQuickReply = (text) => {
    sendMessage(text);
  };

  const lastMessage = messages[messages.length - 1];
  const suggestions = lastMessage?.suggestions || [];

  return (
    <ChatInterface
      messages={messages}
      onSendMessage={sendMessage}
      isTyping={isTyping}
      suggestions={suggestions}
      onQuickReply={handleQuickReply}
    />
  );
};

export default ChatbotPage;
