const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

// Never load local credentials or connect to an external database in these checks.
require('dotenv').config = () => ({});
for (const key of [
  'MONGO_URI', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'OPENAI_API_KEY',
  'OPENAI_ADMIN_KEY', 'GROQ_API_KEY', 'OPENROUTER_API_KEY', 'RESEND_API_KEY', 'EMAIL_FROM',
]) delete process.env[key];
process.env.NODE_ENV = 'production';
process.env.JWT_SECRET = 'deployment-check-only';
process.env.CLIENT_ORIGIN = 'https://neura-lift.vercel.app';
process.env.CLIENT_URL = 'https://neura-lift.vercel.app';

const mongoose = require('mongoose');
const app = require('../index');
const sendEmail = require('../utils/sendEmail');
let server;
let base;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
});

test('boot without optional credentials; disabled endpoints return JSON 503 with CORS', async () => {
  for (const [method, route] of [
    ['GET', '/api/auth/google'],
    ['GET', '/api/auth/google/callback'],
    ['POST', '/api/chat-history'],
    ['POST', '/api/assistant'],
  ]) {
    const response = await fetch(base + route, {
      method,
      headers: { Origin: process.env.CLIENT_ORIGIN },
    });
    assert.equal(response.status, 503, route);
    assert.equal(response.headers.get('access-control-allow-origin'), process.env.CLIENT_ORIGIN);
    assert.match((await response.json()).error, /not configured/);
  }
});

test('login preflight accepts the production Vercel origin', async () => {
  const response = await fetch(base + '/api/auth/login', {
    method: 'OPTIONS',
    headers: {
      Origin: process.env.CLIENT_ORIGIN,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    },
  });
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('access-control-allow-origin'), process.env.CLIENT_ORIGIN);
  assert.equal(response.headers.get('access-control-allow-credentials'), 'true');
  assert.match(response.headers.get('access-control-allow-methods'), /POST/);
  assert.match(response.headers.get('access-control-allow-headers'), /content-type/i);
});

test('unlisted browser origins do not receive permission', async () => {
  const response = await fetch(base + '/api/health', { headers: { Origin: 'https://unlisted.example' } });
  assert.equal(response.headers.get('access-control-allow-origin'), null);
  await response.json();
});

test('JSON parse failures retain CORS headers', async t => {
  t.mock.method(console, 'error', () => {});
  const response = await fetch(base + '/api/auth/login', {
    method: 'POST',
    headers: { Origin: process.env.CLIENT_ORIGIN, 'Content-Type': 'application/json' },
    body: '{',
  });
  assert.equal(response.status, 400);
  assert.equal(response.headers.get('access-control-allow-origin'), process.env.CLIENT_ORIGIN);
  assert.equal((await response.json()).success, false);
});

test('password login remains reachable without OAuth or OpenAI', async t => {
  const User = require('../models/User');
  const lookup = t.mock.method(User, 'findOne', async () => null);
  const response = await fetch(base + '/api/auth/login', {
    method: 'POST',
    headers: { Origin: process.env.CLIENT_ORIGIN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'absent@example.com', password: 'test-only' }),
  });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).msg, 'Invalid credentials');
  assert.equal(lookup.mock.callCount(), 1);
});

test('both readiness paths report database disconnection', async () => {
  for (const route of ['/health', '/api/health']) {
    const response = await fetch(base + route);
    assert.equal(response.status, 503);
    const body = await response.json();
    assert.equal(body.ok, false);
    assert.equal(body.mongo, 'disconnected');
  }
});

test('readiness recovers when MongoDB is connected', async () => {
  Object.defineProperty(mongoose.connection, 'readyState', { configurable: true, get: () => 1 });
  try {
    const response = await fetch(base + '/api/health');
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.ok, true);
    assert.equal(body.mongo, 'connected');
  } finally {
    delete mongoose.connection.readyState;
  }
});

test('Groq chat works without OpenAI', async t => {
  const axios = require('axios');
  process.env.GROQ_API_KEY = 'test-only';
  const post = t.mock.method(axios, 'post', async url => {
    assert.equal(url, 'https://api.groq.com/openai/v1/chat/completions');
    return { data: { choices: [{ message: { content: 'Groq test reply' } }] } };
  });
  try {
    const response = await fetch(base + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello' }),
    });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { reply: 'Groq test reply', source: 'groq' });
    assert.equal(post.mock.callCount(), 1);
  } finally {
    delete process.env.GROQ_API_KEY;
  }
});

