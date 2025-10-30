import { useState, useEffect } from 'react';

// A generic hook for managing state in localStorage
const useLocalStorage = (key, initialValue) => {
  // State to store the value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error, return initialValue
      console.error('Error reading localStorage key “' + key + '”: ', error);
      return initialValue;
    }
  });

  // useEffect to update local storage whenever the state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error writing to localStorage key “' + key + '”: ', error);
    }
  }, [key, storedValue]); // Dependency array ensures effect runs on key or storedValue change

  return [storedValue, setStoredValue];
};

export default useLocalStorage;