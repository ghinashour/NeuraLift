// frontend/src/api/chat.js
export const sendMessageToAI = async (message, history = []) => {
  try {
    const response = await fetch("http://localhost:4000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
    });

    const data = await response.json();
    return data.reply || "No response";
  } catch (error) {
    console.error("Frontend chat error:", error);
    return "Error connecting to AI server.";
  }
};
