export const sanitizeInput = (input) => {
  return input.trim().replace(/\s+/g, ' ');
};

export const isValidMessage = (message) => {
  return message && message.trim().length > 0 && message.trim().length <= 500;
};