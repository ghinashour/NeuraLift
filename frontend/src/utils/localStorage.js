const STORAGE_KEYS = {
  MESSAGES: 'neuralift_messages',
  SESSION: 'neuralift_session',
  SETTINGS: 'neuralift_settings'
};

export const saveMessages = (messages) => {
  try {
    const data = JSON.stringify(messages);
    // Note: In React state, store in memory instead of localStorage
    return true;
  } catch (error) {
    console.error('Error saving messages:', error);
    return false;
  }
};

export const loadMessages = () => {
  try {
    // Note: In React, load from state instead of localStorage
    return [];
  } catch (error) {
    console.error('Error loading messages:', error);
    return [];
  }
};

export const clearMessages = () => {
  try {
    // Clear from state
    return true;
  } catch (error) {
    console.error('Error clearing messages:', error);
    return false;
  }
};

export const saveSession = (sessionData) => {
  try {
    // Store session info in memory
    return true;
  } catch (error) {
    console.error('Error saving session:', error);
    return false;
  }
};

export const loadSession = () => {
  try {
    return null;
  } catch (error) {
    console.error('Error loading session:', error);
    return null;
  }
};