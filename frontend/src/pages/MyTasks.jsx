// src/pages/MyTasks.js
import React from "react";
import "../styles/MyTasks.css";
import {useTasks} from "../hooks/useTasks";
import TaskNotification from "../components/Collaborate/TaskNotification";

export default function MyTasks() {
  const { tasks } = useTasks();

  return (
    <div className="mytasks-page">
      <header className="mytasks-header">
        <h1>My Tasks</h1>
        <p>View, track, and update your tasks across To-Do, In-progress and Done</p>
      </header>

      <main className="mytasks-main">
        {tasks.length === 0 ? (
          <div className="empty">No tasks assigned yet.</div>
        ) : (
          <div className="notifications">
            {tasks.map((t) => (
              <TaskNotification key={t.id} task={t} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}