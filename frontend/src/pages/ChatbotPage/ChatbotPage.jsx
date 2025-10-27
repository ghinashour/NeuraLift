// components/ChatbotPage/ChatbotPage.js
import React, { useState } from "react";
import { useChat } from "../../hooks/useChat";
import Header from "../../components/Chatbot/Header/Header";
import WelcomeScreen from "../../components/Chatbot/WelcomeScreen/WelcomeScreen";
import ChatInterface from "../../components/Chatbot/ChatInterface/ChatInterface";
import "./ChatbotPage.css";

const ChatbotContent = () => {
  const { messages, sendMessage, isTyping, clearChat, retryMessage, cancelPending } = useChat();
  const [showWelcome, setShowWelcome] = useState(true);
  const [persona, setPersona] = useState('system_support');
  const [streaming, setStreaming] = useState(true);
  const [customPersonas, setCustomPersonas] = useState(() => {
    try {
      const raw = localStorage.getItem('neuralift_personas');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [newPersonaName, setNewPersonaName] = useState('');
  const [newPersonaPrompt, setNewPersonaPrompt] = useState('');

  const suggestedTopics = [
    { id: 1, text: "How can I add a story?" },
    { id: 2, text: "Tell me about NEURALIFT" },
    { id: 3, text: "Get started" },
  ];

  const handleSendMessage = async (text) => {
    if (showWelcome) setShowWelcome(false);
    const systemPrompts = {
      system_support: `You are NeuraLift System Support. Provide concise, helpful answers and reference the repo when useful.`,
      developer: `You are a NeuraLift Developer Assistant. Provide technical explanations, code snippets, and debugging steps. Cite file paths when helpful.`,
      tutor: `You are a helpful tutor. Provide step-by-step explanations and educational guidance; avoid doing graded homework for students unless permitted.`
    };
    // Merge custom personas
    const personaMap = { ...systemPrompts };
    customPersonas.forEach(p => { if (p && p.id) personaMap[p.id] = p.prompt; });
    const systemPrompt = personaMap[persona];
    await sendMessage(text, { systemPrompt, stream: streaming });
  };

  const handleStartChat = (initialMessage) => {
    setShowWelcome(false);
    handleSendMessage(initialMessage);
  };

  const handleRestart = () => {
    clearChat();
    setShowWelcome(true);
  };

  return (
    <div className="cbPage-chatbot-page">
      {!showWelcome && (
        <Header
          title="NEURALIFT Assistant"
          status="Online"
          onMinimize={handleRestart}
        />
      )}
      <div className="cbPage-chatbot-content">
        {!showWelcome && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              Persona:
              <select value={persona} onChange={e => setPersona(e.target.value)}>
                <option value="system_support">System Support</option>
                <option value="developer">Developer Assistant</option>
                <option value="tutor">Tutor</option>
              </select>
            </label>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              Streaming:
              <input type="checkbox" checked={streaming} onChange={e => setStreaming(e.target.checked)} />
            </label>
          </div>
        )}
        {showWelcome ? (
          <WelcomeScreen
            onStartChat={handleStartChat}
            suggestedTopics={suggestedTopics}
          />
        ) : (
          <div>
            <div style={{ marginBottom: 12, display: 'flex', gap: 12 }}>
              <div>
                <strong>Custom Personas</strong>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <input placeholder="Name" value={newPersonaName} onChange={e => setNewPersonaName(e.target.value)} />
                  <input placeholder="Prompt" value={newPersonaPrompt} onChange={e => setNewPersonaPrompt(e.target.value)} />
                  <button onClick={() => {
                    if (!newPersonaName || !newPersonaPrompt) return;
                    const id = `custom_${Date.now()}`;
                    const p = { id, name: newPersonaName, prompt: newPersonaPrompt };
                    const next = [...customPersonas, p];
                    setCustomPersonas(next);
                    try { localStorage.setItem('neuralift_personas', JSON.stringify(next)); } catch (e) { }
                    setNewPersonaName(''); setNewPersonaPrompt('');
                  }}>Add</button>
                </div>
                <div style={{ marginTop: 8 }}>
                  {customPersonas.map(p => (
                    <div key={p.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input type="radio" name="persona" value={p.id} checked={persona === p.id} onChange={() => setPersona(p.id)} />
                      <span>{p.name}</span>
                      <button onClick={() => {
                        const next = customPersonas.filter(x => x.id !== p.id);
                        setCustomPersonas(next);
                        try { localStorage.setItem('neuralift_personas', JSON.stringify(next)); } catch (e) { }
                        if (persona === p.id) setPersona('system_support');
                      }}>Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
              onClearChat={handleRestart}
              onRetryMessage={retryMessage}
              onCancelPending={cancelPending}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const ChatbotPage = () => {
  return <ChatbotContent />;
};

export default ChatbotPage;