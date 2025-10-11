import React from "react";
import "../../styles/TaskTable.css"; // import the CSS file

const TaskTable = ({ tasks = [], onDelete, onUpdate }) => {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return <p className="no-tasks">No tasks found.</p>;
  }

  return (
    <table className="task-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Title</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task._id}>
            <td>{task.user?.name || "N/A"}</td>
            <td>{task.title}</td>
            <td>{new Date(task.dueDate).toLocaleDateString()}</td>
            <td className="status">{task.status}</td>
            <td className="actions">
              <button
                className="complete-btn"
                onClick={() => onUpdate(task._id, { status: "completed" })}
              >
                Complete
              </button>
              <button
                className="delete-btn"
                onClick={() => onDelete(task._id)}
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
