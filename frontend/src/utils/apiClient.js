/**
 * API helpers.
 * - default export: get(path) for your backend
 * - named export: fetchQuote() for Quotable motivational quotes
 */
const API_BASE = ""; // e.g. "https://api.yourapp.com"

async function get(path) {
  const res = await fetch(API_BASE + path, {
    method: "GET",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Motivational quotes only
export async function fetchQuote() {
  const url = "https://api.quotable.io/random?tags=inspirational|motivational";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch quote");
  return res.json();
}

export default { get };