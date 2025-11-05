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
