import { useState, useCallback } from 'react';

export const useSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);

  const updateSuggestions = useCallback((newSuggestions) => {
    setSuggestions(newSuggestions);
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  const generateContextualSuggestions = useCallback((lastMessage, conversationType = 'general') => {
    // Generate suggestions based on context
    const contextMap = {
      'story': [
        { id: 1, text: 'How do I edit a story?', type: 'question' },
        { id: 2, text: 'Can I add images?', type: 'question' },
        { id: 3, text: 'Share story options', type: 'action' }
      ],
      'help': [
        { id: 1, text: 'Getting started guide', type: 'action' },
        { id: 2, text: 'Contact support', type: 'action' },
        { id: 3, text: 'FAQ', type: 'action' }
      ],
      'general': [
        { id: 1, text: 'Tell me more', type: 'question' },
        { id: 2, text: 'How does it work?', type: 'question' },
        { id: 3, text: 'What else can you do?', type: 'question' }
      ]
    };

    const detectedType = Object.keys(contextMap).find(key => 
      lastMessage?.toLowerCase().includes(key)
    ) || 'general';

    setSuggestions(contextMap[detectedType]);
  }, []);

  return {
    suggestions,
    updateSuggestions,
    clearSuggestions,
    generateContextualSuggestions
  };
};
