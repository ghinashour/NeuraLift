// src/components/collaborate/AssignTaskForm.js
import React, { useState } from "react";
import "../../styles/Collaborate.css";
import {useTasks} from "../../hooks/useTasks";

export default function AssignTaskForm({ onClose }) {
  const { addTask } = useTasks();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [assignee, setAssignee] = useState("");

  const submit = (e) => {
    e.preventDefault();
    addTask({
      id: "t-" + Date.now(),
      name,
      description: desc,
      assignedTo: assignee || "Unassigned",
      date: new Date().toISOString(),
      status: "todo",
      avatar: "/avatar.png",
      attachments: [],
    });
    onClose?.();
  };

  return (
    <div className="assign-task">
      <h2>Assign new task</h2>
      <p>Create and assign a task to your group members</p>
      <form onSubmit={submit}>
        <label>Task name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Task description</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />

        <label>Assign to (member email/name)</label>
        <input value={assignee} onChange={(e) => setAssignee(e.target.value)} />

        <label>Attachments</label>
        <div className="attachment-row">
          <input type="file" disabled />
          <small>File upload is mocked (enable backend to store files)</small>
        </div>

        <div className="popup-actions">
          <button type="submit" className="primary">Submit task</button>
        </div>
      </form>
    </div>
  );
}