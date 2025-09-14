/**
 * Computes the current part of day and returns a message label.
 */
import { useEffect, useState } from "react";
import { MESSAGES } from "../constants/messages";

function getKey() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

export default function useTimeOfDay() {
  const [key, setKey] = useState(getKey());

  useEffect(() => {
    const id = setInterval(() => setKey(getKey()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return { key, message: MESSAGES[key] || "Hello" };
}