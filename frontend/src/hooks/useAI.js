// hooks/useAI.js
import { useState, useCallback } from 'react';

export const useAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * generateResponse
   * - userMessage: string
   * - options: { signal?: AbortSignal }
   * Returns the reply string on success.
   * Throws on network errors or when the request is aborted.
   */







  const generateResponse = useCallback(async (userMessage, options = {}) => {
    // userMessage can be a string or an object; normalize to string
    const messageText = typeof userMessage === 'string' ? userMessage : (userMessage && userMessage.text ? userMessage.text : '');
    if (!messageText || !messageText.toString().trim()) {
      return 'Please enter a message.';
    }

    setIsProcessing(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
      // Build request payload. Include conversation history and optional system prompt when provided.
      const payload = {
        message: messageText,
      };

      if (options.history) payload.history = options.history;
      if (options.systemPrompt) payload.systemPrompt = options.systemPrompt;

      const response = await fetch(`${API_URL}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: options.signal,
      });

      if (!response.ok) {
        let bodyText = '';
        try { bodyText = await response.text(); } catch (e) { }
        throw new Error(`HTTP error: ${response.status} ${response.statusText} ${bodyText}`);
      }

      const data = await response.json();

      if (data && data.success === false) {
        throw new Error(data.error || 'Unknown error from AI service');
      }

      return data && data.reply ? data.reply : (typeof data === 'string' ? data : '');

    } catch (error) {
      if (error.name === 'AbortError') throw error;
      console.error('Error calling backend:', error);
      throw new Error(`I'm experiencing technical difficulties. ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  /**
   * streamResponse
   * - userMessage: string
   * - options: { signal?: AbortSignal, history?: Array, systemPrompt?: string, onToken?: (token)=>void }
   * Streams token chunks from the server and calls onToken for every chunk received.
   * Resolves when stream ends.
   */
  const streamResponse = useCallback(async (userMessage, options = {}) => {
    const messageText = typeof userMessage === 'string' ? userMessage : (userMessage && userMessage.text ? userMessage.text : '');
    if (!messageText || !messageText.toString().trim()) return '';

    setIsProcessing(true);
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

    const controller = options.signal || new AbortController();
    const payload = { message: messageText };
    if (options.history) payload.history = options.history;
    if (options.systemPrompt) payload.systemPrompt = options.systemPrompt;

    const resp = await fetch(`${API_URL}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!resp.ok) {
      const bodyText = await resp.text().catch(() => '');
      throw new Error(`HTTP error: ${resp.status} ${resp.statusText} ${bodyText}`);
    }

    // Read stream
    const reader = resp.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;
    let accumulated = '';

    try {
      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;

          // parts separated by double newline (SSE-style)
          const parts = accumulated.split(/\n\n/);
          for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i].trim();
            if (!part) continue;
            // Expecting 'data: <token>' lines
            if (part.startsWith('data:')) {
              const token = part.replace(/^data:\s*/i, '');
              if (token === '[DONE]') continue;
              if (options.onToken) options.onToken(token);
            } else if (part.startsWith('event:')) {
              // ignore events
            } else {
              if (options.onToken) options.onToken(part);
            }
          }
          accumulated = parts[parts.length - 1];
        }
      }
    } finally {
      setIsProcessing(false);
    }

    return accumulated;
  }, []);

  return { generateResponse, streamResponse, isProcessing };
};