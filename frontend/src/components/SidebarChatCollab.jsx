// src/components/SidebarChatCollab.jsx
import React, { useState } from "react";
import "../styles/SidebarChatCollab.css";

const SidebarChatCollab = ({
  groups = [],
  activeGroup,
  onSelectGroup,
  onCreateGroup,
  onJoinGroup,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter groups based on search
  const filteredGroups = groups.filter(group =>
    group.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Safe grouping function with null checks
  const groupedTasks = (group) => {
    if (!group || !group.tasks || !Array.isArray(group.tasks)) {
      return { todo: [], inProgress: [], done: [] };
    }

    const grouped = { todo: [], inProgress: [], done: [] };

    group.tasks.forEach(task => {
      if (!task || !task.status) return;

      switch (task.status) {
        case 'pending':
        case 'To-Do':
          grouped.todo.push(task);
          break;
        case 'in_progress':
        case 'In Progress':
          grouped.inProgress.push(task);
          break;
        case 'completed':
        case 'Done':
          grouped.done.push(task);
          break;
        default:
          grouped.todo.push(task);
      }
    });

    return grouped;
  };

  const getGroupAvatar = (group) => {
    if (group.avatar) return group.avatar;
    return group.name ? group.name.charAt(0).toUpperCase() : 'G';
  };

  if (loading) {
    return (
      <div className="sidebar-chat">
        <div className="sidebar-loading">
          <div className="loading-spinner-small"></div>
          <p>Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar-chat">
      {/* Header */}
      <div className="sidebar-header">
        <h2>Collaboration</h2>
        <p>Manage your teams and tasks</p>
      </div>

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-item">
          <div className="stat-number">{groups.length}</div>
          <div className="stat-label">Groups</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            {groups.reduce((total, group) => total + (group.members?.length || 0), 0)}
          </div>
          <div className="stat-label">Members</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            {groups.reduce((total, group) => total + (group.tasks?.length || 0), 0)}
          </div>
          <div className="stat-label">Tasks</div>
        </div>
      </div>

      {/* Groups List */}
      <div className="groups-section">
        <div className="section-header">
          <h3>Your Groups</h3>
          <span className="groups-count">{filteredGroups.length}</span>
        </div>

        <div className="groups-list">
          {filteredGroups.length > 0 ? (
            filteredGroups.map(group => {
              const tasksByStatus = groupedTasks(group);
              const totalTasks = tasksByStatus.todo.length + tasksByStatus.inProgress.length + tasksByStatus.done.length;

              return (
                <div
                  key={group._id || group.id}
                  className={`group-item ${activeGroup?._id === group._id ? 'active' : ''}`}
                  onClick={() => onSelectGroup && onSelectGroup(group)}
                >
                  <div className="group-avatar">
                    {getGroupAvatar(group)}
                  </div>

                  <div className="group-content">
                    <div className="rcc-group-header">
                      <h4 className="group-name">{group.name || 'Unnamed Group'}</h4>
                      <span className="member-count">
                        👥 {group.members ? group.members.length : 0}
                      </span>
                    </div>

                    <p className="group-desc">
                      {group.description || 'No description available'}
                    </p>

                    {/* Task Progress */}
                    {totalTasks > 0 && (
                      <div className="task-progress">
                        <div className="rcc-progress-bar">
                          <div
                            className="rcc-progress-fill"
                            style={{
                              width: `${(tasksByStatus.done.length / totalTasks) * 100}%`
                            }}
                          ></div>
                        </div>
                        <div className="progress-stats">
                          <span>{tasksByStatus.done.length}/{totalTasks} completed</span>
                        </div>
                      </div>
                    )}

                    {/* Task Status Summary */}
                    {totalTasks > 0 ? (
                      <div className="task-summary">
                        <div className="task-status">
                          <span className="status-dot todo"></span>
                          {tasksByStatus.todo.length}
                        </div>
                        <div className="task-status">
                          <span className="status-dot in-progress"></span>
                          {tasksByStatus.inProgress.length}
                        </div>
                        <div className="task-status">
                          <span className="status-dot done"></span>
                          {tasksByStatus.done.length}
                        </div>
                      </div>
                    ) : (
                      <div className="no-tasks-indicator">
                        No tasks yet
                      </div>
                    )}
                  </div>

                  {/* Active Indicator */}
                  {activeGroup?._id === group._id && (
                    <div className="active-indicator"></div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="no-groups">
              <div className="no-groups-icon">💬</div>
              <h4>No groups found</h4>
              <p>
                {searchTerm ? 'Try adjusting your search' : 'Create your first group to start collaborating'}
              </p>
              {!searchTerm && (
                <button
                  className="create-group-btn primary"
                  onClick={onCreateGroup}
                >
                  + Create Group
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Group Button */}
      {filteredGroups.length > 0 && (
        <div className="create-group-section">
          <button
            className="create-group-btn primary"
            onClick={onCreateGroup}
          >
            <span className="btn-icon">+</span>
            Create New Group
          </button>
        </div>
      )}
    </div>
  );
};

export default SidebarChatCollab;