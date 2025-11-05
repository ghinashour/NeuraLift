// src/hooks/useChat.js
import { useState, useEffect, useRef } from "react";
import { useAI } from "./useAI";

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const { getAIResponse, isTyping } = useAI();
  const chatEndRef = useRef(null);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = { sender: "user", text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);

    const reply = await getAIResponse(text);
    const aiMsg = { sender: "ai", text: reply, timestamp: Date.now() };
    setMessages((prev) => [...prev, aiMsg]);
  };

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return { messages, sendMessage, isTyping, chatEndRef };
};
