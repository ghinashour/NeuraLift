import { useState, useCallback } from 'react';

const responses = {
  "hello": "Hello! How can I assist you today?",
  "hi": "Hi there! What can I help you with?",
  "hey": "Hey! How can I help you?",
  "help": "I'm here to help! You can ask me about wellness tips, mental health support, or general information about NeuraLift.",
  "what is neuralift": "NeuraLift is your wellness companion, designed to support your mental health and well-being journey.",
  "neuralift": "NeuraLift is dedicated to helping you maintain mental wellness through personalized support and guidance.",
  "how are you": "I'm doing great, thank you for asking! How can I help you today?",
  "thank you": "You're welcome! Feel free to ask if you need anything else.",
  "thanks": "You're welcome! Happy to help!",
  "bye": "Goodbye! Take care and come back anytime you need support.",
  "goodbye": "Take care! I'm here whenever you need me.",
  "wellness": "Wellness is about maintaining balance in your physical, mental, and emotional health. Would you like some tips?",
  "mental health": "Mental health is just as important as physical health. I'm here to support you. What would you like to know?",
  "stress": "Managing stress is important. Try deep breathing, meditation, or taking short breaks throughout your day.",
  "anxiety": "Anxiety is common. Remember to breathe deeply, stay present, and reach out for professional help if needed.",
  "sleep": "Good sleep is crucial for wellness. Try to maintain a regular sleep schedule and create a relaxing bedtime routine.",
  "exercise": "Regular exercise can boost your mood and energy levels. Even a 10-minute walk can make a difference!",
  "meditation": "Meditation can help reduce stress and improve focus. Start with just 5 minutes a day and build from there.",
};

export const useAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const getResponse = useCallback((input) => {
    const lowerInput = input.toLowerCase().trim();
    
    // Check for exact matches
    if (responses[lowerInput]) {
      return responses[lowerInput];
    }
    
    // Check for partial matches
    for (const [key, value] of Object.entries(responses)) {
      if (lowerInput.includes(key)) {
        return value;
      }
    }
    
    // Default response
    return "I'm still in development 🚧 Our team is working hard to expand my capabilities!";
  }, []);

  const processMessage = useCallback(async (message) => {
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const response = getResponse(message);
    setIsProcessing(false);
    
    return response;
  }, [getResponse]);

  return { processMessage, isProcessing };
};