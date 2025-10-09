import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";

export default function useUserData() {
  const [name, setName] = useState("User");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await apiClient.get("/api/auth/me", {
          signal: controller.signal,
        });
        if (mounted && res?.username) {
          setName(res.username);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch user:", err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  return { name, loading };
}
