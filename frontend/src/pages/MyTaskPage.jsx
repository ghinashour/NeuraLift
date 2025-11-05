// src/pages/MyTaskPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/MyTaskPage.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

export default function MyTaskPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/collaborate/tasks/my-tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(response.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const groupTasks = () => {
    const now = new Date();
    const grouped = { Today: [], Yesterday: [], "Last Month": [], Older: [] };

    tasks.forEach((task) => {
      const taskDate = new Date(task.createdAt);
      const diffHours = (now - taskDate) / (1000 * 60 * 60);
      
      if (diffHours < 24) grouped.Today.push(task);
      else if (diffHours < 48) grouped.Yesterday.push(task);
      else if (diffHours < 24 * 30) grouped["Last Month"].push(task);
      else grouped.Older.push(task);
    });

    return grouped;
  };

  const groupedTasks = groupTasks();

  const getDateLabel = (date) => {
    const taskDate = new Date(date);
    const diffDays = Math.floor((new Date() - taskDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1d";
    if (diffDays < 7) return `${diffDays}d`;
    if (diffDays < 30) return "A week ago";
    return taskDate.toLocaleDateString("en-GB").slice(0, 8);
  };

  if (loading) {
    return (
      <div className="mytask-page">
        <div className="mytask-container">
          <div className="loading-spinner">Loading tasks...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mytask-page">
        <div className="mytask-container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mytask-page">
      <div className="mytask-container">
        <header className="mytask-header">
          <h1>My Tasks</h1>
          <p>Here are the tasks assigned to you recently</p>
        </header>

        {tasks.length === 0 ? (
          <div className="no-tasks">
            <p>No tasks assigned to you yet.</p>
          </div>
        ) : (
          Object.entries(groupedTasks).map(([section, sectionTasks]) =>
            sectionTasks.length > 0 ? (
              <div key={section} className="task-section">
                <h2>{section}</h2>
                <div className="task-list">
                  {sectionTasks.map((task) => (
                    <div
                      key={task._id}
                      className="task-card"
                      onClick={() => navigate(`/mytasks/${task._id}`)}
                    >
                      <div className="task-avatar">
                        {task.assignedBy?.avatar ? (
                          <img src={task.assignedBy.avatar} alt={task.assignedBy.name} />
                        ) : (
                          <span>{task.assignedBy?.name?.charAt(0) || 'U'}</span>
                        )}
                      </div>
                      <div className="task-info">
                        <p className="task-admin">
                          {task.assignedBy?.name || 'Unknown User'} assigned you a task
                        </p>
                        <p className="task-title">{task.title}</p>
                        {task.group && (
                          <p className="task-group">Group: {task.group.name}</p>
                        )}
                        {task.priority && (
                          <span className={`task-priority ${task.priority}`}>
                            {task.priority}
                          </span>
                        )}
                      </div>
                      <span className="task-date">{getDateLabel(task.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )
        )}
      </div>
    </div>
  );
}