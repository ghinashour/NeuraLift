// Simple demo script to POST to /api/chat/stream and print tokens as they arrive
// Usage: node backend/scripts/stream_demo.js

const fetch = globalThis.fetch || require('node-fetch');

const API_URL = process.env.API_URL || 'http://localhost:4000/api';

async function run() {
  const resp = await fetch(`${API_URL}/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Hello, can you summarize the NeuraLift project?' })
  });

  if (!resp.ok) {
    console.error('HTTP error', resp.status, await resp.text());
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let done = false;
  let buffer = '';

  while (!done) {
    const { value, done: streamDone } = await reader.read();
    done = streamDone;
    if (value) {
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;
      const parts = buffer.split(/\n\n/);
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i].trim();
        if (part.startsWith('data:')) {
          const token = part.replace(/^data:\s*/i, '');
          if (token === '[DONE]') continue;
          process.stdout.write(token);
        }
      }
      buffer = parts[parts.length - 1];
    }
  }
  console.log('\n[done]');
}

run().catch(err => console.error(err));
