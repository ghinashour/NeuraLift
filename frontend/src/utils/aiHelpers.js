export const sanitizeInput = (input) => {
  return input.trim().replace(/\s+/g, ' ');
};

export const isValidMessage = (message) => {
  return message && message.trim().length > 0 && message.trim().length <= 500;
};

export const extractKeywords = (text) => {
  const keywords = text.toLowerCase().match(/\b\w+\b/g) || [];
  return [...new Set(keywords)];
};