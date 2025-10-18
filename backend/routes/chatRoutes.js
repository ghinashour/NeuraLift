const express = require('express');
const { sendMessage, getConversation } = require('../controllers/chatController');

const router = express.Router();

router.post('/', sendMessage);
// streaming endpoint for token-by-token responses
router.post('/stream', require('../controllers/chatController').streamMessage);
router.get('/:sessionId', getConversation);

module.exports = router;