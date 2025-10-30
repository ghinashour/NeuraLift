export const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatDate = (date) => {
  const today = new Date();
  const messageDate = new Date(date);
  
  if (messageDate.toDateString() === today.toDateString()) {
    return 'Today';
  }
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  return messageDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
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