// utils/chatHelpers.js

/**
 * Prepare conversation history for AI context
 * @param {Array} messages - Array of message objects
 * @param {number} maxMessages - How many recent messages to include
 * @returns {Array} Array of messages formatted for OpenAI
 */
export const prepareConversationHistory = (messages, maxMessages = 10) => {
  return messages.slice(-maxMessages).map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.text
  }));
};

/**
 * Sanitize user input to remove unwanted HTML tags
 * @param {string} input
 * @returns {string}
 */
export const sanitizeInput = (input) => {
  return input.trim().replace(/<[^>]*>/g, '');
};

/**
 * Detect intent of user message based on keywords
 * @param {string} message
 * @returns {string} intent
 */
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

/**
 * Generate default system prompt for AI
 * @returns {string}
 */
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
