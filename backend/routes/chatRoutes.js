const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    let { messages, message, history } = req.body || {};
    // Compat: allow { message, history } shape too
    if (!messages && message) {
      messages = [...(Array.isArray(history) ? history : []), { role: "user", content: message }];
    }
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" });
    }
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY is not configured" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...messages,
      ],
      temperature: 0.7,
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error("Chat route error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
