const express = require('express');
const router = express.Router();
const { handleAssistant } = require('../controllers/assistantController');

// POST /api/assistant
router.post('/', handleAssistant);

module.exports = router;
