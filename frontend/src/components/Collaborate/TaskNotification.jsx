// src/components/collaborate/TaskNotification.js
import React from "react";
import "../../styles/MyTasks.css";

/**
 * Small notification styled card for tasks.
 * Clicking could navigate to TaskDetails (implementation depends on your router).
 */
export default function TaskNotification({ task }) {
  return (
    <div className="task-notification">
      <img className="avatar small" src={task.avatar || "/avatar.png"} alt="avatar" />
      <div className="notif-content">
        <div className="notif-title">{task.name}</div>
        <div className="notif-desc">{task.description}</div>
      </div>
      <div className="notif-meta">{new Date(task.date).toLocaleDateString()}</div>
    </div>
  );
}