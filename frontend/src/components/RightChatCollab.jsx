// src/components/RightChatCollab.jsx
import React, { useState } from "react";
import "../styles/RightChatCollab.css";

const RightChatCollab = ({
  group = null,
  tasks = [],
  onChangeTaskStatus,
  currentTask = null,
  loading = false,
  onNewTask = null, // New prop for task creation
  onFilterTasks = null // New prop for filtering
}) => {
  const [activeTab, setActiveTab] = useState("tasks");
  const [expandedTask, setExpandedTask] = useState(null);
  const [filterType, setFilterType] = useState("all"); // "all", "today", "week", "overdue"
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Safe task filtering with null checks
  const getTasksByStatus = (status) => {
    if (!tasks || !Array.isArray(tasks)) return [];
    
    let filteredTasks = tasks.filter(task => task && task.status === status);
    
    // Apply date filters
    filteredTasks = filteredTasks.filter(task => {
      if (!task.dueDate) return filterType === "all" || filterType === "no-date";
      
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 7);

      switch (filterType) {
        case "today":
          return dueDate >= startOfToday && dueDate < endOfToday;
        case "week":
          return dueDate >= startOfWeek && dueDate < endOfWeek;
        case "overdue":
          return dueDate < startOfToday && task.status !== 'completed';
        case "no-date":
          return !task.dueDate;
        case "all":
        default:
          return true;
      }
    });

    return filteredTasks;
  };

  const todoTasks = getTasksByStatus("pending");
  const inProgressTasks = getTasksByStatus("in_progress");
  const doneTasks = getTasksByStatus("completed");

  const handleStatusChange = (taskId, newStatus, taskTitle) => {
    if (onChangeTaskStatus) {
      onChangeTaskStatus(taskId, newStatus, taskTitle);
    }
  };

  const handleNewTask = () => {
    if (onNewTask && group) {
      onNewTask(group._id);
    } else {
      alert("Please select a group first to create a task");
    }
  };

  const handleFilterChange = (newFilterType) => {
    setFilterType(newFilterType);
    setShowFilterDropdown(false);
    
    // Call parent filter handler if provided
    if (onFilterTasks) {
      onFilterTasks(newFilterType);
    }
  };

  const toggleTaskExpand = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const getProgressPercentage = () => {
    const total = tasks.length;
    if (total === 0) return 0;
    const completed = doneTasks.length;
    return Math.round((completed / total) * 100);
  };

  const getFilterDisplayText = () => {
    switch (filterType) {
      case "today":
        return "Today";
      case "week":
        return "This Week";
      case "overdue":
        return "Overdue";
      case "no-date":
        return "No Date";
      case "all":
      default:
        return "All Tasks";
    }
  };

  const getTaskCountByFilter = () => {
    const total = todoTasks.length + inProgressTasks.length + doneTasks.length;
    return total;
  };

  if (loading) {
    return (
      <div className="right-chat">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading task details...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="right-chat">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No Group Selected</h3>
          <p>Select a group from the sidebar to view tasks and details</p>
        </div>
      </div>
    );
  }

  // Check if user is a member of the group
  const isMember = group.members && Array.isArray(group.members) && group.members.length > 0;

  if (!isMember) {
    return (
      <div className="right-chat">
        <div className="empty-state">
          <div className="empty-icon">🔒</div>
          <h3>Not a Member</h3>
          <p>You need to be a member of this group to view tasks</p>
          <button className="join-btn">
            Request to Join
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="right-chat">
      {/* Group Info Header */}
      <div className="group-header">
        <div className="group-avatar-large">
          {group.name ? group.name.charAt(0).toUpperCase() : 'G'}
        </div>
        <div className="group-info">
          <h3>{group.name || "Group Tasks"}</h3>
          <p className="group-description">
            {group.description || "Task management for this group"}
          </p>
        </div>
        
        {/* Progress Overview */}
        <div className="progress-overview">
          <div className="progress-header">
            <span>Group Progress</span>
            <span className="progress-percent">{getProgressPercentage()}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <div className="progress-stats">
            <span>{doneTasks.length} of {tasks.length} tasks completed</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "tasks" ? "active" : ""}`}
          onClick={() => setActiveTab("tasks")}
        >
          <span className="tab-icon">📋</span>
          Tasks
          <span className="tab-badge">{getTaskCountByFilter()}</span>
        </button>
        <button
          className={`tab ${activeTab === "details" ? "active" : ""}`}
          onClick={() => setActiveTab("details")}
        >
          <span className="tab-icon">👥</span>
          Members
          <span className="tab-badge">{group.members?.length || 0}</span>
        </button>
      </div>

      {/* Tasks Tab */}
      {activeTab === "tasks" && (
        <div className="tasks-tab">
          {/* Quick Actions */}
          <div className="quick-actions">
            <button 
              className="action-btn primary" 
              onClick={handleNewTask}
              title="Create new task"
            >
              <span className="action-icon">+</span>
              New Task
            </button>
            
            <div className="filter-container">
              <button 
                className="action-btn filter-btn"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                title="Filter tasks"
              >
                <span className="action-icon">🔍</span>
                {getFilterDisplayText()}
                <span className="dropdown-arrow">▼</span>
              </button>
              
              {showFilterDropdown && (
                <div className="filter-dropdown">
                  <button 
                    className={`filter-option ${filterType === "all" ? "active" : ""}`}
                    onClick={() => handleFilterChange("all")}
                  >
                    All Tasks
                  </button>
                  <button 
                    className={`filter-option ${filterType === "today" ? "active" : ""}`}
                    onClick={() => handleFilterChange("today")}
                  >
                    Today
                  </button>
                  <button 
                    className={`filter-option ${filterType === "week" ? "active" : ""}`}
                    onClick={() => handleFilterChange("week")}
                  >
                    This Week
                  </button>
                  <button 
                    className={`filter-option ${filterType === "overdue" ? "active" : ""}`}
                    onClick={() => handleFilterChange("overdue")}
                  >
                    Overdue
                  </button>
                  <button 
                    className={`filter-option ${filterType === "no-date" ? "active" : ""}`}
                    onClick={() => handleFilterChange("no-date")}
                  >
                    No Due Date
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Filter Indicator */}
          {filterType !== "all" && (
            <div className="filter-indicator">
              <span>Showing: {getFilterDisplayText()}</span>
              <button 
                className="clear-filter"
                onClick={() => handleFilterChange("all")}
              >
                Clear
              </button>
            </div>
          )}

          {getTaskCountByFilter() > 0 ? (
            <div className="tasks-list">
              {/* To Do Tasks */}
              {todoTasks.length > 0 && (
                <div className="task-section">
                  <div className="section-header">
                    <h4 className="section-title todo">
                      <span className="status-dot todo"></span>
                      To Do ({todoTasks.length})
                    </h4>
                  </div>
                  {todoTasks.map(task => (
                    <TaskCard
                      key={task._id || task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      isExpanded={expandedTask === (task._id || task.id)}
                      onToggleExpand={toggleTaskExpand}
                    />
                  ))}
                </div>
              )}

              {/* In Progress Tasks */}
              {inProgressTasks.length > 0 && (
                <div className="task-section">
                  <div className="section-header">
                    <h4 className="section-title in-progress">
                      <span className="status-dot in-progress"></span>
                      In Progress ({inProgressTasks.length})
                    </h4>
                  </div>
                  {inProgressTasks.map(task => (
                    <TaskCard
                      key={task._id || task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      isExpanded={expandedTask === (task._id || task.id)}
                      onToggleExpand={toggleTaskExpand}
                    />
                  ))}
                </div>
              )}

              {/* Done Tasks */}
              {doneTasks.length > 0 && (
                <div className="task-section">
                  <div className="section-header">
                    <h4 className="section-title done">
                      <span className="status-dot done"></span>
                      Done ({doneTasks.length})
                    </h4>
                  </div>
                  {doneTasks.map(task => (
                    <TaskCard
                      key={task._id || task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      isExpanded={expandedTask === (task._id || task.id)}
                      onToggleExpand={toggleTaskExpand}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="empty-tasks">
              <div className="empty-icon">📝</div>
              <h4>No Tasks Found</h4>
              <p>
                {filterType !== "all" 
                  ? `No tasks match the "${getFilterDisplayText()}" filter`
                  : "This group doesn't have any tasks assigned yet"
                }
              </p>
              {filterType !== "all" ? (
                <button 
                  className="create-task-btn"
                  onClick={() => handleFilterChange("all")}
                >
                  Show All Tasks
                </button>
              ) : (
                <button 
                  className="create-task-btn"
                  onClick={handleNewTask}
                >
                  Create First Task
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Members Tab */}
      {activeTab === "details" && (
        <div className="members-tab">
          <div className="members-list">
            {group.members && group.members.map((member, index) => (
              <div key={member._id || index} className="member-item">
                <div className="member-avatar">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} />
                  ) : (
                    <span>{member.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                  )}
                </div>
                <div className="member-info">
                  <div className="member-name">{member.name || 'Unknown User'}</div>
                  <div className="member-role">
                    {member._id === group.creator?._id ? 'Creator' : 'Member'}
                  </div>
                </div>
                {member._id === group.creator?._id && (
                  <span className="creator-badge">👑</span>
                )}
              </div>
            ))}
          </div>
          
          <div className="group-actions">
            <button className="group-action-btn">
              👥 Invite Members
            </button>
            <button className="group-action-btn">
              ⚙️ Group Settings
            </button>
          </div>
        </div>
      )}

      {/* Current Task Highlight */}
      {currentTask && (
        <div className="current-task-banner">
          <div className="banner-content">
            <h4>🎯 Current Task</h4>
            <p>{currentTask.taskTitle}</p>
            <button className="focus-btn">
              Focus on Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Task Card Component (keep the same as before)
const TaskCard = ({ task, onStatusChange, isExpanded, onToggleExpand }) => {
  if (!task) return null;

  const getStatusOptions = (currentStatus) => {
    switch (currentStatus) {
      case "pending":
        return [
          { value: "in_progress", label: "Start Progress", icon: "▶️" },
          { value: "completed", label: "Mark Done", icon: "✅" }
        ];
      case "in_progress":
        return [
          { value: "pending", label: "Move Back", icon: "↩️" },
          { value: "completed", label: "Mark Done", icon: "✅" }
        ];
      case "completed":
        return [
          { value: "pending", label: "Reopen", icon: "🔄" },
          { value: "in_progress", label: "In Progress", icon: "▶️" }
        ];
      default:
        return [];
    }
  };

  const statusOptions = getStatusOptions(task.status);
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date() && task.status !== 'completed';

  return (
    <div className={`task-card ${isExpanded ? 'expanded' : ''} ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-header" onClick={() => onToggleExpand(task._id || task.id)}>
        <div className="task-main">
          <h5 className="task-title">{task.title || "Untitled Task"}</h5>
          <div className="task-meta">
            <span className={`priority-badge priority-${task.priority || "medium"}`}>
              {task.priority || "medium"}
            </span>
            {dueDate && (
              <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
                📅 {dueDate.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <button className="expand-btn">
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="task-details">
          <p className="task-description">
            {task.description || "No description provided"}
          </p>

          <div className="task-info">
            {task.assignedTo && (
              <div className="assignee">
                <strong>Assigned to:</strong>
                <div className="assignee-info">
                  {task.assignedTo.avatar ? (
                    <img src={task.assignedTo.avatar} alt={task.assignedTo.name} />
                  ) : (
                    <span className="assignee-avatar">
                      {task.assignedTo.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                  <span>{task.assignedTo.name || "Unassigned"}</span>
                </div>
              </div>
            )}
            
            {task.assignedBy && (
              <div className="assigner">
                <strong>Assigned by:</strong>
                <span>{task.assignedBy.name || "Unknown"}</span>
              </div>
            )}
            
            {task.createdAt && (
              <div className="task-created">
                <strong>Created:</strong>
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {statusOptions.length > 0 && (
            <div className="task-actions">
              {statusOptions.map(option => (
                <button
                  key={option.value}
                  className={`status-btn ${option.value}`}
                  onClick={() => onStatusChange(task._id || task.id, option.value, task.title)}
                >
                  <span className="btn-icon">{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RightChatCollab;