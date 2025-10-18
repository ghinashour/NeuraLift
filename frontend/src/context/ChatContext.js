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
          dangerouslyAllowBrowser: true,
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

  /**
   * ✅ Predefined system questions and their answers
   * Add any system-related Q/A here
   */
  const predefinedSystemResponses = {
    "what is your status": () =>
      `I am currently ${chatState.agentStatus} and ${
        chatState.isConnected ? "connected" : "not connected"
      } to the system.`,
    "who am i": () =>
      chatState.userName
        ? `You are ${chatState.userName}.`
        : "You haven’t introduced yourself yet.",
    "what is the session id": () =>
      `Your current session ID is ${chatState.sessionId}.`,
    "what model are you using": () => "I’m powered by the GPT‑3.5‑Turbo model.",
    "how can you help me": () =>
      "I can answer questions about the system or help you interact with it.",
  };

  /**
   * ✅ Tries to detect if the user’s question is about the system
   */
  const findSystemResponse = (message) => {
    const lowerMsg = message.toLowerCase().trim();
    for (const key in predefinedSystemResponses) {
      if (lowerMsg.includes(key)) {
        return predefinedSystemResponses[key]();
      }
    }
    return null;
  };

  /**
   * ✅ Handles both system and OpenAI responses
   */
  const sendMessage = async (message) => {
    if (!ai) throw new Error("AI not initialized");

    // 1️⃣ Check if message fits predefined system questions
    const systemReply = findSystemResponse(message);
    if (systemReply) return systemReply;

    // 2️⃣ Otherwise try AI -> fallback to "I don't know..."
    try {
      const response = await ai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an assistant for a chat system. If you are asked " +
              "about internal system details or states, respond only with " +
              "known predefined data. If something is not predefined, reply " +
              "with: 'I don't know right now, ask me later.'",
          },
          { role: "user", content: message },
        ],
      });

      const content = response?.choices?.[0]?.message?.content?.trim();
      return content || "I don't know right now, ask me later.";
    } catch (error) {
      console.error("Error sending message to OpenAI:", error);
      return "I don't know right now, ask me later.";
    }
  };

  const updateChatState = (updates) => {
    setChatState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <ChatContext.Provider
      value={{
        chatState,
        updateChatState,
        ai,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// ✅ Hook for easy consumption
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
};