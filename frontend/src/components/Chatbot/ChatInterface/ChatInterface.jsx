import React from 'react';
import './ChatInterface.css';
import Header from '../Header/Header';
import MessageList from '../MessageList/MessageList';
import InputArea from '../InputArea/InputArea';
import QuickReplies from '../QuickReplies/QuickReplies';
import { useChat } from '../../../context/ChatContext';
import { useAI } from '../../../hooks/useAI';

const ChatInterface = () => {
  const { addMessage, setIsTyping } = useChat();
  const { processMessage } = useAI();

  const handleQuickReply = async (suggestion) => {
    addMessage({
      sender: 'user',
      text: suggestion
    });

    setIsTyping(true);
    const response = await processMessage(suggestion);
    setIsTyping(false);
    
    addMessage({
      sender: 'bot',
      text: response
    });
  };

  return (
    <div className="chat-interface">
      <Header />
      <MessageList />
      <QuickReplies onSelect={handleQuickReply} />
      <InputArea />
    </div>
  );
};

export default ChatInterface;