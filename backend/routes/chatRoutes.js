const express = require('express');
const { sendMessage, getConversation } = require('../controllers/chatController');

const router = express.Router();

router.post('/', sendMessage);
router.get('/:sessionId', getConversation);

module.exports = router;