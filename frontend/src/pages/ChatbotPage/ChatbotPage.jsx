import React, { useState } from "react";
import Header from "../../components/Chatbot/Header/Header";
import WelcomeScreen from "../../components/Chatbot/WelcomeScreen/WelcomeScreen";
import ChatInterface from "../../components/Chatbot/ChatInterface/ChatInterface";
import { sendMessageToBackend } from "../../utils/ChatService";
import "./ChatbotPage.css";

const ChatbotContent = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [persona, setPersona] = useState("system_support");
  const [customPersonas, setCustomPersonas] = useState(() => {
    try {
      const raw = localStorage.getItem("neuralift_personas");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const handleSendMessage = async (text) => {
    if (showWelcome) setShowWelcome(false);

    // Add user message
    const userMessage = { id: Date.now(), sender: "user", text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);

    // Determine system prompt
    const systemPrompts = {
      system_support: `You are NeuraLift System Support. Provide concise, helpful answers.`,
      developer: `You are a NeuraLift Developer Assistant. Provide technical explanations, code snippets.`,
      tutor: `You are a helpful tutor. Provide step-by-step guidance.`
    };
    const personaMap = { ...systemPrompts };
    customPersonas.forEach(p => { if (p?.id) personaMap[p.id] = p.prompt; });
    const systemPrompt = personaMap[persona];

    // Add placeholder AI message
    const aiMessageId = Date.now() + 1;
    const aiMessage = { id: aiMessageId, sender: "ai", text: "", status: "pending", timestamp: Date.now() };
    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(true);

    try {
      // Send to backend
      const response = await sendMessageToBackend([
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text })),
        { role: "user", content: text }
      ]);

      // Update AI message
      setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, text: response.content, status: "done" } : m));
    } catch (err) {
      setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, status: "failed" } : m));
      console.error("Error sending message:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetryMessage = (messageId) => {
    const msg = messages.find(m => m.id === messageId);
    if (msg) handleSendMessage(msg.text);
  };

  const handleCancelPending = () => {
    setIsTyping(false);
    setMessages(prev => prev.filter(m => !(m.sender === "ai" && m.status === "pending")));
  };

  const handleClearChat = () => {
    setMessages([]);
    setShowWelcome(true);
  };

  const handleStartChat = (initialMessage) => {
    setShowWelcome(false);
    handleSendMessage(initialMessage);
  };

  return (
    <div className="cbPage-chatbot-page">
      {!showWelcome && (
        <Header
          title="NEURALIFT Assistant"
          status={isTyping ? "Typing..." : "Online"}
          onMinimize={handleClearChat}
        />
      )}
      <div className="cbPage-chatbot-content">
        {showWelcome ? (
          <WelcomeScreen
            onStartChat={handleStartChat}
            suggestedTopics={[
              { id: 1, text: "How can I add a story?" },
              { id: 2, text: "Tell me about NEURALIFT" },
              { id: 3, text: "Get started" },
            ]}
          />
        ) : (
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
            onClearChat={handleClearChat}
            onRetryMessage={handleRetryMessage}
            onCancelPending={handleCancelPending}
          />
        )}
      </div>
    </div>
  );
};

const ChatbotPage = () => <ChatbotContent />;

export default ChatbotPage;
