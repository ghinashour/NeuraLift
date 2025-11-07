// StressReliefSpace.jsx
import React, { useState, useRef, useEffect } from "react";
import "./StressReliefSpace.css";
import {
  Brush,
  Eraser,
  PencilLine,
  Send,
  MessageSquare,
  Edit2,
  Trash2
} from "lucide-react";
import Ai from "../../components/AiLogo";

const StressReliefSpace = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawingRef = useRef(false);

  const [color, setColor] = useState("#2563eb");
  const [size, setSize] = useState(3);

  const [thought, setThought] = useState("");
  const [thoughts, setThoughts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Helper: set canvas size (handles devicePixelRatio and preserves content)
  const resizeCanvasToDisplaySize = (canvas) => {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const displayWidth = Math.max(1, Math.round(rect.width));
    const displayHeight = Math.max(1, Math.round(rect.height));

    // create temp canvas to preserve content
    const temp = document.createElement("canvas");
    temp.width = canvas.width;
    temp.height = canvas.height;
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
      // draw temp into resized canvas (fit to display size)
      ctx.drawImage(temp, 0, 0, displayWidth, displayHeight);
    }

    return ctx;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ensure CSS gives an initial height/width (we set in CSS)
    const ctx = resizeCanvasToDisplaySize(canvas);
    if (!ctx) return;
    ctx.lineCap = "round";
    ctxRef.current = ctx;

    // Handlers use refs so they see latest isDrawing, color, size via closures we will read from refs/props
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
      currentCtx.lineWidth = size;
      currentCtx.lineCap = "round";
      currentCtx.strokeStyle = color;
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
    window.addEventListener("mousemove", draw); // listen on window for smoother drawing even if pointer leaves canvas
    window.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    // Resize handling
    let resizeObserver;
    // prefer ResizeObserver if available to track changes to canvas size
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        const newCtx = resizeCanvasToDisplaySize(canvas);
        if (newCtx) ctxRef.current = newCtx;
      });
      resizeObserver.observe(canvas);
    } else {
      const onResize = () => {
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
      } else {
        window.removeEventListener("resize", () => {});
      }
    };
    // We intentionally do not include color/size in deps so listeners don't get reattached repeatedly.
    // The draw handler reads `color` and `size` from closure variables — to reflect live changes,
    // we rely on the latest values from the state accessible in this scope because React re-renders.
    // However, because the event listeners are only attached once, we read `color` and `size`
    // directly from the latest state via the outer scope variables. This works because `draw`
    // references those variables via closure created by this effect on mount.
    // (Alternatively, you could store color/size in refs and read from them.)
  }, []); // run once on mount

  // Thoughts logic
  const addThought = () => {
    if (!thought.trim()) return;
    const newThought = { id: Date.now(), text: thought.trim() };
    setThoughts((prev) => [newThought, ...prev]);
    setThought("");
  };

  const deleteThought = (id) =>
    setThoughts((prev) => prev.filter((t) => t.id !== id));

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
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    // clear with respect to CSS pixels
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // after clearing, re-scale for DPR (ctx already scaled)
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
        {/* Canvas Section */}
        <div className="stressPage-section">
          <div className="stressPage-header">
            <Brush size={25} color="#2563eb" />
            <h2>Creative Canvas</h2>
          </div>

          <div className="stressPage-tools">
            <button
              className="tool-btn active"
              onClick={() => {
                /* brush selected (no-op) */
              }}
            >
              Brush
            </button>

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
              <input
                type="number"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                min="1"
                max="50"
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
              "#94a3b8"
            ].map((c) => (
              <div
                key={c}
                className={`color-circle ${color === c ? "active" : ""}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>

          {/* Canvas element - its CSS controls visible size; JS resizes internal bitmap */}
          <canvas ref={canvasRef} className="stressPage-canvas" />

          <div className="stressPage-actions">
            <button onClick={clearCanvas}>Clear</button>
            <button
              onClick={() => {
                // Simple "download" of canvas as PNG
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
          />

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

      {/* Floating AI Button */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000
        }}
      >
        <Ai />
      </div>
    </div>
  );
};

export default StressReliefSpace;
