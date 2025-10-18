// hooks/useChat.js
import { useState, useCallback, useEffect, useRef } from 'react';
import { useAI } from './useAI';

// Message statuses: 'pending' (waiting for AI), 'sent' (delivered), 'failed'
const STORAGE_PREFIX = 'neuralift_chat_';

export const useChat = (options = {}) => {
  const chatKey = options.chatKey || 'default';

  const { generateResponse, streamResponse, isProcessing } = useAI();
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + chatKey, JSON.stringify(messages));
    } catch (e) {
      // ignore
    }
  }, [messages, chatKey]);

  const clearChat = useCallback(() => {
    setMessages([]);
    try { localStorage.removeItem(STORAGE_PREFIX + chatKey); } catch (e) {}
  }, [chatKey]);

  const sendMessage = useCallback(async (text, opts = {}) => {
    if (!text || !text.toString().trim()) return null;

    const userMsg = {
      id: `u-${Date.now()}`,
      text: text.toString().trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    setMessages(prev => [...prev, userMsg]);

    const aiId = `ai-${Date.now()}`;
    const placeholder = {
      id: aiId,
      text: '',
      sender: 'ai',
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    setMessages(prev => [...prev, placeholder]);

    if (abortRef.current) {
      try { abortRef.current.abort(); } catch (e) {}
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // gather recent history (limit to last N messages)
      const HISTORY_LIMIT = 10;
      const history = [...messages, userMsg].slice(-HISTORY_LIMIT).map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));
      let aiMsg = null;
      if (opts.stream) {
        // Stream tokens and append to the placeholder message with sanitization
        let accumulated = '';
        let tokenReceived = false;
        let streamTimeout = null;
        const onToken = (rawToken) => {
          // mark that we received a token and clear the startup timeout
          tokenReceived = true;
          if (streamTimeout) {
            clearTimeout(streamTimeout);
            streamTimeout = null;
          }
          if (!rawToken) return;
          // Server sends escaped newlines as literal '\n' — convert back
          let token = rawToken.replace(/\\n/g, '\n');

          // Normalize control characters (remove CR)
          token = token.replace(/\r/g, '');

          // Collapse repeated spaces only within the token, keep single spaces between tokens
          token = token.replace(/ {2,}/g, ' ');

          // Merge token into accumulated smartly to avoid mid-word breaks:
          // If accumulated ends without whitespace and token starts without whitespace, do not insert extra space — just concatenate.
          if (accumulated && !/\s$/.test(accumulated) && !/^\s/.test(token)) {
            accumulated += token;
          } else {
            accumulated += token;
          }

          // Update placeholder message
          setMessages(prev => prev.map(m => (m.id === aiId ? { ...m, text: accumulated, status: 'pending' } : m)));
        };

        try {
          // set a short timeout: if no tokens arrive within 3s, fallback to non-stream
          streamTimeout = setTimeout(() => {
            if (!tokenReceived) {
              try { controller.abort(); } catch (e) {}
            }
          }, 3000);

          await streamResponse(text, { signal: controller.signal, history, systemPrompt: opts.systemPrompt, onToken });

          // if stream was aborted due to timeout and no tokens received, call non-stream fallback
          if (!tokenReceived) {
            const reply = await generateResponse(text, { signal: controller.signal, history, systemPrompt: opts.systemPrompt });
            accumulated = reply || accumulated;
          }
        } catch (e) {
          // streamResponse will throw on abort or network issues — propagate to outer catch
          throw e;
        }

        if (streamTimeout) { clearTimeout(streamTimeout); streamTimeout = null; }

        aiMsg = {
          id: aiId,
          text: accumulated,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          status: 'sent',
        };

        setMessages(prev => prev.map(m => (m.id === aiId ? aiMsg : m)));
      } else {
        const reply = await generateResponse(text, { signal: controller.signal, history, systemPrompt: opts.systemPrompt });

        aiMsg = {
          id: aiId,
          text: reply,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          status: 'sent',
        };

        setMessages(prev => prev.map(m => (m.id === aiId ? aiMsg : m)));
      }
      abortRef.current = null;
      return aiMsg;
    } catch (err) {
      const isAbort = err && err.name === 'AbortError';
      setMessages(prev => prev.map(m => (m.id === aiId ? { ...m, status: 'failed', text: isAbort ? 'Request cancelled' : (err.message || 'Error') } : m)));
      abortRef.current = null;
      return null;
    }
  }, [generateResponse, streamResponse, messages]);

  const retryMessage = useCallback(async (failedMsgId) => {
    const failed = messages.find(m => m.id === failedMsgId && m.sender === 'ai');
    if (!failed) return null;
    const idx = messages.findIndex(m => m.id === failedMsgId);
    const prevUser = [...messages].slice(0, idx).reverse().find(m => m.sender === 'user');
    const prompt = prevUser ? prevUser.text : '';
    setMessages(prev => prev.filter(m => m.id !== failedMsgId));
    return sendMessage(prompt);
  }, [messages, sendMessage]);

  const cancelPending = useCallback(() => {
    if (abortRef.current) {
      try { abortRef.current.abort(); } catch (e) {}
      abortRef.current = null;
    }
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