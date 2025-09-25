const express = require("express");
const { getDevQuestions } = require("../controllers/devQuestionController");
const router = express.Router();

// GET /api/devquestions
router.get("/", getDevQuestions);

module.exports = router;