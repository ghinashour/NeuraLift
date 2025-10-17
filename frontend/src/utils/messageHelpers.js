export const createMessage = (text, sender = 'user', type = 'text') => {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    text,
    sender,
    timestamp: new Date().toISOString(),
    type,
    suggestions: []
  };
};

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
};

export const groupMessagesByDate = (messages) => {
  const groups = {};
  
  messages.forEach(message => {
    const dateKey = formatDate(message.timestamp);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
  });
  
  return groups;
};

export const validateMessage = (text) => {
  if (!text || typeof text !== 'string') return false;
  if (text.trim().length === 0) return false;
  if (text.length > 5000) return false;
  return true;
};
