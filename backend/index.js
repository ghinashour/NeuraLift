// backend/server.js
// ======================================================
// MERN Full Deployment for Render (/backend + /frontend)
// ======================================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const path = require("path");
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
const gamesRoutes = require("./routes/games");
const contactRoutes = require("./routes/contactRoute.js"); 
const { sendMessageToBackend } = require("./ChatService.js");
const User = require("./models/User.js");

// ------------------------------------------------
// APP + SERVER + SOCKET.IO
// ------------------------------------------------
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  },
});

// ------------------------------------------------
// MIDDLEWARE
// ------------------------------------------------
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(passport.initialize());
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
// USER STREAK LOGIC
// ------------------------------------------------
app.post("/api/user/:id/update-streak", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const today = new Date();
    const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;

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
      if (diffInDays === 1) user.streak += 1;
      else if (diffInDays > 1) user.streak = 1;
    } else {
      user.streak = 1;
    }

    user.lastLoginDate = today;
    if (!user.longestStreak || user.streak > user.longestStreak) user.longestStreak = user.streak;

    await user.save();

    res.status(200).json({
      success: true,
      streak: user.streak,
      longestStreak: user.longestStreak,
      lastLoginDate: user.lastLoginDate,
    });
  } catch (err) {
    console.error("Error updating streak:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------------------------------------
// CHAT API
// ------------------------------------------------
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const aiResponse = await sendMessageToBackend(message, history);
    res.json({ reply: aiResponse });
  } catch (error) {
    console.error("Chat error:", error);
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
app.use("/api/chat", chatRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/tasks", tasksRouter);
app.use("/api/admin/tasks", adminTaskRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/collaborate", collaborateRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/games", gamesRoutes);

// ------------------------------------------------
// Serve React Frontend
// ------------------------------------------------
const clientBuildPath = path.join(__dirname, "../frontend/build");
app.use(express.static(clientBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// ------------------------------------------------
// DATABASE CONNECTION
// ------------------------------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ------------------------------------------------
// START SERVER
// ------------------------------------------------
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
