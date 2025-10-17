// src/utils/localStorage.js

import { useState, useEffect } from "react";

const STORAGE_KEYS = {
  MESSAGES: "neuralift_messages",
  SESSION: "neuralift_session",
  SETTINGS: "neuralift_settings",
};

/* ------------------------- Message Storage ------------------------- */
export const saveMessages = (messages) => {
  try {
    const data = JSON.stringify(messages);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, data);
    return true;
  } catch (error) {
    console.error("Error saving messages:", error);
    return false;
  }
};

export const loadMessages = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading messages:", error);
    return [];
  }
};

export const clearMessages = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    return true;
  } catch (error) {
    console.error("Error clearing messages:", error);
    return false;
  }
};

/* ------------------------- Session Storage ------------------------- */
export const saveSession = (sessionData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
    return true;
  } catch (error) {
    console.error("Error saving session:", error);
    return false;
  }
};

export const loadSession = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSION);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading session:", error);
    return null;
  }
};

/* ------------------------- React Hook: useLocalStorage ------------------------- */
/**
 * A custom React hook to persist state in localStorage.
 * Usage:
 * const [value, setValue] = useLocalStorage('myKey', defaultValue);
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage key:", key, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error setting localStorage key:", key, error);
    }
  };

  useEffect(() => {
    // Keep storage in sync with other browser tabs
    const handleStorageChange = (event) => {
      if (event.key === key) {
        try {
          const newValue = JSON.parse(event.newValue);
          setStoredValue(newValue);
        } catch {
          setStoredValue(initialValue);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue];
};
