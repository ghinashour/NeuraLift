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
  const [message, setMessage] = useState(MESSAGES[key] || "Hello");

  // Update key and message every minute
  useEffect(() => {
    const id = setInterval(() => {
      const k = getKey();
      setKey(k);
      setMessage(MESSAGES[k] || "Hello");
    }, 60 * 1000);

    return () => clearInterval(id);
  }, []);

  return { key, message };
}
