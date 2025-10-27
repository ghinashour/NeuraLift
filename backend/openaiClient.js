// backend/openaiClient.js
import axios from "axios";

const openai = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export default openai;
