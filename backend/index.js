// backend/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sendMessageToBackend } = require("./ChatService.js");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const aiResponse = await sendMessageToBackend(message, history);
    res.json({ reply: aiResponse });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
