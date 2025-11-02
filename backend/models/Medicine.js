// backend/models/Medicine.js
const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Medicine name is required"],
  },
  capsule: {
    type: String,
  },
  time: {
    type: Date, // store as Date
    required: [true, "Time is required"],
  },
  repeat: {
    type: String,
  },
  isTaken: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("Medicine", medicineSchema);
