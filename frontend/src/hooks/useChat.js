import { sendMessageToBackend } from "../utils/ChatService";

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (text, options) => {
    const userMessage = { id: Date.now(), sender: "user", text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Prepare messages for context if needed
      const preparedMessages = messages.concat(userMessage).map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const aiResponse = await sendMessageToBackend(preparedMessages);

      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: aiResponse.content,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => setMessages([]);
  const retryMessage = (id) => { /* optional retry logic */ };
  const cancelPending = () => { /* optional cancel logic */ };

  return { messages, sendMessage, isTyping, clearChat, retryMessage, cancelPending };
};
