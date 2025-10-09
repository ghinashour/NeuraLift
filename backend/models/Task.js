const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "completed", "overdue"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});
taskSchema.index({ createdAt: -1 });
taskSchema.index({ completed: 1, createdAt: -1 });

module.exports = mongoose.model("Task", taskSchema);
