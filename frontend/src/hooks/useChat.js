import { useState, useCallback } from 'react';
import { useAI } from './useAI';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const { generateResponse, getSuggestions } = useAI();

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim()) return;

      const newMessage = {
        id: `msg-${Date.now()}`,
        text,
        sender: 'user',
        timestamp: new Date().toISOString(),
        type: 'text',
      };

      setMessages((prev) => [...prev, newMessage]);
      setIsTyping(true);

      // Send to AI and wait for reply
      const aiResponse = await generateResponse(text);
      const suggestions = getSuggestions(aiResponse);

      const aiMessage = {
        id: `msg-${Date.now()}-ai`,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        type: 'text',
        suggestions,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    },
    [generateResponse, getSuggestions]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    clearChat,
    isTyping,
  };
};
