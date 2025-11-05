// src/components/RightChatCollab.jsx
import React, { useState } from "react";

/**
 * RightChatCollab:
 * - shows selected group tasks in vertical list (click to view / change)
 * - when a task selected, shows its details, assigned members, attachments, and status dropdown
 */
export default function RightChatCollab({ group, onChangeTaskStatus }) {
  const [selectedTaskId, setSelectedTaskId] = useState(group?.tasks?.[0]?.id || null);
  const currentUser = { id: "current-user", name: "You" };

  if (!group) {
    return <aside className="rcc-right-chat rcc-empty">Select a group</aside>;
  }

  const selectTask = (id) => {
    setSelectedTaskId(id);
  };

  const task = group.tasks.find((t) => t.id === selectedTaskId) || group.tasks[0];

  const handleStatus = (s) => {
    if (!task) return;
    onChangeTaskStatus(task.id, s, currentUser);
  };

  return (
    <aside className="rcc-right-chat">
      <h3 className="rcc-right-title">Task Details</h3>

      <div className="task-list-vertical">
        {group.tasks.map((t) => (
          <div
            key={t.id}
            className={`task-vertical-card ${t.id === selectedTaskId ? "active" : ""}`}
            onClick={() => selectTask(t.id)}
          >
            <div className="tv-title">{t.title}</div>
            <div className="tv-desc">{t.description}</div>
            <div className="tv-meta">
              <span className="tv-status">{t.status}</span>
              <span className="tv-count">{t.attachments?.length || 0} attachments</span>
            </div>
          </div>
        ))}
      </div>

      {task && (
        <div className="task-details">
          <h4>{task.title}</h4>
          <p className="tdesc">{task.description}</p>

          <div className="assigned">
            <strong>Assigned To:</strong>
            <div className="assigned-avatars">
              {group.members.map((m) => (
                <div key={m.id} className="avatar-small">{m.avatar ? <img src={m.avatar} alt={m.name} /> : <span>{m.name[0]}</span>}</div>
              ))}
            </div>
          </div>

          <div className="attachments">
            <strong>Attachments</strong>
            <div className="att-list">
              {task.attachments.length === 0 && <div className="muted">No attachments</div>}
              {task.attachments.map((a) => (
                <div key={a.id} className="att-item">{a.name}</div>
              ))}
            </div>
          </div>

          <div className="status-control">
            <strong>Status</strong>
            <div className="status-buttons">
              <button className={`st-btn ${task.status === "To-Do" ? "active" : ""}`} onClick={() => handleStatus("To-Do")}>To-Do</button>
              <button className={`st-btn ${task.status === "In Progress" ? "active" : ""}`} onClick={() => handleStatus("In Progress")}>In Progress</button>
              <button className={`st-btn ${task.status === "Done" ? "active" : ""}`} onClick={() => handleStatus("Done")}>Done</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}