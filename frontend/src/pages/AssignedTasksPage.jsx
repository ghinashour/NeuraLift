// src/pages/AssignedTasksPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AssignedTasksPage.css";
import EditTaskPopup from "../components/Popups/EditTaskPopup";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

export default function AssignedTasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchAssignedTasks();
  }, []);

  const fetchAssignedTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/collaborate/assigned-tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching assigned tasks:", err);
      setError("Failed to load assigned tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/collaborate/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTasks(prev => prev.filter(task => task._id !== taskId));
      alert("Task deleted successfully");
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task");
    }
  };

  const handleEditTask = async (taskData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/collaborate/tasks/${editingTask._id}`,
        taskData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(prev => prev.map(task => 
        task._id === editingTask._id ? response.data : task
      ));
      setEditingTask(null);
      alert("Task updated successfully");
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: "status-pending", text: "Pending" },
      in_progress: { class: "status-in-progress", text: "In Progress" },
      completed: { class: "status-completed", text: "Completed" }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const getPriorityBadge = (priority) => {
    return <span className={`priority-badge priority-${priority}`}>{priority}</span>;
  };

  if (loading) {
    return (
      <div className="assigned-tasks-page">
        <div className="loading-spinner">Loading your assigned tasks...</div>
      </div>
    );
  }

  return (
    <div className="assigned-tasks-page">
      <div className="assigned-tasks-container">
        <header className="assigned-tasks-header">
          <h1>Tasks You Assigned</h1>
          <p>Manage tasks you've assigned to others</p>
        </header>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={fetchAssignedTasks} className="retry-btn">
              Retry
            </button>
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="no-tasks">
            <p>You haven't assigned any tasks yet.</p>
            <button 
              onClick={() => navigate("/collaborate")}
              className="btn btn-primary"
            >
              Assign Your First Task
            </button>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <div key={task._id} className="task-card">
                <div className="task-header">
                  <h3 className="task-title">{task.title}</h3>
                  <div 
                    className="task-actions"
                    style={{
                      display: 'flex',
                      gap: '10px',
                      flexShrink: 0,
                      marginLeft: 'auto',
                      visibility: 'visible',
                      opacity: 1
                    }}
                  >
                    <button 
                      className="btn-edit"
                      onClick={() => setEditingTask(task)}
                      style={{
                        display: 'inline-block',
                        visibility: 'visible',
                        opacity: 1,
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                        color: '#1e40af',
                        border: '1px solid #bfdbfe',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteTask(task._id)}
                      style={{
                        display: 'inline-block',
                        visibility: 'visible',
                        opacity: 1,
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="task-body">
                  <p className="task-description">{task.description}</p>
                  
                  <div className="task-meta">
                    <div className="meta-item">
                      <strong>Assigned to:</strong>
                      <div className="assignee-info">
                        {task.assignedTo?.avatar && (
                          <img src={task.assignedTo.avatar} alt={task.assignedTo.name} />
                        )}
                        <span>{task.assignedTo?.name || 'Unknown User'}</span>
                      </div>
                    </div>
                    
                    {task.group && (
                      <div className="meta-item">
                        <strong>Group:</strong>
                        <span>{task.group.name}</span>
                      </div>
                    )}
                    
                    <div className="meta-item">
                      <strong>Due Date:</strong>
                      <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}</span>
                    </div>
                  </div>

                  <div className="task-tags">
                    {getPriorityBadge(task.priority)}
                    {getStatusBadge(task.status)}
                  </div>
                </div>

                <div className="task-footer">
                  <span className="task-date">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Task Modal */}
        {editingTask && (
          <EditTaskPopup
            task={editingTask}
            onClose={() => setEditingTask(null)}
            onSubmit={handleEditTask}
          />
        )}
      </div>
    </div>
  );
}