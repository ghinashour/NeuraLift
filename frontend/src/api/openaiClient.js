// src/api/openaiClient.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OpenAI_API_KEY // or your actual key (not recommended in frontend)
});

export default openai;
