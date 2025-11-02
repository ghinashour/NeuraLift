const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
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
const Notifications = require("./routes/Notification.js");
const chatRoutes = require("./routes/chatRoutes.js");
const contactRoutes = require("./routes/contactRoute.js"); // Import new contact route
const User = require("./models/User.js"); // <-- used for streak logic
const { sendMessageToBackend } = require("./ChatService.js");
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // Allow your frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(passport.initialize());

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------------------
// ✅ USER STREAK LOGIC
// ------------------------------
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
      // First login
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
app.use("/api/notifications", Notifications);
app.use("/api/chat", chatRoutes);
app.use("/api/contact", contactRoutes); // Use new contact route
app.use("/api/tasks", tasksRouter);
app.use("/api/admin/tasks", adminTaskRouter);
app.use("/api/admin", adminRoutes);
app.use('/api/collaborate', require('./routes/collaborate')); // Collaborate routes

// ------------------------------
// ✅ MONGO CONNECTION
// ------------------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ------------------------------
// ✅ START SERVER
// ------------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));