// hooks/useChat.js
import { useState, useCallback } from "react";
import { useAI } from "./useAI";

export const useChat = () => {
  const { generateResponse, isProcessing } = useAI();
  const [messages, setMessages] = useState([]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    // Add user message immediately
    const userMsg = {
      id: `msg-${Date.now()}`,
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMsg]);

    // Get AI response
    const aiText = await generateResponse(text);
    
    const aiMsg = {
      id: `msg-${Date.now()}-ai`,
      text: aiText,
      sender: "ai",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, aiMsg]);
  }, [generateResponse]);

  const clearChat = useCallback(() => setMessages([]), []);

  return { 
    messages, 
    sendMessage, 
    clearChat, 
    isTyping: isProcessing 
  };
};