// backend/server.js
// ======================================================
// MERN Full Deployment for Render (/backend + /frontend)
// ======================================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const path = require("path");
const fs = require("fs");
const passport = require("passport");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
require("dotenv").config();
require("./config/passport");

// Import routes
const profileRoutes = require("./routes/profile.js");
const questionRoutes = require("./routes/questions.js");
const devQuestionRoutes = require("./routes/DevQuestionRoute.js");
const assemblyGameRoutes = require("./routes/assemblyGame");
const tensizesRoutes = require("./routes/tenziesRoutes");
const eventRoutes = require("./routes/eventRoutes.js");
const authRoutes = require("./routes/authRoute");
const adminRoutes = require("./routes/admin.js");
const successStoryRoutes = require("./routes/successStories");
const quoteRoutes = require("./routes/quotes.js");
const moodRoutes = require("./routes/moodroutes.js");
const tasksRouter = require("./routes/tasks.js");
const noteRoute = require("./routes/noteUserRoute.js");
const adminTaskRouter = require("./routes/admin/taskRoutes.js");
const notificationRoutes = require("./routes/Notification.js");
const chatRoutes = require("./routes/chatRoutes.js");
const medicineRoutes = require("./routes/medicineRoutes.js");
const collaborateRoutes = require("./routes/collaborate");
const assistantRoutes = require("./routes/assistant");
const gamesRoutes = require("./routes/games");
const contactRoutes = require("./routes/contactRoute.js");
const { sendMessageToBackend } = require("./ChatService.js");
const User = require("./models/User.js");

// ------------------------------------------------
// APP + SERVER + SOCKET.IO
// ------------------------------------------------
const app = express();
// Render / Vercel sit behind proxies — needed for correct IPs + secure cookies
app.set("trust proxy", 1);
const server = http.createServer(app);

const socketOrigins = [
  ...(process.env.CLIENT_ORIGIN || "http://localhost:3000").split(","),
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : []),
]
  .map((s) => s.trim().replace(/\/$/, ""))
  .filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: socketOrigins,
    credentials: true,
  },
});

// ------------------------------------------------
// MIDDLEWARE
// ------------------------------------------------
app.use(express.json());
app.use(cookieParser());
// Allow both CLIENT_ORIGIN (comma-separated) and CLIENT_URL so
// Render backend accepts the Vercel frontend even if only one is set.
const allowedOrigins = [
  ...(process.env.CLIENT_ORIGIN || "http://localhost:3000").split(","),
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : []),
]
  .map((s) => s.trim().replace(/\/$/, ""))
  .filter(Boolean);
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);
app.use(passport.initialize());
// Render free disks are ephemeral — ensure the folder exists so uploads never crash boot
fs.mkdirSync(path.join(__dirname, "uploads"), { recursive: true });
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------------------------------------
// JWT verification for Socket.IO
// ------------------------------------------------
const verifyJwt = async (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid token");
  }
};

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication error"));
    const payload = await verifyJwt(token);
    socket.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id, "User:", socket.user.id);

  const userRoom = String(socket.user.id);
  socket.join(userRoom);
  connectedUsers.set(userRoom, socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
    connectedUsers.delete(userRoom);
  });
});

app.set("io", io);

// ------------------------------------------------
// USER STREAK LOGIC (matches User model: streak.current / streak.longestStreak)
// ------------------------------------------------
app.post("/api/user/:id/update-streak", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const today = new Date();
    if (!user.streak) user.streak = { current: 0, longestStreak: 0 };
    const lastLogin = user.streak.lastLoginDate
      ? new Date(user.streak.lastLoginDate)
      : user.lastLogin
        ? new Date(user.lastLogin)
        : null;

    const normalizeDate = (date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const normalizedToday = normalizeDate(today);
    const normalizedLast = lastLogin ? normalizeDate(lastLogin) : null;

    let diffInDays = 0;
    if (normalizedLast) {
      diffInDays = Math.floor((normalizedToday - normalizedLast) / (1000 * 60 * 60 * 24));
    }

    if (normalizedLast) {
      if (diffInDays === 1) user.streak.current += 1;
      else if (diffInDays > 1) user.streak.current = 1;
      // diffInDays === 0 → same day, keep streak
    } else {
      user.streak.current = 1;
    }

    user.streak.lastLoginDate = today;
    user.lastLogin = today;
    if (!user.streak.longestStreak || user.streak.current > user.streak.longestStreak)
      user.streak.longestStreak = user.streak.current;

    await user.save();

    res.status(200).json({
      success: true,
      streak: user.streak.current,
      longestStreak: user.streak.longestStreak,
      lastLoginDate: user.streak.lastLoginDate,
    });
  } catch (err) {
    console.error("Error updating streak:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------------------------------------
// HEALTH CHECK (for Render / Docker)
// ------------------------------------------------
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    time: new Date().toISOString(),
  });
});
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    time: new Date().toISOString(),
  });
});

