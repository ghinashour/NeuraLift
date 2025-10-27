import { useState, useEffect } from "react";
import "./StressReliefSpace.css";
import Whiteboard from "./WhiteBoard";
import API from "../../api/axios"; // your Axios instance
import AILogo from '../../components/AiLogo';

const StressRelief = () => {
  const [input, setInput] = useState("");
  const [thoughts, setThoughts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

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

  // Add new note
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

  // Delete a note
  const deleteTask = async (id) => {
    try {
      await API.delete(`/notes/${id}`);
      setThoughts((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  // Start editing a note
  const startEdit = (note) => {
    setEditingId(note._id);
    setEditingText(note.content);
  };

  // Save edited note
  const saveEdit = async (id) => {
    if (!editingText.trim()) return;

    try {
      const { data } = await API.put(`/notes/${id}`, { content: editingText });
      setThoughts((prev) =>
        prev.map((note) => (note._id === id ? data : note))
      );
      setEditingId(null);
      setEditingText("");
    } catch (err) {
      console.error("Error editing note:", err);
    }
  };

  return (
    <div className="stressPage-stresscontainers">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1 style={{ color: "black" }}>Stress Relief Space</h1>
      </div>
      <p style={{ textAlign: "center", color: "#626A84" }}>
        Express yourself through art and release negative thoughts
      </p>

      <div className="stressPage-cont2boxes">
        <div className="stressPage-boardcont">
          <h1 style={{ color: "black", textAlign: "center" }}>Creative Canvas</h1>
          <Whiteboard />
        </div>

        <div className="stressPage-thoughtscont">
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
            className="stressPage-stressinput"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's on your mind? Write it all out..."
          />
          <button className="stressPage-stress-btn" onClick={addTask}>
            Capture This Thought
          </button>

          <p style={{ color: "#626A84", marginTop: "20px" }}>Thoughts to release</p>

          <div
            style={{
              color: "black",
              width: "440px",
              maxHeight: "225px",
              overflowY: "auto",
              margin: "0 auto",
            }}
          >
            {thoughts.map((note) => (
              <div
                key={note._id}
                style={{
                  background: "#f0f4ff",
                  padding: "10px",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {editingId === note._id ? (
                  <>
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      style={{ flex: 1, marginRight: "10px", padding: "5px" }}
                    />
                    <button
                      onClick={() => saveEdit(note._id)}
                      style={{
                        background: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "5px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <span style={{ flex: 1 }}>- {note.content}</span>
                    <div>
                      <button
                        onClick={() => startEdit(note)}
                        style={{
                          marginRight: "5px",
                          background: "#FFC107",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          padding: "5px 10px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(note._id)}
                        style={{
                          background: "#F44336",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          padding: "5px 10px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <AILogo />
      </div>
    </div>
  );
};

export default StressRelief;
