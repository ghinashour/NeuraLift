import React from "react";

const TaskTable = ({ tasks = [], onDelete, onUpdate }) => {
  // ✅ Default value for tasks = []
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return <p>No tasks found.</p>;
  }

  return (
    <table className="min-w-full border border-gray-300 text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">User</th>
          <th className="p-2 border">Title</th>
          <th className="p-2 border">Due Date</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task._id} className="text-center">
            <td className="border p-2">{task.user?.name || "N/A"}</td>
            <td className="border p-2">{task.title}</td>
            <td className="border p-2">
              {new Date(task.dueDate).toLocaleDateString()}
            </td>
            <td className="border p-2 capitalize">{task.status}</td>
            <td className="border p-2 flex gap-2 justify-center">
              <button
                onClick={() => onUpdate(task._id, { status: "completed" })}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                Complete
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TaskTable;
