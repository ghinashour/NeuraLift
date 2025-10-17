import React, { useState, useEffect } from 'react';
import Header from '../../components/Chatbot/Header/Header';
import WelcomeScreen from '../../components/Chatbot/WelcomeScreen/WelcomeScreen';
import ChatInterface from '../../components/Chatbot/ChatInterface/ChatInterface';
import { useChat } from '../../hooks/useChat';
import { useAI } from '../../hooks/useAI';
import { useSuggestions } from '../../hooks/useSuggestions';
import { ChatProvider } from '../../contexts/ChatContext';
import './ChatbotPage.css';

const ChatbotPage = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const { messages, sendMessage, addAIMessage, isTyping, setIsTyping } = useChat();
  const { generateResponse, getSuggestions } = useAI();
  const { suggestions, updateSuggestions, generateContextualSuggestions } = useSuggestions();

  const suggestedTopics = [
    { id: 1, text: 'How can I add a story?', type: 'question' },
    { id: 2, text: 'Tell me about NEURALIFT', type: 'question' },
    { id: 3, text: 'Get started', type: 'action' }
  ];

  const handleSendMessage = async (text) => {
    if (showWelcome) {
      setShowWelcome(false);
    }

    // Add user message
    sendMessage(text);
    updateSuggestions([]);

    // Generate AI response
    setIsTyping(true);
    const response = await generateResponse(text, messages);
    addAIMessage(response);
    setIsTyping(false);

    // Update suggestions
    const newSuggestions = getSuggestions(text);
    updateSuggestions(newSuggestions);
  };

  const handleStartChat = (initialMessage) => {
    setShowWelcome(false);
    handleSendMessage(initialMessage);
  };

  const handleMinimize = () => {
    console.log('Minimize chatbot');
    // Implement minimize functionality
  };

  return (
    <ChatProvider>
      <div className="chatbot-page">
        {!showWelcome && (
          <Header
            title="Chatbot"
            status="Support Agent"
            onMinimize={handleMinimize}
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
              suggestions={suggestions}
              onQuickReply={handleSendMessage}
            />
          )}
        </div>
      </div>
    </ChatProvider>
  );
};

export default ChatbotPage;