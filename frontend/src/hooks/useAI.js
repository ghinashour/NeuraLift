import { useState, useCallback } from 'react';
import { useChatContext } from '../contexts/ChatContext';

export const useAI = () => {
  const { ai } = useChatContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const generateResponse = useCallback(
    async (userMessage) => {
      if (!ai) {
        console.warn('AI not initialized yet');
        return "The assistant is waking up... please try again in a few seconds.";
      }

      setIsProcessing(true);
      try {
        const response = await ai.send(userMessage); // Core puter.js chat call
        setIsProcessing(false);

        // `puter.ai.chat()` responses are typically structured like { role, content }
        return response.content || response.text || "Hmm... I didn’t quite get that.";
      } catch (error) {
        console.error('AI Response Error:', error);
        setIsProcessing(false);
        return "I'm having trouble connecting right now. Please try again later.";
      }
    },
    [ai]
  );

  const getSuggestions = useCallback(() => {
    // Simple contextual suggestions (can be replaced by AI-based suggestions later)
    return [
      { id: 1, text: 'Tell me more', type: 'question' },
      { id: 2, text: 'What can you do?', type: 'question' },
      { id: 3, text: 'Help me with something', type: 'action' },
    ];
  }, []);

  return {
    generateResponse,
    isProcessing,
    getSuggestions,
  };
};
