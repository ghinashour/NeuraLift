const axios = require("axios");

const openai = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
  },
});

const sendMessageToBackend = async (userMessage, history = []) => {
  try {
    const response = await openai.post("/chat/completions", {
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        ...history,
        { role: "user", content: userMessage },
      ],
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter error:", error.response?.data || error.message);
    throw new Error("Error communicating with OpenRouter");
  }
};

module.exports = { sendMessageToBackend };
