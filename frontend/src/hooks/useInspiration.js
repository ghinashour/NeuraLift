import { useEffect, useState } from "react";
import { fetchQuote as apiFetchQuote } from "../utils/apiClient";

export default function useInspiration(intervalTime = 30000) { // 30 seconds default
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const data = await apiFetchQuote();
      setQuote({ content: data.content, author: data.author });
    } catch {
      setQuote({
        content: "Keep going — small steps every day.",
        author: "",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote(); // Fetch immediately
    
    // Set up interval for periodic fetching
    const interval = setInterval(fetchQuote, intervalTime);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [intervalTime]); // Re-run if intervalTime changes

  return { quote, loading, fetchQuote };
}