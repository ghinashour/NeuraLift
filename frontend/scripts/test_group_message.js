// Simple test script to POST a group chat message and trigger notifications.
// Usage (PowerShell):
// $env:TOKEN="<jwt>"; $env:GROUP_ID="<groupId>"; $env:CONTENT="Hello from test"; node frontend/scripts/test_group_message.js

const axios = require('axios');

(async () => {
  const token = process.env.TOKEN;
  const groupId = process.env.GROUP_ID;
  const content = process.env.CONTENT || 'Hello from automated test';
  const base = process.env.API_BASE || 'http://localhost:4000/api';

  if (!token || !groupId) {
    console.log('Missing TOKEN or GROUP_ID environment variables.');
    console.log('Set them and re-run:');
    console.log('  $env:TOKEN="<jwt>"; $env:GROUP_ID="<groupId>"; $env:CONTENT="Hi"; node frontend/scripts/test_group_message.js');
    process.exit(0);
  }

  try {
    const url = `${base}/collaborate/chat/groups/${groupId}/messages`;
    console.log('POST', url);
    const res = await axios.post(url, { content }, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Status:', res.status);
    console.log('Response data:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.error('Server responded with:', err.response.status, err.response.data);
    } else {
      console.error('Request error:', err.message);
    }
    process.exit(1);
  }
})();
