// src/components/collaborate/Sidebar.js
import React, { useState } from "react";
import "../../styles/Collaborate.css";
import Popup from "./Popup";
import CreateGroupForm from "./CreateGroupForm";
import AssignTaskForm from "./AssignTaskForm";
import CreatePostForm from "./CreatePostForm";
import { FaLink, FaUsers, FaTasks, FaPlusCircle, FaClipboardList } from "react-icons/fa";

/**
 * Sidebar always visible on the right of the collaborate page.
 * Clicking items opens popups (create group, assign task, create post, invite link).
 */
export default function Sidebar() {
  const [open, setOpen] = useState(null); // 'invite' | 'group' | 'task' | 'post' | 'tasksPage'

  return (
    <div className="sidebar">
      <div className="sidebar-block">
        <button className="sidebar-btn" onClick={() => setOpen("invite")}>
          <FaLink /> <span>Invite via Link</span>
        </button>

        <button className="sidebar-btn" onClick={() => setOpen("group")}>
          <FaUsers /> <span>Create Group</span>
        </button>

        <button className="sidebar-btn" onClick={() => setOpen("task")}>
          <FaTasks /> <span>Assign Task</span>
        </button>

        <button className="sidebar-btn" onClick={() => setOpen("post")}>
          <FaPlusCircle /> <span>Create Post</span>
        </button>

        <a className="sidebar-btn" href="/my-tasks">
          <FaClipboardList /> <span>My Tasks</span>
        </a>
      </div>

      {/* Popups */}
      {open && (
        <Popup onClose={() => setOpen(null)}>
          {open === "group" && <CreateGroupForm onClose={() => setOpen(null)} />}
          {open === "task" && <AssignTaskForm onClose={() => setOpen(null)} />}
          {open === "post" && <CreatePostForm onClose={() => setOpen(null)} />}
          {open === "invite" && (
            <div className="invite-popup">
              <h3>Invite via link</h3>
              <p>Share this link to invite members</p>
              <div className="invite-row">
                <input readOnly value={window.location.href + "invite/" + Math.random().toString(36).slice(2, 8)} />
                <button onClick={() => { navigator.clipboard?.writeText(window.location.href); }}>Copy</button>
              </div>
            </div>
          )}
        </Popup>
      )}
    </div>
  );
}