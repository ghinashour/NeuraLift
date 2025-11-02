import React, { useState } from 'react';
import './ChatInterface.css';
import Header from '../Header/Header';
import MessageList from '../MessageList/MessageList';
import InputArea from '../InputArea/InputArea';
import QuickReplies from '../QuickReplies/QuickReplies';
import WelcomeScreen from '../WelcomeScreen/WelcomeScreen';
import { useChat } from '../../../context/ChatContext';
import { useAI } from '../../../hooks/useAI'; 

const ChatInterface = () => {
  // Setting showWelcome to true to show the WelcomeScreen first, 
  // but change to 'false' if you want to bypass it.
  const [showWelcome, setShowWelcome] = useState(true); 
  const { addMessage, setIsTyping } = useChat();
  const { processMessage } = useAI(); 

  const handleQuickReply = async (suggestion) => {
    // 1. Add user message
    addMessage({
      sender: 'user',
      text: suggestion
    });

    // 2. Process and add bot response
    setIsTyping(true);
    
    // Simulate a brief delay before processing to ensure the user message is rendered first
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const response = await processMessage(suggestion);
    
    setIsTyping(false);
    
    addMessage({
      sender: 'bot',
      text: response
    });
  };

  if (showWelcome) {
    return (
      <div className="chat-interface">
        <Header title="NeuraLift Bot" subtitle="Online" />
        {/* CRITICAL FIX: onStart must set showWelcome to false to proceed to chat view */}
        <WelcomeScreen onStart={() => setShowWelcome(true)} /> 
      </div>
    );
  }

  return (
    <div className="chat-interface">
      <Header title="NeuraLift Bot" subtitle="Online" />
      {/* QuickReplies are usually placed before or after MessageList, depending on design */}
      <QuickReplies onSelect={handleQuickReply} />
      <MessageList />
      <InputArea />
    </div>
  );
};

export default ChatInterface;