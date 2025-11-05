// src/components/SidebarChatCollab.jsx
import React, { useState } from "react";

/**
 * SidebarChatCollab
 * - Shows list of groups (top)
 * - Below: grouped tasks by status for the active group
 * - Clicking a task emits onSelectTask (handled internally by ChattingCollab via group change + right panel)
 */
export default function SidebarChatCollab({
  groups,
  activeGroupId,
  onSelectGroup,
  onCreateGroup,
  onCopyInvite,
  onJoinGroup,
  joinedGroups,
}) {
  const [newGroupName, setNewGroupName] = useState("");

  const handleCreate = () => {
    if (!newGroupName.trim()) return;
    const id = "g" + Date.now();
    onCreateGroup({
      id,
      name: newGroupName,
      desc: "New group",
      members: [],
      tasks: [],
      messages: [
        { id: "sys-" + Date.now(), type: "system", text: `Group ${newGroupName} created`, ts: Date.now() },
      ],
    });
    setNewGroupName("");
  };

  const activeGroup = groups.find((g) => g.id === activeGroupId);

  const groupedTasks = (group) => {
    if (!group) return { "To-Do": [], "In Progress": [], Done: [] };
    const obj = { "To-Do": [], "In Progress": [], Done: [] };
    group.tasks.forEach((t) => obj[t.status] ? obj[t.status].push(t) : obj["To-Do"].push(t));
    return obj;
  };

  return (
    <aside className="sidebar-chat">
      <div className="sidebar-groups">
        <h3 className="sidebar-title">Groups</h3>
        <div className="groups-list">
          {groups.map((g) => (
            <div
              key={g.id}
              className={`group-item ${g.id === activeGroupId ? "active" : ""}`}
              onClick={() => onSelectGroup(g.id)}
            >
              <div className="group-name">{g.name}</div>
              <div className="group-members-count">{g.members.length}</div>
            </div>
          ))}
        </div>

        <div className="create-group">
          <input
            className="create-input"
            placeholder="New group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            aria-label="New group name"
          />
          <button className="create-btn primary-btn" onClick={handleCreate} aria-label="Create group">Create</button>
        </div>
      </div>

      <div className="sidebar-tasks">
        <h4 className="sidebar-title">Group Tasks</h4>

        {!activeGroup && <div className="muted">Select a group</div>}

        {activeGroup && (
          <>
            {Object.entries(groupedTasks(activeGroup)).map(([status, tasks]) => (
              <div key={status} className="task-group">
                <div className="task-group-title">
                  {status} <span className="task-count">({tasks.length})</span>
                </div>
                <div className="task-cards">
                  {tasks.map((t) => (
                    <div key={t.id} className="task-card-small" title={t.description}>
                      <div className="task-card-left">
                        <div className="task-card-title">{t.title}</div>
                        <div className="task-card-desc">{t.description}</div>
                      </div>
                      <div className="task-card-meta">
                        <div className="task-attachments">{t.attachments?.length || 0}</div>
                      </div>
                    </div>
                  ))}
                  {tasks.length === 0 && <div className="muted">No tasks</div>}
                </div>
              </div>
            ))}

            <div className="sidebar-actions">
              <button
                className="secondary-btn"
                onClick={() => {
                  try {
                    const link = onCopyInvite(activeGroup.id);
                    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
                      navigator.clipboard.writeText(link || "").then(() => {
                        // minimal inline feedback
                        const el = document.createElement('div');
                        el.textContent = 'Invite link copied';
                        el.style.position = 'fixed'; el.style.right = '20px'; el.style.top = '80px'; el.style.background = '#111827'; el.style.color = '#fff'; el.style.padding = '8px 12px'; el.style.borderRadius = '8px'; el.style.zIndex = '1000';
                        document.body.appendChild(el);
                        setTimeout(() => el.remove(), 1200);
                      });
                    } else {
                      alert('Invite link: ' + link);
                    }
                  } catch (err) {
                    console.warn('copy failed', err);
                  }
                }}
                aria-label="Copy invite link"
              >
                Copy invite
              </button>

              {joinedGroups.includes(activeGroup.id) ? (
                <div className="joined-badge" role="status" aria-label="Joined">Joined</div>
              ) : (
                <button
                  className="create-btn primary-btn"
                  onClick={() => onJoinGroup(activeGroup.id, { id: "current-user", name: "You", avatar: null })}
                  aria-label="Join group"
                >
                  Join group
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}