// backend/models/Note.js
const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
    mood: { type: String, enum: ["stressed", "neutral", "calm"], default: "neutral" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
