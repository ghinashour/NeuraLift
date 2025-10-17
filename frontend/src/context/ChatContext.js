// src/context/ChatContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import OpenAI from "openai";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [chatState, setChatState] = useState({
    isConnected: false,
    agentStatus: "offline",
    sessionId: `session-${Date.now()}`,
    userName: null,
  });

  const [ai, setAi] = useState(null);

  // ✅ Initialize OpenAI client
  useEffect(() => {
    const initAI = async () => {
      try {
        const client = new OpenAI({
          apiKey: process.env.REACT_APP_OPENAI_API_KEY,
          dangerouslyAllowBrowser: true, // Needed for frontend use
        });

        setAi(client);
        setChatState((prev) => ({
          ...prev,
          isConnected: true,
          agentStatus: "online",
        }));
      } catch (error) {
        console.error("Error initializing OpenAI:", error);
      }
    };

    initAI();
  }, []);

  // ✅ Function to send messages to OpenAI
  const sendMessage = async (message) => {
    if (!ai) throw new Error("AI not initialized");

    try {
      const response = await ai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error("Error sending message to OpenAI:", error);
      throw error;
    }
  };

  const updateChatState = (updates) => {
    setChatState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <ChatContext.Provider value={{ chatState, updateChatState, ai, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
};
