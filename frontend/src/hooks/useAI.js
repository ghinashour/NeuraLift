// hooks/useAI.js
import { useState, useCallback } from 'react';

export const useAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const generateResponse = useCallback(async (userMessage) => {
    if (!userMessage.trim()) return 'Please enter a message.';

    setIsProcessing(true);
    
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      return data.reply;

    } catch (error) {
      console.error('Error calling backend:', error);
      return `I'm experiencing technical difficulties. Please try again. Error: ${error.message}`;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { generateResponse, isProcessing };
};