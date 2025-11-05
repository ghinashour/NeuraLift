<<<<<<< HEAD
// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- Mock Data Storage ----------------
let users = [
  { id: 1, name: "Omar Mousa", email: "omar@example.com", password: "123456" },
];
let moods = [];
let events = [];
let tasks = [];
let quotes = [
  "You are stronger than you think.",
  "Keep going, you’re doing great!",
  "Every small step counts.",
];
let successStories = [];

// ---------------- AUTH ROUTES ----------------

// Signup
app.post("/api/auth/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: "All fields required" });

  const exists = users.find((u) => u.email === email);
  if (exists)
    return res.status(400).json({ success: false, message: "Email already registered" });

  const newUser = { id: users.length + 1, name, email, password };
  users.push(newUser);

  res.status(201).json({
    success: true,
    message: "Signup successful",
    user: { id: newUser.id, name, email },
  });
});

// Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user)
    return res.status(401).json({ success: false, message: "Invalid credentials" });

  // mock token
  const token = "mock-jwt-token-" + user.id;
  res.json({
    success: true,
    message: "Login successful",
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// Get current user
app.get("/api/auth/me", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

  const userId = token.split("-").pop();
  const user = users.find((u) => u.id == userId);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
});

// ---------------- MOOD ROUTES ----------------
app.get("/api/moods", (req, res) => res.json(moods));

app.post("/api/moods", (req, res) => {
  const { mood, date } = req.body;
  if (!mood) return res.status(400).json({ success: false, message: "Mood required" });
  const newMood = { id: moods.length + 1, mood, date: date || new Date().toISOString() };
  moods.push(newMood);
  res.status(201).json(newMood);
});

// ---------------- EVENT ROUTES ----------------
app.get("/api/events", (req, res) => res.json(events));

app.post("/api/events", (req, res) => {
  const { title, startDate, endDate, color, description } = req.body;
  if (!title || !startDate || !endDate)
    return res.status(400).json({ success: false, message: "Missing fields" });

  const newEvent = {
    id: events.length + 1,
    title,
    description,
    startDate,
    endDate,
    color: color || "#4A90E2",
  };
  events.push(newEvent);
  res.status(201).json(newEvent);
});

app.put("/api/events/:id", (req, res) => {
  const event = events.find((e) => e.id == req.params.id);
  if (!event) return res.status(404).json({ success: false, message: "Event not found" });

  Object.assign(event, req.body);
  res.json(event);
});

app.delete("/api/events/:id", (req, res) => {
  const index = events.findIndex((e) => e.id == req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: "Event not found" });
  events.splice(index, 1);
  res.json({ success: true });
});

// ---------------- TASK ROUTES ----------------
app.get("/api/tasks", (req, res) => res.json(tasks));

// ---------------- QUOTES ROUTES ----------------
app.get("/api/quotes/random", (req, res) => {
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  res.json({ quote: random });
});

// ---------------- ADMIN ROUTES ----------------
app.get("/api/admin/users", (req, res) => res.json(users));
app.get("/api/admin/moods", (req, res) => res.json(moods));
app.get("/api/admin/schedules", (req, res) => res.json(events));
app.get("/api/admin/notes", (req, res) => res.json([]));
app.get("/api/admin/tasks", (req, res) => res.json(tasks));
app.get("/api/admin/success-stories", (req, res) => res.json(successStories));

app.put("/api/admin/success-stories/feature/:id", (req, res) => {
  const story = successStories.find((s) => s.id == req.params.id);
  if (!story) return res.status(404).json({ success: false, message: "Story not found" });
  story.featured = !story.featured;
  res.json(story);
});

app.get("/api/admin/success-stories/analytics/stats", (req, res) => {
  res.json({
    totalStories: successStories.length,
    featured: successStories.filter((s) => s.featured).length,
  });
});

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
=======
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
const User = require("./models/User.js"); // For streak logic

// ------------------------------------------------
// APP + SERVER + SOCKET.IO
// ------------------------------------------------
const contactRoutes = require("./routes/contactRoute.js"); // Import new contact route
const { sendMessageToBackend } = require("./ChatService.js");
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  },
});

// ------------------------------------------------
// 🔐 JWT verification for sockets
// ------------------------------------------------
const verifyJwt = async (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid token");
  }
};

// ------------------------------------------------
// 🔌 SOCKET.IO EVENTS
// ------------------------------------------------
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

  // Join personal room (userId) - ensure it's a string
  const userRoom = String(socket.user.id);
  socket.join(userRoom);
  connectedUsers.set(userRoom, socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
    connectedUsers.delete(userRoom);
  });
});

// Make io accessible to routes/controllers
app.set("io", io);

// ------------------------------------------------
// 🧩 MIDDLEWARE
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
// 🔥 USER STREAK LOGIC
// ------------------------------------------------
app.post("/api/user/:id/update-streak", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const today = new Date();
    const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;

    if (lastLogin) {
      const diffInDays = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));

      if (diffInDays === 1) {
        // User logged in the next day → increment streak
        user.streak += 1;
      } else if (diffInDays > 1) {
        // Missed at least one day → reset streak
        user.streak = 1;
      }
      // If diffInDays === 0 → same day login, no change
    } else {
      user.streak = 1;
    }

    user.lastLoginDate = today;
    await user.save();

    res.status(200).json({
      msg: "Streak updated successfully",
      streak: user.streak,
      lastLoginDate: user.lastLoginDate,
    });
  } catch (err) {
    console.error("Error updating streak:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

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

// ------------------------------
// ✅ ROUTES
// ------------------------------
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
app.use("/api/contact", contactRoutes); // Use new contact route
app.use("/api/tasks", tasksRouter);
app.use("/api/admin/tasks", adminTaskRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/collaborate", collaborateRoutes);
app.use("/api/medicines", medicineRoutes);

// ------------------------------------------------
// 📦 DATABASE CONNECTION
// ------------------------------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ------------------------------------------------
// 🖥️ SERVER START
// ------------------------------------------------
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
>>>>>>> 9fa60023cfa3d37852d15b1adc926ad1b6d07103
