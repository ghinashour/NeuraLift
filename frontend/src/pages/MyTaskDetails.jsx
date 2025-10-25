// src/pages/MyTaskDetails.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/MyTaskDetails.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

export default function MyTaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/collaborate/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTask(response.data);
      setStatus(response.data.status || "pending");
    } catch (err) {
      console.error("Error fetching task details:", err);
      setError("Failed to load task details");
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/collaborate/tasks/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setTask(response.data);
      setStatus(newStatus);
      alert("Task status updated successfully");
    } catch (err) {
      console.error("Error updating task status:", err);
      alert("Failed to update task status");
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    updateTaskStatus(newStatus);
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return 'Not set';
    const d = new Date(dateString);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
  };

  const formatDateLong = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="td-page">
        <div className="td-container">
          <div className="loading-spinner">Loading task details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="td-page">
        <div className="td-container">
          <div className="error-message">
            {error}
            <button onClick={fetchTaskDetails} className="retry-btn">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="td-page">
        <div className="td-container">
          <div className="error-message">
            Task not found
            <button onClick={() => navigate("/my-tasks")} className="retry-btn">
              Back to My Tasks
            </button>
          </div>
        </div>
      </div>
    );
  }

  const initials = task.assignedBy?.name
    ? task.assignedBy.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "UU";

  const getStatusDisplayText = (status) => {
    const statusMap = {
      pending: "To-Do",
      in_progress: "In Progress",
      completed: "Done"
    };
    return statusMap[status] || status;
  };

  return (
    <div className="td-page">
      <div className="td-container">
        <div className="td-header">
          <div className="td-header-left">
            <h1 className="td-title">{task.title}</h1>
            <div className="td-meta">
              <span className="td-status-label">
                Status: <strong>{getStatusDisplayText(status)}</strong>
              </span>
              <span className="td-date">
                Assigned: {formatDateLong(task.createdAt)}
              </span>
              {task.dueDate && (
                <span className="td-due-date">
                  Due: {formatDateLong(task.dueDate)}
                </span>
              )}
            </div>
          </div>

          <div className="td-header-right">
            <button className="td-back" onClick={() => navigate("/my-tasks")}>
              ← Back to My Tasks
            </button>
            <div className="td-avatar" title={task.assignedBy?.name || "Unknown User"}>
              {task.assignedBy?.avatar ? (
                <img src={task.assignedBy.avatar} alt={task.assignedBy.name} />
              ) : (
                <span>{initials}</span>
              )}
            </div>
          </div>
        </div>

        <div className="td-status-row">
          <button
            className={`td-btn ${status === "pending" ? "active todo" : ""}`}
            onClick={() => handleStatusChange("pending")}
          >
            To-Do
          </button>
          <button
            className={`td-btn ${status === "in_progress" ? "active inprogress" : ""}`}
            onClick={() => handleStatusChange("in_progress")}
          >
            In Progress
          </button>
          <button
            className={`td-btn ${status === "completed" ? "active done" : ""}`}
            onClick={() => handleStatusChange("completed")}
          >
            Done
          </button>
        </div>

        <div className="td-section">
          <h3 className="td-section-title">Description:</h3>
          <div className="td-description">
            <p>
              {expanded 
                ? task.description 
                : task.description?.slice(0, 220) + (task.description?.length > 220 ? "…" : "")
              }
            </p>
            {!expanded && task.description?.length > 220 && (
              <button className="td-readmore" onClick={() => setExpanded(true)}>
                Read more
              </button>
            )}
          </div>
        </div>

        <div className="td-section">
          <h3 className="td-section-title">Task Details:</h3>
          <div className="td-task-details">
            <div className="td-detail-item">
              <strong>Assigned by:</strong>
              <span>{task.assignedBy?.name || "Unknown User"}</span>
            </div>
            {task.group && (
              <div className="td-detail-item">
                <strong>Group:</strong>
                <span>{task.group.name}</span>
              </div>
            )}
            <div className="td-detail-item">
              <strong>Priority:</strong>
              <span className={`td-priority td-priority-${task.priority}`}>
                {task.priority}
              </span>
            </div>
            <div className="td-detail-item">
              <strong>Due Date:</strong>
              <span>{task.dueDate ? formatDateLong(task.dueDate) : "Not set"}</span>
            </div>
            <div className="td-detail-item">
              <strong>Created:</strong>
              <span>{formatDateLong(task.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* You can add attachments section when you implement file uploads */}
        <div className="td-section">
          <h3 className="td-section-title">Attachments:</h3>
          <div className="td-attachments">
            <div className="td-no-attachments">
              No attachments available
              {/* Add file upload functionality here later */}
            </div>
          </div>
        </div>

        <div className="td-actions">
          <button 
            className="td-start-btn" 
            onClick={() => navigate("/ChattingCollab")}
          >
            Start with tasks
          </button>
          <button 
            className="td-chat-btn"
            onClick={() => navigate("/ChattingCollab", { 
              state: { 
                taskId: task._id,
                taskTitle: task.title,
                assignedBy: task.assignedBy?.name 
              } 
            })}
          >
            Discuss Task
          </button>
        </div>
      </div>
    </div>
  );
}