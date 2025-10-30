const CHAT_HISTORY_KEY = 'neuralift_chat_history';
const MAX_HISTORY_LENGTH = 100;

export const saveChatHistory = (messages) => {
  try {
    const limitedMessages = messages.slice(-MAX_HISTORY_LENGTH);
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(limitedMessages));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

export const loadChatHistory = () => {
  try {
    const saved = localStorage.getItem(CHAT_HISTORY_KEY);
    if (saved) {
      const messages = JSON.parse(saved);
      return messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
  } catch (error) {
    console.error('Error loading chat history:', error);
  }
  return null;
};

export const clearChatHistory = () => {
  try {
    localStorage.removeItem(CHAT_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing chat history:', error);
  }
};