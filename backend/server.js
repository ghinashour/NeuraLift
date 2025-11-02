// server.js (CommonJS)
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Check if API key is loaded
console.log("Loaded API key:", process.env.OPENAI_API_KEY ? "✅" : "❌");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages format" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    res.json(response.choices[0].message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
