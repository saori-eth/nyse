import { useState, useEffect } from "react";

export const useLocalStorage = (key: string, initialValue: any) => {
  // Get the stored value from localStorage or use the initialValue
  const [storedValue, setStoredValue] = useState(() => {
    if (window === undefined) return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  // Update localStorage when the storedValue changes
  useEffect(() => {
    if (window === undefined) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};
