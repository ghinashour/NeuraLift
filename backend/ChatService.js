const axios = require("axios");

const GROQ_BASE = "https://api.groq.com/openai/v1";
const OPENROUTER_BASE = "https://openrouter.ai/api/v1";
const OPENAI_BASE = "https://api.openai.com/v1";

const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
const OPENAI_MODEL = process.env.OPENAI_CHAT_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini";

const SYSTEM_PROMPT =
  "You are NeuraLift Assistant, a warm wellness companion. " +
  "Support mental well-being, focus, productivity, stress relief, sleep and healthy habits. " +
  "Be concise (under 150 words), empathetic, practical. " +
  "Never diagnose medical conditions or replace professional help — encourage reaching out to a professional when needed.";

const LOCAL_FALLBACKS = [
  { keys: ["hello", "hi", "hey"], reply: "Hello! I'm NeuraLift Assistant. How can I support you today?" },
  { keys: ["stress"], reply: "Stress is tough. Try a 60-second reset: breathe in 4 counts, hold 4, out 6 — repeat 4 times. Want a quick focus plan?" },
  { keys: ["anxiety"], reply: "Anxiety is common. Ground yourself: name 5 things you see, 4 you hear, 3 you feel. If it persists, consider talking to a professional." },
  { keys: ["sleep"], reply: "For better sleep: fixed bedtime, no screens 30 min before bed, cool dark room. What's your current routine?" },
  { keys: ["focus", "productivity", "study"], reply: "Try 25-min focus + 5-min break. Pick one small task, silence notifications, and start. Want me to draft a plan?" },
  { keys: ["meditation", "breath"], reply: "Start with 5 minutes: sit tall, breathe slowly, return attention to breath when it wanders." },
  { keys: ["neuralift"], reply: "NeuraLift is your wellness companion — tasks, mood tracking, focus timer, stress relief and community support." },
];

function localReply(userMessage) {
  const lower = (userMessage || "").toLowerCase();
  for (const item of LOCAL_FALLBACKS) {
    if (item.keys.some((k) => lower.includes(k))) return item.reply;
  }
  return "Thanks for sharing. Could you tell me a bit more so I can help with focus, stress, sleep or planning?";
}

function normalizeHistory(history = []) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((m) => m && (m.role || m.sender) && (m.content || m.text))
    .slice(-10)
    .map((m) => ({
      role: m.role || (m.sender === "user" ? "user" : "assistant"),
      content: String(m.content ?? m.text ?? "").slice(0, 2000),
    }));
}

async function callGroq(userMessage, history) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY missing");
  const res = await axios.post(
    `${GROQ_BASE}/chat/completions`,
    {
      model: GROQ_MODEL,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history, { role: "user", content: userMessage }],
      temperature: 0.7,
      max_tokens: 600,
    },
    {
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      timeout: 25000,
    }
  );
  const text = res.data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Empty Groq reply");
  return text;
}

async function callOpenRouter(userMessage, history) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY missing");
  const res = await axios.post(
    `${OPENROUTER_BASE}/chat/completions`,
    {
      model: OPENROUTER_MODEL,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history, { role: "user", content: userMessage }],
    },
    {
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      timeout: 25000,
    }
  );
  const text = res.data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Empty OpenRouter reply");
  return text;
}

async function callOpenAI(userMessage, history) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY missing");
  const res = await axios.post(
    `${OPENAI_BASE}/chat/completions`,
    {
      model: OPENAI_MODEL,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history, { role: "user", content: userMessage }],
      temperature: 0.7,
      max_tokens: 600,
    },
    {
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      timeout: 25000,
    }
  );
  const text = res.data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Empty OpenAI reply");
  return text;
}

const sendMessageToBackend = async (userMessage, history = []) => {
  if (!userMessage || !String(userMessage).trim()) throw new Error("Message is required");
  const cleanHistory = normalizeHistory(history);

  const errors = [];
  // Priority: Groq -> OpenRouter -> OpenAI -> local
  try {
    const reply = await callGroq(String(userMessage), cleanHistory);
    return { reply, source: "groq" };
  } catch (e) {
    errors.push(`groq: ${e.response?.data?.error?.message || e.message}`);
  }
  try {
    const reply = await callOpenRouter(String(userMessage), cleanHistory);
    return { reply, source: "openrouter" };
  } catch (e) {
    errors.push(`openrouter: ${e.response?.data?.message || e.message}`);
  }
  try {
    const reply = await callOpenAI(String(userMessage), cleanHistory);
    return { reply, source: "openai" };
  } catch (e) {
    errors.push(`openai: ${e.response?.data?.error?.message || e.message}`);
  }
  // Final fallback so the assistant always answers
  console.warn("All AI providers failed, using local fallback:", errors.join(" | "));
  return { reply: localReply(userMessage), source: "local" };
};

// Back-compat: some callers expect a plain string
const sendMessageToBackendString = async (userMessage, history = []) => {
  const { reply } = await sendMessageToBackend(userMessage, history);
  return reply;
};

module.exports = { sendMessageToBackend, sendMessageToBackendString, localReply };
