// hooks/useChat.js
import { useState, useCallback, useEffect, useRef } from "react";
import { useAI } from "./useAI";

// Message statuses: 'pending' (waiting for AI), 'sent' (delivered), 'failed'
const STORAGE_PREFIX = 'neuralift_chat_';

export const useChat = (options = {}) => {
  // options.chatKey: string used for localStorage persistence
  const chatKey = options.chatKey || 'default';

  const { generateResponse, isProcessing } = useAI();
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + chatKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Failed to read chat from storage', e);
      return [];
    }
  });

  const abortRef = useRef(null);

  // persist messages
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + chatKey, JSON.stringify(messages));
    } catch (e) {
      // ignore storage errors
    }
  }, [messages, chatKey]);

  const clearChat = useCallback(() => {
    setMessages([]);
    try { localStorage.removeItem(STORAGE_PREFIX + chatKey); } catch (e) {}
  }, [chatKey]);

  const sendMessage = useCallback(async (text) => {
    if (!text || !text.toString().trim()) return null;

    const userMsg = {
      id: `u-${Date.now()}`,
      text: text.toString().trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMsg]);

    // Prepare AI placeholder
    const aiId = `ai-${Date.now()}`;
    const placeholder = {
      id: aiId,
      text: '',
      sender: 'ai',
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    setMessages(prev => [...prev, placeholder]);

    // Abort any previous request
    if (abortRef.current) {
      try { abortRef.current.abort(); } catch (e) {}
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const reply = await generateResponse(text, { signal: controller.signal });

      const aiMsg = {
        id: aiId,
        text: reply,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        status: 'sent',
      };

      setMessages(prev => prev.map(m => (m.id === aiId ? aiMsg : m)));
      abortRef.current = null;
      return aiMsg;
    } catch (err) {
      // If aborted, remove placeholder or mark failed
      const isAbort = err && err.name === 'AbortError';
      setMessages(prev => prev.map(m => (m.id === aiId ? { ...m, status: 'failed', text: isAbort ? 'Request cancelled' : (err.message || 'Error') } : m)));
      abortRef.current = null;
      return null;
    }
  }, [generateResponse]);

  const retryMessage = useCallback(async (failedMsgId) => {
    const failed = messages.find(m => m.id === failedMsgId && m.sender === 'ai');
    if (!failed) return null;
    // Use last user message as prompt if present
    // Find the user message immediately before the failed ai placeholder
    const idx = messages.findIndex(m => m.id === failedMsgId);
    const prevUser = [...messages].slice(0, idx).reverse().find(m => m.sender === 'user');
    const prompt = prevUser ? prevUser.text : '';
    // Remove failed placeholder and call sendMessage with same prompt
    setMessages(prev => prev.filter(m => m.id !== failedMsgId));
    return sendMessage(prompt);
  }, [messages, sendMessage]);

  const cancelPending = useCallback(() => {
    if (abortRef.current) {
      try { abortRef.current.abort(); } catch (e) {}
      abortRef.current = null;
    }
    // mark any pending ai as failed/cancelled
    setMessages(prev => prev.map(m => (m.sender === 'ai' && m.status === 'pending' ? { ...m, status: 'failed', text: 'Cancelled' } : m)));
  }, []);

  return {
    messages,
    sendMessage,
    clearChat,
    retryMessage,
    cancelPending,
    isTyping: isProcessing,
  };
};