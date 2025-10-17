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
    if (!userMessage || !userMessage.toString().trim()) {
      return 'Please enter a message.';
    }

    setIsProcessing(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
        signal: options.signal,
      });

      if (!response.ok) {
        // Try to extract a useful error message from the body
        let bodyText = '';
        try { bodyText = await response.text(); } catch (e) { /* ignore */ }
        throw new Error(`HTTP error: ${response.status} ${response.statusText} ${bodyText}`);
      }

      const data = await response.json();

      if (data && data.success === false) {
        throw new Error(data.error || 'Unknown error from AI service');
      }

      // Support APIs that return either { reply } or raw string
      return data && data.reply ? data.reply : (typeof data === 'string' ? data : '');

    } catch (error) {
      // Preserve AbortError so callers can detect cancellation
      if (error.name === 'AbortError') throw error;
      console.error('Error calling backend:', error);
      throw new Error(`I'm experiencing technical difficulties. ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { generateResponse, isProcessing };
};