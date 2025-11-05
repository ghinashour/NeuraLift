// Simple test script to POST to the like endpoint for a success story.
// Usage:
//   $env:TOKEN="<jwt>"; $env:STORY_ID="<storyId>"; node frontend/scripts/test_like.js

const axios = require('axios');

(async () => {
  const token = process.env.TOKEN;
  const storyId = process.env.STORY_ID;
  const base = process.env.API_BASE || 'http://localhost:4000/api';

  if (!storyId || !token) {
    console.log('Missing TOKEN or STORY_ID environment variables.');
    console.log('Set them and re-run:');
    console.log('  $env:TOKEN="<jwt>"; $env:STORY_ID="<storyId>"; node frontend/scripts/test_like.js');
    process.exit(0);
  }

  try {
    const url = `${base}/success-stories/${storyId}/like`;
    console.log('POST', url);
    const res = await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
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
