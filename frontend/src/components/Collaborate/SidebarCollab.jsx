// src/components/Collaborate/SidebarCollab.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/SidebarCollab.css";
import {
  FiUserPlus,
  FiUsers,
  FiClipboard,
  FiPlusCircle,
  FiCheckSquare,
  FiMessageSquare,
  FiList,
  FiEdit3
} from "react-icons/fi";

const SidebarCollab = ({ onOpenPopup, groups, onInviteGroup }) => {
  const [activePopup, setActivePopup] = useState(null);
  const navigate = useNavigate();

  const handleIconClick = (action) => {
    switch (action) {
      case "invite":
        onOpenPopup("invite");
        break;
      case "group":
        onOpenPopup("createGroup");
        break;
      case "task":
        onOpenPopup("assignTask");
        break;
      case "post":
        onOpenPopup("createPost");
        break;
      case "addMember":
        onOpenPopup("addMember");
        break;
      case "myTasks":
        navigate("/my-tasks");
        break;
      case "assignedTasks":
        navigate("/assigned-tasks");
        break;
      default:
        break;
    }
  };

  const handleGroupInvite = (group) => {
    onInviteGroup({ group });
  };

  return (
    <div className="side-collab-container">
      <div className="side-collab-icons">
        {/* Invite via Link */}
        <div className="icon-tooltip">
          <FiUserPlus
            className="side-collab-icon"
            onClick={() => handleIconClick("invite")}
          />
          <span className="tooltip-text">Invite via Link</span>
        </div>

        {/* Create Group */}
        <div className="icon-tooltip">
          <FiUsers
            className="side-collab-icon"
            onClick={() => handleIconClick("group")}
          />
          <span className="tooltip-text">Create Group</span>
        </div>

        {/* Assign Task */}
        <div className="icon-tooltip">
          <FiClipboard
            className="side-collab-icon"
            onClick={() => handleIconClick("task")}
          />
          <span className="tooltip-text">Assign Task</span>
        </div>

        {/* Create Post */}
        <div className="icon-tooltip">
          <FiPlusCircle
            className="side-collab-icon"
            onClick={() => handleIconClick("post")}
          />
          <span className="tooltip-text">Create Post</span>
        </div>

        {/* Add Member */}
        <div className="icon-tooltip">
          <FiUserPlus
            className="side-collab-icon"
            onClick={() => handleIconClick("addMember")}
          />
          <span className="tooltip-text">Add Member</span>
        </div>

        {/* My Tasks (Tasks assigned to me) */}
        <div className="icon-tooltip">
          <FiCheckSquare
            className="side-collab-icon"
            onClick={() => handleIconClick("myTasks")}
          />
          <span className="tooltip-text">My Tasks</span>
        </div>

        {/* Tasks I Assigned */}
        <div className="icon-tooltip">
          <FiList
            className="side-collab-icon"
            onClick={() => handleIconClick("assignedTasks")}
          />
          <span className="tooltip-text">Tasks I Assigned</span>
        </div>
      </div>

      {/* Groups Section */}
      <div className="sidebar-groups-section">
        <h3 className="groups-title">Your Groups</h3>
        <div className="groups-list">
          {groups && groups.length > 0 ? (
            groups.map((group) => (
              <div key={group._id} className="group-item">
                <div className="group-avatar">
                  {group.name.charAt(0).toUpperCase()}
                </div>
                <div className="group-info">
                  <h4 className="group-name">{group.name}</h4>
                  <p className="group-members">
                    {group.members?.length || 0} members
                  </p>
                  <p className="group-description">
                    {group.description?.length > 50 
                      ? `${group.description.substring(0, 50)}...`
                      : group.description
                    }
                  </p>
                </div>
                <button
                  className="group-invite-btn"
                  onClick={() => handleGroupInvite(group)}
                  title="Invite to group"
                >
                  <FiUserPlus size={14} />
                </button>
              </div>
            ))
          ) : (
            <div className="no-groups">
              <FiUsers size={24} className="no-groups-icon" />
              <p>No groups yet</p>
              <button 
                className="create-group-btn"
                onClick={() => handleIconClick("group")}
              >
                Create Your First Group
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="sidebar-stats">
        <div className="stat-item">
          <FiUsers className="stat-icon" />
          <div className="stat-info">
            <span className="stat-number">
              {groups?.reduce((total, group) => total + (group.members?.length || 0), 0) || 0}
            </span>
            <span className="stat-label">Total Members</span>
          </div>
        </div>
        <div className="stat-item">
          <FiMessageSquare className="stat-icon" />
          <div className="stat-info">
            <span className="stat-number">{groups?.length || 0}</span>
            <span className="stat-label">Your Groups</span>
          </div>
        </div>
        <div className="stat-item">
          <FiList className="stat-icon" />
          <div className="stat-info">
            <span className="stat-number">-</span>
            <span className="stat-label">Tasks Assigned</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3 className="actions-title">Quick Actions</h3>
        <button 
          className="action-btn primary"
          onClick={() => handleIconClick("post")}
        >
          <FiPlusCircle size={16} />
          Create Post
        </button>
        <button 
          className="action-btn"
          onClick={() => handleIconClick("group")}
        >
          <FiUsers size={16} />
          New Group
        </button>
        <button 
          className="action-btn"
          onClick={() => handleIconClick("task")}
        >
          <FiClipboard size={16} />
          Assign Task
        </button>
        <button 
          className="action-btn"
          onClick={() => handleIconClick("assignedTasks")}
        >
          <FiEdit3 size={16} />
          Manage My Tasks
        </button>
      </div>

      {/* Task Management Section */}
      <div className="task-management-section">
        <h3 className="section-title">Task Management</h3>
        <div className="task-links">
          <button 
            className="task-link-btn"
            onClick={() => handleIconClick("myTasks")}
          >
            <FiCheckSquare size={16} />
            <span>Tasks Assigned to Me</span>
            <span className="link-arrow">→</span>
          </button>
          <button 
            className="task-link-btn"
            onClick={() => handleIconClick("assignedTasks")}
          >
            <FiList size={16} />
            <span>Tasks I Assigned</span>
            <span className="link-arrow">→</span>
          </button>
          <button 
            className="task-link-btn"
            onClick={() => handleIconClick("task")}
          >
            <FiClipboard size={16} />
            <span>Assign New Task</span>
            <span className="link-arrow">+</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarCollab;