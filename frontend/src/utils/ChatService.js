export const sendMessageToBackend = async (messages) => {
  try {
    const response = await fetch("http://localhost:4000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error("Server error: " + response.statusText);
    }

    const data = await response.json();
    console.log("Backend response:", data);  // 🔹 Add this for debugging
    return data; // { role, content }
  } catch (err) {
    console.error("Error sending message:", err);
    return { role: "assistant", content: "Sorry, something went wrong." };
  }
};
