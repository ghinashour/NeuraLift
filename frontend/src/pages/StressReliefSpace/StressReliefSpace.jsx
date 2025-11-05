import React, { useState, useRef, useEffect } from "react";
import "./StressReliefSpace.css";
import { Brush, Eraser, PencilLine, Send, MessageSquare, Edit2, Trash2 } from "lucide-react";
import Ai from "../../components/AiLogo";
const StressReliefSpace = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#2563eb");
  const [size, setSize] = useState(3);
  const [thought, setThought] = useState("");
  const [thoughts, setThoughts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // ✅ Canvas setup (fixed disappearing line issue)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Ensure canvas matches visible area
    const resizeCanvas = () => {
      const savedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.putImageData(savedImage, 0, 0);
    };

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    window.addEventListener("resize", resizeCanvas);

    const startDrawing = (e) => {
      setIsDrawing(true);
      const rect = canvas.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const draw = (e) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      ctx.lineWidth = size;
      ctx.lineCap = "round";
      ctx.strokeStyle = color;
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    };

    const stopDrawing = () => {
      setIsDrawing(false);
      ctx.closePath();
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
    };
  }, [color, size]);

  // ✅ Thought logic
  const addThought = () => {
    if (!thought.trim()) return;
    const newThought = { id: Date.now(), text: thought };
    setThoughts((prev) => [newThought, ...prev]);
    setThought("");
  };

  const deleteThought = (id) => setThoughts((prev) => prev.filter((t) => t.id !== id));

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = (id) => {
    setThoughts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: editingText } : t))
    );
    setEditingId(null);
    setEditingText("");
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="stressPage-container">
      <h1 className="stressPage-title">
        <PencilLine size={24} color="#2563eb" />
        Stress Relief Space
      </h1>
      <p className="stressPage-subtitle">
        Express yourself through art and release negative thoughts
      </p>

      <div className="stressPage-content">
        {/* 🎨 Creative Canvas */}
        <div className="stressPage-section">
          <div className="stressPage-header">
            <Brush size={25} color="#2563eb" />
            <h2>Creative Canvas</h2>
          </div>

          <div className="stressPage-tools">
            <button className="tool-btn active">Brush</button>
            <button className="tool-btn">
              <Eraser size={14} />
            </button>
            <label className="size-label">
              Size:
              <input
                type="number"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                min="1"
                max="20"
              />
              px
            </label>
          </div>

          <div className="color-palette">
            {[
              "#2563eb",
              "#f87171",
              "#fb923c",
              "#facc15",
              "#4ade80",
              "#2dd4bf",
              "#38bdf8",
              "#a78bfa",
              "#f472b6",
              "#94a3b8",
            ].map((c) => (
              <div
                key={c}
                className={`color-circle ${color === c ? "active" : ""}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>

          <canvas ref={canvasRef} className="stressPage-canvas"></canvas>

          <div className="stressPage-actions">
            <button onClick={clearCanvas}>Clear</button>
            <button>Save Art</button>
          </div>
        </div>

        {/* 💭 Release Thoughts */}
        <div className="stressPage-section">
          <div className="stressPage-header">
            <MessageSquare size={23} color="#2563eb" />
            <h2>Release Your Thoughts</h2>
          </div>
          <p className="section-subtext">
            Write down any negative thoughts, worries, or stress. Once written,
            you can choose to release them.
          </p>

          <textarea
            placeholder="💭 What's weighing on your mind? Write it all out..."
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            className="thought-input"
          ></textarea>

          <button className="capture-btn" onClick={addThought}>
            <Send size={16} /> Capture This Thought
          </button>

          <div className="thought-list">
            {thoughts.length === 0 ? (
              <p className="no-thoughts">
                <MessageSquare size={18} /> No thoughts captured yet
              </p>
            ) : (
              thoughts.map((t) => (
                <div key={t.id} className="thought-item">
                  {editingId === t.id ? (
                    <>
                      <input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="thought-edit-input"
                      />
                      <button
                        className="save-btn"
                        onClick={() => saveEdit(t.id)}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{t.text}</span>
                      <div className="thought-actions">
                        <Edit2
                          size={16}
                          color="#2563eb"
                          onClick={() => startEdit(t.id, t.text)}
                        />
                        <Trash2
                          size={16}
                          color="#ef4444"
                          onClick={() => deleteThought(t.id)}
                        />
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <Ai />
        </div>
    </div>
  );
};

export default StressReliefSpace;
