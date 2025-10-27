// backend/routes/chat.js
import express from "express";
import OpenAI from "openai";
import { prepareConversationHistory, generateSystemPrompt } from "../utils/chatHelpers.js";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Ensure the app uses express.json() in server.js:
// app.use(express.json());

router.post("/", async (req, res) => {
  try {
    const { messages } = req.body; // ✅ Must exist

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request: messages missing or not array" });
    }

    const chatHistory = prepareConversationHistory(messages, 10);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: generateSystemPrompt() },
        ...chatHistory,
      ],
      temperature: 0.7,
    });

    const aiReply = completion.choices[0].message.content;
    res.json({ reply: aiReply });

  } catch (err) {
    console.error("OpenAI Error:", err);
    res.status(500).json({ error: "Server error processing message" });
  }
});

export default router;
