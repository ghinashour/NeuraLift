// src/components/SidebarCollab.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/SidebarCollab.css";
import {
  FiUserPlus,
  FiUsers,
  FiClipboard,
  FiPlusCircle,
  FiCheckSquare,
} from "react-icons/fi";

const SidebarCollab = () => {
  const [activePopup, setActivePopup] = useState(null);
  const navigate = useNavigate();

  const togglePopup = (popup) => {
    setActivePopup(activePopup === popup ? null : popup);
  };

  return (
    <div className="side-collab-container">
      <div className="side-collab-icons">
        <FiUserPlus
          className="side-collab-icon"
          onClick={() => togglePopup("invite")}
          title="Invite via link"
        />
        <FiUsers
          className="side-collab-icon"
          onClick={() => togglePopup("group")}
          title="Create group"
        />
        <FiClipboard
          className="side-collab-icon"
          onClick={() => togglePopup("task")}
          title="Assign task"
        />
        <FiPlusCircle
          className="side-collab-icon"
          onClick={() => togglePopup("post")}
          title="Create post"
        />
        <FiCheckSquare
          className="side-collab-icon"
          onClick={() => navigate("/my-tasks")}
          title="My Tasks"
        />
      </div>

      {/* Invite Popup */}
      {activePopup === "invite" && (
        <div className="side-collab-popup">
          <h3>Invite via Link</h3>
          <input type="text" value="https://collab.app/invite/abc123" readOnly />
          <button>Copy Link</button>
        </div>
      )}

      {/* Create Group Popup */}
      {activePopup === "group" && (
        <div className="side-collab-popup">
          <h3>Create Group</h3>
          <input type="text" placeholder="Group Name" />
          <input type="text" placeholder="Group Description" />
          <button>Create Group</button>
        </div>
      )}

      {/* Assign Task Popup */}
      {activePopup === "task" && (
        <div className="side-collab-popup">
          <h3>Assign New Task</h3>
          <input type="text" placeholder="Task Name" />
          <textarea placeholder="Task Description"></textarea>
          <select>
            <option>Select Member</option>
            <option>Alice</option>
            <option>Bob</option>
          </select>
          <button>Submit Task</button>
        </div>
      )}

      {/* Create Post Popup */}
      {activePopup === "post" && (
        <div className="side-collab-popup">
          <h3>Create Post</h3>
          <input type="text" placeholder="Your Name" />
          <textarea placeholder="Write your post..."></textarea>
          <button>Share Your Question</button>
        </div>
      )}
    </div>
  );
};

export default SidebarCollab;