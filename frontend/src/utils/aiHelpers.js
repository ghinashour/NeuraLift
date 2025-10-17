
export const prepareConversationHistory = (messages, maxMessages = 10) => {
  // Get last N messages for context
  return messages.slice(-maxMessages).map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.text
  }));
};

export const sanitizeInput = (input) => {
  // Remove potential malicious content
  return input.trim().replace(/<[^>]*>/g, '');
};

export const detectIntent = (message) => {
  const lowerMessage = message.toLowerCase();
  
  const intents = {
    greeting: ['hello', 'hi', 'hey', 'greetings'],
    help: ['help', 'support', 'assist'],
    question: ['?', 'how', 'what', 'when', 'where', 'why', 'who'],
    story: ['story', 'post', 'content', 'publish'],
    feedback: ['thank', 'thanks', 'great', 'awesome', 'good']
  };
  
  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return intent;
    }
  }
  
  return 'general';
};

export const generateSystemPrompt = () => {
  return `You are a helpful AI assistant for NEURALIFT, an intelligent platform. 
Your role is to:
- Assist users with platform features
- Answer questions clearly and concisely
- Provide helpful suggestions
- Be friendly and professional
- Keep responses under 100 words when possible

Remember to stay in character and be helpful!`;
};

