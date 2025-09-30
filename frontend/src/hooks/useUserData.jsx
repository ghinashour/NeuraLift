/**
 * Fetches the user name from your backend.
 * Adjust the endpoint to your API. Expected response: { name: "Mhmd" }
 */
import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";

export default function useUserData() {
  const [name, setName] = useState("User");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiClient.get("/api/User");
        if (mounted && data?.name) setName(data.name);
      } catch {
        /* keep fallback */
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  return { name, loading };
}