// ------------------------------------------------
// CHAT API (Groq-first, OpenRouter/OpenAI fallback, local last)
// Accepts {message,history} or {messages}
// ------------------------------------------------
app.post("/api/chat", async (req, res) => {
  const { message, history, messages } = req.body || {};
  const rawLast = Array.isArray(messages) ? messages[messages.length - 1] : null;
  const normalizedMessage =
    message ||
    (typeof rawLast === "string" ? rawLast : rawLast?.content || rawLast?.text || null);
  const normalizedHistory = Array.isArray(history)
    ? history
    : Array.isArray(messages)
      ? messages.slice(0, -1)
      : [];
  if (!normalizedMessage || !String(normalizedMessage).trim())
    return res.status(400).json({ error: "Message is required" });

  try {
    const result = await sendMessageToBackend(normalizedMessage, normalizedHistory);
    // Back-compat: reply as string; new clients can use reply+source
    if (typeof result === "string") return res.json({ reply: result, source: "legacy" });
    return res.json({ reply: result.reply, source: result.source || "groq" });
  } catch (error) {
    console.error("Chat error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
});

// ------------------------------------------------
// API ROUTES
// ------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/devquestions", devQuestionRoutes);
app.use("/api/assembly-game", assemblyGameRoutes);
app.use("/api/tenzies", tensizesRoutes);
app.use("/api/success-stories", successStoryRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/notes", noteRoute);
app.use("/api/notifications", notificationRoutes);
// OpenAI chat-history API (kept separate to avoid shadowing POST /api/chat above)
app.use("/api/chat-history", chatRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/tasks", tasksRouter);
app.use("/api/admin/tasks", adminTaskRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/collaborate", collaborateRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/games", gamesRoutes);

// ------------------------------------------------
// Serve React Frontend (only if build exists — API-only deploys skip this)
// ------------------------------------------------
const clientBuildPath = path.join(__dirname, "../frontend/build");
const clientIndex = path.join(clientBuildPath, "index.html");
if (fs.existsSync(clientIndex)) {
  app.use(express.static(clientBuildPath));

  // API 404 — must come before SPA fallback so /api/* never returns HTML
  app.use("/api", (req, res) => {
    res.status(404).json({ success: false, error: "API route not found" });
  });

  // SPA fallback for non-API GET routes only (Express 5 safe)
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(clientIndex);
  });
} else {
  console.warn("⚠️  Frontend build not found — serving API only.");
  app.use("/api", (req, res) => {
    res.status(404).json({ success: false, error: "API route not found" });
  });
}

// Central error handler (must be last)
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: process.env.NODE_ENV === "production" ? "Server error" : err.message,
  });
});


// ------------------------------------------------
// DATABASE CONNECTION
// (skipped when already connected — e.g. test harness
//  connects to an in-memory server before requiring us)
// ------------------------------------------------
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not set — set it in .env / Render env vars.");
}
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is not set — auth will fail. Set it in .env / Render env vars.");
}
if (process.env.MONGO_URI && mongoose.connection.readyState === 0) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err.message));
}

// ------------------------------------------------
// START SERVER (only when run directly, not when required)
// ------------------------------------------------
const PORT = process.env.PORT || 4000;
if (require.main === module) {
  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;
