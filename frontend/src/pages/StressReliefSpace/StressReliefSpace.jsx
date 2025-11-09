// src/pages/StressReliefSpace.jsx
import React, { useState, useRef, useEffect } from "react";
import "./StressReliefSpace.css";
import { Brush, Eraser, PencilLine, Send, MessageSquare, Edit2, Trash2 } from "lucide-react";
import Ai from "../../components/AiLogo";

const StressReliefSpace = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawingRef = useRef(false);

  // Use refs for color/size to avoid reattaching event listeners on every change
  const colorRef = useRef("#2563eb");
  const sizeRef = useRef(3);

  const [color, setColor] = useState("#2563eb");
  const [size, setSize] = useState(3);

  const [thought, setThought] = useState("");
  const [thoughts, setThoughts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // keep refs in sync with state
  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  // Helper: set canvas size (handles devicePixelRatio and preserves content)
  const resizeCanvasToDisplaySize = (canvas) => {
    if (!canvas) return null;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const displayWidth = Math.max(1, Math.round(rect.width));
    const displayHeight = Math.max(1, Math.round(rect.height));

    // create temp canvas to preserve content
    const temp = document.createElement("canvas");
    temp.width = canvas.width || 0;
    temp.height = canvas.height || 0;
    const tempCtx = temp.getContext("2d");
    if (canvas.width && canvas.height) {
      tempCtx.drawImage(canvas, 0, 0);
    }

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    // restore previous content (if any) scaled properly
    if (temp.width && temp.height) {
      ctx.drawImage(temp, 0, 0, displayWidth, displayHeight);
    }

    return ctx;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = resizeCanvasToDisplaySize(canvas);
    if (!ctx) return;
    ctx.lineCap = "round";
    ctxRef.current = ctx;

    // Event handlers reference refs for color/size to avoid stale closures
    const startDrawing = (e) => {
      const rect = canvas.getBoundingClientRect();
      isDrawingRef.current = true;
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const draw = (e) => {
      if (!isDrawingRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const currentCtx = ctxRef.current;
      if (!currentCtx) return;
      currentCtx.lineWidth = sizeRef.current;
      currentCtx.lineCap = "round";
      currentCtx.strokeStyle = colorRef.current;
      currentCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      currentCtx.stroke();
    };

    const stopDrawing = () => {
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;
      const currentCtx = ctxRef.current;
      if (currentCtx) currentCtx.closePath();
    };

    // Mouse events
    canvas.addEventListener("mousedown", startDrawing);
    window.addEventListener("mousemove", draw);
    window.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    // Resize handling
    let resizeObserver;
    let onResize = null;
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        const newCtx = resizeCanvasToDisplaySize(canvas);
        if (newCtx) ctxRef.current = newCtx;
      });
      resizeObserver.observe(canvas);
    } else {
      onResize = () => {
        const newCtx = resizeCanvasToDisplaySize(canvas);
        if (newCtx) ctxRef.current = newCtx;
      };
      window.addEventListener("resize", onResize);
    }

    // cleanup
    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      window.removeEventListener("mousemove", draw);
      window.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else if (onResize) {
        window.removeEventListener("resize", onResize);
      }
    };
    // We intentionally do not include color/size in deps because we read them from refs.
  }, []); // mount only

  // Thoughts logic
  const addThought = () => {
    if (!thought.trim()) return;
    const newThought = { id: Date.now(), text: thought.trim() };
    setThoughts((prev) => [newThought, ...prev]);
    setThought("");
  };

  const deleteThought = (id) => setThoughts((prev) => prev.filter((t) => t.id !== id));

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = (id) => {
    setThoughts((prev) => prev.map((t) => (t.id === id ? { ...t, text: editingText } : t)));
    setEditingId(null);
    setEditingText("");
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    // clear full internal bitmap (device pixels)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="stressPage-container">
      <h1 className="stressPage-title">
        <PencilLine size={24} />
        Stress Relief Space
      </h1>

      <p className="stressPage-subtitle">Express yourself through art and release negative thoughts</p>

      <div className="stressPage-content">
        {/* Canvas Section */}
        <div className="stressPage-section">
          <div className="stressPage-header">
            <Brush size={25} />
            <h2>Creative Canvas</h2>
          </div>

          <div className="stressPage-tools">
            <button className="tool-btn active">Brush</button>

            <button
              className="tool-btn"
              onClick={() => {
                // Eraser sets color to canvas background color
                setColor("#f8fafc");
              }}
            >
              <Eraser size={14} />
            </button>

            <label className="size-label">
              Size:
              <input type="number" value={size} onChange={(e) => setSize(Number(e.target.value))} min="1" max="50" />
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
              <div key={c} className={`color-circle ${color === c ? "active" : ""}`} style={{ background: c }} onClick={() => setColor(c)} />
            ))}
          </div>

          <canvas ref={canvasRef} className="stressPage-canvas" />

          <div className="stressPage-actions">
            <button onClick={clearCanvas}>Clear</button>
            <button
              onClick={() => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const link = document.createElement("a");
                link.download = `art_${Date.now()}.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();
              }}
            >
              Save Art
            </button>
          </div>
        </div>

        {/* Thoughts Section */}
        <div className="stressPage-section">
          <div className="stressPage-header">
            <MessageSquare size={23} />
            <h2>Release Your Thoughts</h2>
          </div>

          <p className="section-subtext">Write down any negative thoughts, worries, or stress. Once written, you can choose to release them.</p>

          <textarea placeholder="💭 What's weighing on your mind? Write it all out..." value={thought} onChange={(e) => setThought(e.target.value)} className="thought-input" />

          <button className="capture-btn" onClick={addThought}>
            <Send size={16} />
            <span style={{ marginLeft: 8 }}>Capture This Thought</span>
          </button>

          <div className="thought-list">
            {thoughts.length === 0 ? (
              <p className="no-thoughts">
                <MessageSquare size={18} />
                <span style={{ marginLeft: 8 }}>No thoughts captured yet</span>
              </p>
            ) : (
              thoughts.map((t) => (
                <div key={t.id} className="thought-item">
                  {editingId === t.id ? (
                    <>
                      <input value={editingText} onChange={(e) => setEditingText(e.target.value)} className="thought-edit-input" />
                      <button className="save-btn" onClick={() => saveEdit(t.id)}>
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{t.text}</span>
                      <div className="thought-actions">
                        <Edit2 size={16} onClick={() => startEdit(t.id, t.text)} />
                        <Trash2 size={16} onClick={() => deleteThought(t.id)} />
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Floating AI Button */}
      <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
        <Ai />
      </div>
    </div>
  );
};

export default StressReliefSpace;
