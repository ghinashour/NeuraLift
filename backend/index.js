const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const profileRoutes = require("./routes/profile.js");
const path = require("path");
const verifyEmailRoute = require("./routes/verifyEmail.js");
const questionRoutes = require("./routes/questions.js");
const devQuestionRoutes = require("./routes/DevQuestionRoute.js");
const assemblyGameRoutes = require('./routes/assemblyGame');
const tensizesRoutes = require("./routes/tenziesRoutes");
const eventRoutes = require("./routes/eventRoutes.js");
const authRoutes = require('./routes/authRoute');
const adminRoutes = require('./routes/admin.js');
const successStoryRoutes = require("./routes/successStories");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // allow frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());

// Routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/auth", verifyEmailRoute);
//fetching the challenges
app.use("/api/questions", questionRoutes);
app.use("/api/devquestions", devQuestionRoutes);
app.use('/api/assembly-game', assemblyGameRoutes);
app.use("/api/tenzies", tensizesRoutes);
app.use("/api/success-stories", successStoryRoutes);
app.use("/api/events", eventRoutes);

//protected admin routes
app.use("/api/admin", adminRoutes)
//server uploaded files
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
