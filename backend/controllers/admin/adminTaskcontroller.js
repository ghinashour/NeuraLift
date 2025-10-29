// backend/controllers/admin/adminTaskController.js
const Task = require("../../models/Task");
const CollaborationTask = require("../../models/CollaborationTask");

exports.getAllTasksAdmin = async (req, res) => {
  try {
    // Fetch all personal tasks
    const selfTasks = await Task.find({})
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 })
      .lean();

    // Fetch all collaboration tasks
    const collabTasks = await CollaborationTask.find({})
      .populate("assignedBy", "name email avatar")
      .populate("assignedTo", "name email avatar")
      .populate("group", "name")
      .sort({ createdAt: -1 })
      .lean();

    // Merge and label each task
    const allTasks = [
      ...selfTasks.map((t) => ({
        _id: t._id,
        title: t.title || "(Untitled Task)",
        description: t.description || "",
        dueDate: t.dueDate || null,
        status: t.status || "Pending",
        priority: t.priority || "Normal",
        createdAt: t.createdAt,
        user: t.user || null,
        type: "personal",
      })),
      ...collabTasks.map((t) => ({
        _id: t._id,
        title: t.title || "(Untitled Task)",
        description: t.description || "",
        dueDate: t.dueDate || null,
        status: t.status || "Pending",
        priority: t.priority || "Normal",
        createdAt: t.createdAt,
        assignedBy: t.assignedBy || null,
        assignedTo: t.assignedTo || null,
        group: t.group || null,
        type: "collaboration",
      })),
    ];

    if (allTasks.length === 0) {
      return res.status(200).json({ message: "No tasks found", tasks: [] });
    }

    res.status(200).json({ tasks: allTasks });
  } catch (err) {
    console.error("Admin getAllTasks error:", err);
    res.status(500).json({ message: "Error fetching all tasks" });
  }
};
