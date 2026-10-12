// src/pages/StressReliefSpace.jsx
import React, { useState, useRef, useEffect } from "react";
import "./StressReliefSpace.css";
import { Brush, Eraser, Send, MessageSquare, Edit2, Trash2, FileText } from "lucide-react";
import Ai from "../../components/AiLogo";

const PALETTE = [
  "#6757A3",
  "#F1948A",
  "#F5B97F",
  "#E9C46A",
  "#7FB069",
  "#6FBFA8",
  "#6FA8DC",
  "#B39DDB",
  "#F48FB1",
  "#9AA0A6",
];

const CANVAS_BG = "#FFFFFF";
const DEFAULT_COLOR = "#6757A3";

const StressReliefSpace = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawingRef = useRef(false);

  // Use refs for color/size to avoid reattaching event listeners on every change
  const colorRef = useRef(DEFAULT_COLOR);
  const sizeRef = useRef(3);

  const [color, setColor] = useState(DEFAULT_COLOR);
  const [lastColor, setLastColor] = useState(DEFAULT_COLOR);
  const [size, setSize] = useState(3);

  const [thought, setThought] = useState("");
  const [thoughts, setThoughts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const isErasing = color === CANVAS_BG;

  const pickColor = (c) => {
    setColor(c);
    if (c !== CANVAS_BG) setLastColor(c);
  };

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
    <div className="nl-page">
      <div className="nl-hero">
        <div className="nl-hero-copy">
          <p className="nl-eyebrow">Stress Relief Space</p>
          <h1 className="nl-title">
            A calmer mind,
            <br />a <em>brighter</em> you.
          </h1>
          <p className="nl-lede">
            Express yourself through art and release negative thoughts. Take a moment for
            yourself — there&apos;s no right or wrong, just a space to feel lighter.
          </p>
        </div>
        <p className="nl-hero-quote">“A quiet moment can change your whole day.”</p>
      </div>

      <div className="nl-grid-2">
        {/* Canvas Section */}
        <section className="nl-card" aria-label="Creative canvas">
          <div className="nl-card-head">
            <span className="nl-chip">
              <Brush size={22} />
            </span>
            <div>
              <h2 className="nl-card-title">Creative Canvas</h2>
              <p className="nl-card-sub">Let your creativity flow. Draw, doodle, or paint whatever comes to mind.</p>
            </div>
          </div>

          <div className="stress-toolbar">
            <button className={`btn-soft${!isErasing ? " on" : ""}`} onClick={() => pickColor(lastColor)}>
              <Brush size={15} />
              Brush
            </button>
            <button className={`btn-soft${isErasing ? " on" : ""}`} onClick={() => setColor(CANVAS_BG)}>
              <Eraser size={15} />
              Eraser
            </button>
            <span className="stress-size">
              Size:
              <input
                type="number"
                className="nl-input stress-size-input"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                min="1"
                max="50"
                aria-label="Brush size in pixels"
              />
              px
            </span>
          </div>

          <div className="stress-palette" role="radiogroup" aria-label="Brush colors">
            {PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={color === c}
                aria-label={`Color ${c}`}
                className={`stress-dot${color === c ? " active" : ""}`}
                style={{ background: c }}
                onClick={() => pickColor(c)}
              />
            ))}
          </div>

          <canvas ref={canvasRef} className="stress-canvas" />

          <div className="stress-actions">
            <button className="btn-outline" onClick={clearCanvas}>
              Clear
            </button>
            <button
              className="btn-primary stress-save"
              onClick={() => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const link = document.createElement("a");
                link.download = `art_${Date.now()}.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();
              }}
            >
              Save Artwork
            </button>
          </div>
        </section>

        {/* Thoughts Section */}
        <section className="nl-card" aria-label="Release your thoughts">
          <div className="nl-card-head">
            <span className="nl-chip">
              <MessageSquare size={22} />
            </span>
            <div>
              <h2 className="nl-card-title">Release Your Thoughts</h2>
              <p className="nl-card-sub">
                Write down any negative thoughts, worries, or stress. Once written, you can choose to release them.
              </p>
            </div>
          </div>

          <textarea
            placeholder="What's weighing on your mind? Write it all out..."
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            className="nl-textarea"
            aria-label="Write down your thoughts"
          />

          <button className="btn-primary stress-capture" onClick={addThought}>
            <Send size={16} />
            Capture This Thought
          </button>

          <hr className="nl-divider" />
          <p className="nl-section-label">Recent Thoughts</p>

          <div className="thought-list">
            {thoughts.length === 0 ? (
              <div className="nl-empty">
                <span className="nl-chip nl-chip-sm">
                  <FileText size={18} />
                </span>
                <p>
                  <strong>No thoughts captured yet.</strong>
                  Your thoughts will appear here when you capture them.
                </p>
              </div>
            ) : (
              thoughts.map((t) => (
                <div key={t.id} className="thought-item">
                  {editingId === t.id ? (
                    <div className="thought-edit">
                      <input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="nl-input"
                        aria-label="Edit thought"
                      />
                      <button className="btn-soft on" onClick={() => saveEdit(t.id)}>
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="thought-text">{t.text}</span>
                      <div className="thought-actions">
                        <button className="icon-btn" onClick={() => startEdit(t.id, t.text)} aria-label="Edit thought">
                          <Edit2 size={16} />
                        </button>
                        <button className="icon-btn danger" onClick={() => deleteThought(t.id)} aria-label="Release thought">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Floating AI Button */}
      <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
        <Ai />
      </div>
    </div>
  );
};

export default StressReliefSpace;
