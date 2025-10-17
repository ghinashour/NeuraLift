import { useState, useEffect } from "react";
import "./StressReliefSpace.css";
import Whiteboard from "./WhiteBoard";
import API from "../../api/axios"; // your Axios instance

const StressRelief = () => {
  const [input, setInput] = useState("");
  const [thoughts, setThoughts] = useState([]);

  // Fetch notes from backend
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await API.get("/notes");
        setThoughts(data);
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };
    fetchNotes();
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;

    try {
      const { data } = await API.post("/notes", { content: input });
      setThoughts((prev) => [data, ...prev]);
      setInput("");
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  return (
    <div id="stresscontainers">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1 style={{ color: "black" }}>Stress Relief Space</h1>
      </div>
      <p style={{ textAlign: "center", color: "#626A84" }}>
        Express yourself through art and release negative thoughts
      </p>

      <div id="cont2boxes">
        <div id="boardcont">
          <h1 style={{ color: "black", textAlign: "center" }}>Creative Canvas</h1>
          <Whiteboard />
        </div>

        <div id="thoughtscont">
          <h1 style={{ color: "black", textAlign: "center" }}>
            Release Your Thoughts
          </h1>
          <p
            style={{
              color: "#626A84",
              textAlign: "center",
              width: "500px",
              margin: "6px auto 13px",
            }}
          >
            Write down any negative thoughts, worries, or stress. Once written,
            you can choose to release them.
          </p>

          <input
            type="text"
            id="stressinput"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's on your mind? Write it all out..."
          />
          <button id="stress-btn" onClick={addTask}>
            Capture This Thought
          </button>

          <p style={{ color: "#626A84", marginTop: "20px" }}>Thoughts to release</p>

          <div style={{ color: "black", width: "440px", height: "225px", overflowY: "auto" }}>
            {thoughts.map((note) => (
              <p key={note._id}>- {note.content}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StressRelief;
