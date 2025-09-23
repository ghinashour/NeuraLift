const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const profileRoutes = require("./routes/profile.js");
require("dotenv").config();
const express = require("express");
const path = require("path");

const authRoutes = require("./routes/authRoute");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

//server uploaded files
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
