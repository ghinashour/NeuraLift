const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const profileRoutes = require("./routes/profile.js");
const questionRoutes = require("./routes/questions.js");
const devQuestionRoutes = require("./routes/DevQuestionRoute.js");
const assemblyGameRoutes = require('./routes/assemblyGame');
const tensizesRoutes = require("./routes/tenziesRoutes");
const eventRoutes = require("./routes/eventRoutes.js");
const authRoutes = require('./routes/authRoute');
const adminRoutes = require('./routes/admin.js');
const successStoryRoutes = require("./routes/successStories");
const quoteRoutes = require("./routes/quotes.js");
const moodRoutes = require("./routes/moodroutes.js");
const tasksRouter = require("./routes/tasks.js");
const noteRoute = require("./routes/noteUserRoute.js");
const adminTaskRouter = require("./routes/admin/taskRoutes.js");
const Notifications = require("./routes/Notification.js");
const chatRoutes = require("./routes/chatRoutes.js");
const User = require("./models/User.js"); 
const passport = require("passport");
require("./config/passport");
require("dotenv").config();

const app = express();
app.use(express.json());
// Middleware
app.use(cors({
  origin: "http://localhost:3000", // allow frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
//streak logic of the user
app.post("/api/user/:id/update-streak", async (req, res) => {
   const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }
  const user = await User.findById(req.params.id);
  const today = new Date();
  today.setHours(0,0,0,0);

  let lastActive = user.streak.lastActiveDate ? new Date(user.streak.lastActiveDate) : null;
  if (lastActive) lastActive.setHours(0,0,0,0);

  if (!lastActive || lastActive < today - 1*24*60*60*1000) {
    // Missed a day → reset streak
    user.streak.current = 1;
  } else if (lastActive.getTime() === today - 1*24*60*60*1000) {
    // Consecutive day → increment streak
    user.streak.current += 1;
  }

  user.streak.lastActiveDate = today;
  await user.save();

  res.json({ streak: user.streak.current });
});

// Routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
//fetching the challenges
app.use("/api/questions", questionRoutes);
app.use("/api/devquestions", devQuestionRoutes);
app.use('/api/assembly-game', assemblyGameRoutes);
app.use("/api/tenzies", tensizesRoutes);
app.use("/api/success-stories", successStoryRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/quotes", quoteRoutes);
app.use('/api/moods', moodRoutes);
app.use("/api/notes", noteRoute);
app.use("/api/notifications" , Notifications);
app.use('/api/chat', chatRoutes);
//protected admin routes
app.use("/api/admin", adminRoutes);
app.use("/api/tasks", tasksRouter); // user task routes
app.use("/api/admin/tasks", adminTaskRouter); // admin task routes
//server uploaded files
app.use('/uploads', express.static('uploads'));
app.use(passport.initialize());
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
