// src/pages/MyTaskDetails.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/MyTaskDetails.css";

const MOCK_TASKS = [
  {
    id: "1",
    title: "Creating the basics of UI",
    admin: "Ghinaa Shour",
    avatar: null,
    date: "2025-10-08T09:30:00Z",
    description:
      "You should be able to: create the navbar containing the (home, features, success stories, contact) links to the sections of the page. Add consistent styling, smooth scrolling, and a responsive design for mobile screens. Also include accessible markup and keyboard navigation.",
    attachments: [
      { id: 1, type: "image", name: "UI-Mockup-1.png" },
      { id: 2, type: "image", name: "UI-Mockup-2.png" },
      { id: 3, type: "file", name: "Assets.zip" },
    ],
    status: "To-Do",
  },
  {
    id: "2",
    title: "Hassan-points-Research",
    admin: "Ghina Shour",
    avatar: null,
    date: "2025-09-02T11:00:00Z",
    description:
      "Research required for points allocation algorithm. Collect data, run sample experiments, and prepare report.",
    attachments: [],
    status: "In Progress",
  },
];

function formatDateShort(dateString) {
  const d = new Date(dateString);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

export default function MyTaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState("To-Do");

  useEffect(() => {
    const found = MOCK_TASKS.find((t) => t.id === id) || MOCK_TASKS[0];
    setTask(found);
    setStatus(found.status || "To-Do");
  }, [id]);

  if (!task) {
    return null;
  }

  const initials = task.admin
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="td-page">
      <div className="td-container">
        <div className="td-header">
          <div className="td-header-left">
            <h1 className="td-title">{task.title}</h1>
            <div className="td-meta">
              <span className="td-status-label">Status: <strong>{status}</strong></span>
              <span className="td-date">Assigned: {formatDateShort(task.date)}</span>
            </div>
          </div>

          <div className="td-header-right">
            <button className="td-back" onClick={() => navigate("/my-tasks")}>← Back to My Tasks</button>
            <div className="td-avatar" title={task.admin}>
              {task.avatar ? <img src={task.avatar} alt={task.admin} /> : <span>{initials}</span>}
            </div>
          </div>
        </div>

        <div className="td-status-row">
          <button
            className={`td-btn ${status === "To-Do" ? "active todo" : ""}`}
            onClick={() => setStatus("To-Do")}
          >
            To-Do
          </button>
          <button
            className={`td-btn ${status === "In Progress" ? "active inprogress" : ""}`}
            onClick={() => setStatus("In Progress")}
          >
            In Progress
          </button>
          <button
            className={`td-btn ${status === "Done" ? "active done" : ""}`}
            onClick={() => setStatus("Done")}
          >
            Done
          </button>
        </div>

        <div className="td-section">
          <h3 className="td-section-title">Description:</h3>
          <div className="td-description">
            <p>
              {expanded ? task.description : task.description.slice(0, 220) + (task.description.length > 220 ? "…" : "")}
            </p>
            {!expanded && task.description.length > 220 && (
              <button className="td-readmore" onClick={() => setExpanded(true)}>Read more</button>
            )}
          </div>
        </div>

        <div className="td-section">
          <h3 className="td-section-title">Attachments:</h3>
          <div className="td-attachments">
            {task.attachments.length === 0 && <div className="td-no-attachments">No attachments</div>}
            {task.attachments.map((att) => (
              <div key={att.id} className="td-attachment">
                {att.type === "image" ? (
                  <div className="td-attachment-thumb image">
                    <img src="https://img.icons8.com/fluency/96/image.png" alt={att.name} />
                  </div>
                ) : (
                  <div className="td-attachment-thumb file">
                    <img src="https://img.icons8.com/fluency/96/folder-invoices.png" alt={att.name} />
                  </div>
                )}
                <div className="td-attachment-name">{att.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="td-actions">
          <button className="td-start-btn" onClick={() => navigate("/ChattingCollab")}>Start with tasks</button>
        </div>
      </div>
    </div>
  );
}