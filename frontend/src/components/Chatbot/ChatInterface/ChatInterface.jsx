import React from 'react';
import './ChatInterface.css';
import Header from '../Header/Header';
import MessageList from '../MessageList/MessageList';
import InputArea from '../InputArea/InputArea';
import QuickReplies from '../QuickReplies/QuickReplies';
import { useChat } from '../../../context/ChatContext';
import { useAI } from '../../../hooks/useAI';

const toHistory = (messages) =>
  (messages || [])
    .filter((m) => m && (m.text || m.content))
    .slice(-10)
    .map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: String(m.text ?? m.content ?? ''),
    }));

const ChatInterface = () => {
  const { messages, addMessage, setIsTyping } = useChat();
  const { processMessage, isProcessing, source } = useAI();

  const send = async (text) => {
    const clean = (text || '').trim();
    if (!clean || isProcessing) return;
    const history = toHistory(messages);
    addMessage({ sender: 'user', text: clean });
    setIsTyping(true);
    try {
      const response = await processMessage(clean, history);
      addMessage({ sender: 'bot', text: response });
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (suggestion) => send(suggestion);

  return (
    <div className="chat-interface nl-assistant">
      <Header source={source} />
      <div className="assistant-body">
        <MessageList />
        <QuickReplies onSelect={handleQuickReply} disabled={isProcessing} />
        <InputArea onSend={send} disabled={isProcessing} />
      </div>
    </div>
  );
};

export default ChatInterface;
