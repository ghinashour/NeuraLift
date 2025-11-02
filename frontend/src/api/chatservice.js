// frontend/src/services/ChatService.js
export const sendMessageToBackend = async (messages) => {
  try {
    const response = await fetch("http://localhost:4000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }), // ✅ Must match backend expectation
    });

    if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
