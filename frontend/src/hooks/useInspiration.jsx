// src/hooks/useInspiration.js
import { useState, useEffect, useCallback } from "react";
import { getRandomQuote } from "../api/axios"; // import the new API function

export default function useInspiration(intervalTime = 60000) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuote = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getRandomQuote();
      // res.data contains { _id, text, author }
      if (res.data) {
        setQuote({
          text: res.data.text || "Stay motivated!",
          author: res.data.author || "Unknown",
        });
      } else {
        setQuote({ text: "Stay motivated!", author: "Unknown" });
      }
    } catch (err) {
      console.error("Failed to fetch quote:", err);
      setQuote({ text: "Stay motivated!", author: "Unknown" });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount + auto refresh
  useEffect(() => {
    fetchQuote();
    const intervalId = setInterval(fetchQuote, intervalTime);
    return () => clearInterval(intervalId);
  }, [fetchQuote, intervalTime]);

  return { quote, loading, fetchQuote };
}
