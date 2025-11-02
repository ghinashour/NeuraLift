// src/pages/TaskDetails.js
import React from "react";
import "../styles/TaskDetails.css";
import { useParams } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";

export default function TaskDetails() {
  const { id } = useParams();
  const { getTaskById, updateTaskStatus } = useTasks();
  const task = getTaskById(id);

  if (!task) return <div className="task-details">Task not found</div>;

  return (
    <div className="task-details">
      <header className="task-header">
        <div className="task-title">
          <img src={task.avatar} alt="avatar" className="task-avatar" />
          <div>
            <h2>{task.name}</h2>
            <p className="task-meta">{task.assignedTo || "Unassigned"}</p>
          </div>
        </div>

        <div className="task-actions">
          <button onClick={() => updateTaskStatus(id, "todo")}>To-Do</button>
          <button onClick={() => updateTaskStatus(id, "inprogress")}>In-progress</button>
          <button onClick={() => updateTaskStatus(id, "done")}>Done</button>
        </div>
      </header>

      <section className="task-body">
        <h3>Description</h3>
        <p>{task.description}</p>

        {task.attachments && task.attachments.length > 0 && (
          <>
            <h4>Attachments</h4>
            <ul>
              {task.attachments.map((a, idx) => (
                <li key={idx}>{a.name}</li>
              ))}
            </ul>
          </>
        )}

        <div className="task-start">
          <button className="start-task-btn">Start task</button>
        </div>
      </section>
    </div>
  );
}