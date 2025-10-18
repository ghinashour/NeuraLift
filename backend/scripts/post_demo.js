// Demo script to POST to /api/chat and print JSON reply
const fetch = globalThis.fetch || require('node-fetch');
const API_URL = process.env.API_URL || 'http://localhost:4000/api';

async function run() {
  try {
    const resp = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello, summarize the project' })
    });
    const text = await resp.text();
    console.log('status:', resp.status);
    console.log(text);
  } catch (e) {
    console.error('error:', e);
  }
}
run();
