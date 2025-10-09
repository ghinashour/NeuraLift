import { useState, useCallback } from 'react';

export const useAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  // This is where you'll integrate OpenAI API
  const generateResponse = useCallback(async (userMessage, conversationHistory = []) => {
    setIsProcessing(true);

    try {
      // MOCK RESPONSE - Replace with OpenAI API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      let responseText = '';
      const lowerMessage = userMessage.toLowerCase();

      if (lowerMessage.includes('story')) {
        responseText = "To add a story, simply click on the 'Add Story' button in your dashboard. You can upload images, add text, and customize your story before publishing!";
      } else if (lowerMessage.includes('neuralift')) {
        responseText = "NEURALIFT is an AI-powered platform designed to enhance your experience with intelligent conversations and smart assistance. How can I help you explore our features?";
      } else if (lowerMessage.includes('help')) {
        responseText = "I can help you with various tasks! Feel free to ask about adding stories, navigating the platform, or any other questions you might have.";
      } else {
        responseText = `I understand you're asking about "${userMessage}". How can I assist you further?`;
      }

      /* 
      // OPENAI API INTEGRATION (Uncomment and add your API key)
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // or 'gpt-4' for better quality
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant for NEURALIFT, an AI platform. Be friendly, concise, and helpful.'
            },
            ...conversationHistory.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 150
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      responseText = data.choices[0].message.content;
      */

      setIsProcessing(false);
      return responseText;
    } catch (error) {
      setIsProcessing(false);
      console.error('AI Response Error:', error);
      return "I'm having trouble connecting right now. Please try again in a moment.";
    }
  }, []);

  const getSuggestions = useCallback((context) => {
    // Generate contextual suggestions based on conversation
    const defaultSuggestions = [
      { id: 1, text: 'Tell me more', type: 'question' },
      { id: 2, text: 'How does it work?', type: 'question' },
      { id: 3, text: 'Something else', type: 'action' }
    ];

    // You can make this more intelligent based on context
    return defaultSuggestions;
  }, []);

  return {
    generateResponse,
    isProcessing,
    getSuggestions
  };
};