import { useState, useCallback } from 'react';

const RAW_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:4000').replace(/\/$/, '');
const API_BASE = RAW_BASE.endsWith('/api') ? RAW_BASE : `${RAW_BASE}/api`;

const LOCAL_RESPONSES = {
  hello: 'Hello! I\'m NeuraLift Assistant — powered by AI. How can I support you today?',
  hi: 'Hi there! What can I help you with — focus, stress, sleep or planning?',
  hey: 'Hey! How can I help you feel calmer and more focused?',
  help: 'I can help with wellness tips, focus plans, stress relief, sleep habits, and using NeuraLift. What\'s on your mind?',
  'what is neuralift': 'NeuraLift is your wellness companion — tasks, mood tracking, focus timer, stress relief and community support.',
  neuralift: 'NeuraLift helps you stay calm and productive with tasks, mood insights, focus tools and community.',
  'how are you': 'I\'m here and ready to help! How are you feeling today?',
  'thank you': 'You\'re welcome! I\'m here whenever you need support.',
  thanks: 'You\'re welcome! Happy to help!',
  bye: 'Take care! I\'m here whenever you need a calm moment.',
  goodbye: 'Goodbye for now — remember to breathe and be kind to yourself.',
  wellness: 'Wellness is balance across mind, body and rest. Small daily habits beat big occasional efforts. Want a simple plan?',
  'mental health': 'Your mental health matters. I can share coping tools, but I\'m not a replacement for professional support. What would help most right now?',
  stress: 'For stress: try box breathing (in-4, hold-4, out-4, hold-4) for 2 minutes, then pick one tiny next step. Want a wind-down routine?',
  anxiety: 'Anxiety is common. Ground yourself: 5-4-3-2-1 senses, slow exhales. If it persists, please reach out to a professional.',
  sleep: 'Better sleep: fixed wake time, wind-down routine, no screens 30 min before bed, cool dark room.',
  exercise: 'Movement boosts mood — even a 10-minute walk counts. What feels doable today?',
  meditation: 'Start meditation with 5 slow breaths, noticing each inhale and exhale. A little daily goes a long way.',
  focus: 'For focus: 25-min timer, one task, phone away. I can draft a focus session for you — just say the task.',
};

function getLocalResponse(input) {
  const lower = (input || '').toLowerCase().trim();
  if (!lower) return 'Please type a message so I can help.';
  if (LOCAL_RESPONSES[lower]) return LOCAL_RESPONSES[lower];
  for (const [k, v] of Object.entries(LOCAL_RESPONSES)) {
    if (lower.includes(k)) return v;
  }
  return 'Got it — tell me a bit more and I\'ll help with focus, stress, sleep or planning.';
}

export const useAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [source, setSource] = useState(null);

  const processMessage = useCallback(async (message, history = []) => {
    const clean = (message || '').trim();
    if (!clean) return 'Please type a message so I can help.';
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: clean, history: Array.isArray(history) ? history.slice(-10) : [] }),
      });
      if (!res.ok) throw new Error(`chat ${res.status}`);
      const data = await res.json();
      const reply = data?.reply || data?.answer || '';
      if (!reply) throw new Error('empty reply');
      setSource(data?.source || 'api');
      return reply;
    } catch (e) {
      // Offline / server down — local fallback so UI never breaks
      setSource('local');
      await new Promise((r) => setTimeout(r, 500));
      return getLocalResponse(clean);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { processMessage, isProcessing, source, getLocalResponse };
};