test('Google registration requires both credentials, including with partial configuration', () => {
  for (const [id, secret, enabled] of [
    ['', '', false], ['test-id', '', false], ['', 'test-secret', false],
    ['   ', 'test-secret', false], ['test-id', 'test-secret', true],
  ]) {
    const result = spawnSync(process.execPath, ['-e', `
      require('dotenv').config = () => ({});
      process.env.GOOGLE_CLIENT_ID = ${JSON.stringify(id)};
      process.env.GOOGLE_CLIENT_SECRET = ${JSON.stringify(secret)};
      const { googleAuthEnabled } = require('./config/passport');
      require('node:assert/strict').equal(googleAuthEnabled, ${enabled});
      require('node:assert/strict').equal(Boolean(require('passport')._strategy('google')), ${enabled});
    `], { cwd: path.join(__dirname, '..'), encoding: 'utf8', timeout: 10000 });
    assert.equal(result.status, 0, result.stderr);
  }
});

test('missing Resend configuration fails without attempting delivery', async t => {
  const delivery = t.mock.method(globalThis, 'fetch', async () => assert.fail('Unexpected email request'));
  await assert.rejects(sendEmail({ to: 'test@example.com', subject: 'test' }), { status: 503 });
  assert.equal(delivery.mock.callCount(), 0);
});

test('Resend delivery uses HTTPS, the verified sender, and reply_to', async t => {
  process.env.RESEND_API_KEY = 'test-resend-key';
  process.env.EMAIL_FROM = 'Neuralift <noreply@example.com>';
  t.after(() => {
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM;
  });
  const delivery = t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    assert.equal(options.headers.Authorization, 'Bearer test-resend-key');
    assert.equal(options.method, 'POST');
    assert.deepEqual(JSON.parse(options.body), {
      from: process.env.EMAIL_FROM,
      to: ['support@example.com'],
      subject: 'Contact test',
      text: 'Hello',
      reply_to: 'visitor@example.com',
    });
    return { ok: true, json: async () => ({ id: 'test-message' }) };
  });
  assert.deepEqual(await sendEmail({
    to: 'support@example.com', subject: 'Contact test', text: 'Hello', replyTo: 'visitor@example.com',
  }), { id: 'test-message' });
  assert.equal(delivery.mock.callCount(), 1);
});

test('verification and password-reset templates use the shared Resend transport', async t => {
  process.env.RESEND_API_KEY = 'test-resend-key';
  process.env.EMAIL_FROM = 'noreply@example.com';
  t.after(() => {
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM;
  });
  const payloads = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    payloads.push(JSON.parse(options.body));
    return { ok: true, json: async () => ({ id: 'test-message' }) };
  });
  await require('../utils/email')('user@example.com', 'https://example.com/verify/test');
  await require('../utils/resetEmail')('user@example.com', 'https://example.com/reset-password?token=test');
  assert.equal(payloads.length, 2);
  assert.match(payloads[0].html, /https:\/\/example.com\/verify\/test/);
  assert.match(payloads[1].html, /https:\/\/example.com\/reset-password\?token=test/);
  for (const payload of payloads) {
    assert.equal(payload.from, process.env.EMAIL_FROM);
    assert.deepEqual(payload.to, ['user@example.com']);
  }
});

test('Resend rejection is surfaced as a delivery error', async t => {
  process.env.RESEND_API_KEY = 'test-resend-key';
  process.env.EMAIL_FROM = 'noreply@example.com';
  t.after(() => {
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM;
  });
  t.mock.method(globalThis, 'fetch', async () => ({
    ok: false, status: 403, json: async () => ({ message: 'Sender domain not verified' }),
  }));
  await assert.rejects(sendEmail({ to: 'user@example.com', subject: 'test' }), {
    status: 502, message: 'Resend email failed (403): Sender domain not verified',
  });
});

test('contact form does not claim success when email is unavailable', async t => {
  t.mock.method(console, 'error', () => {});
  const response = await fetch(base + '/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName: 'Test', email: 'user@example.com', message: 'Hello' }),
  });
  assert.equal(response.status, 503);
  assert.match((await response.json()).message, /Unable to send/);
});
