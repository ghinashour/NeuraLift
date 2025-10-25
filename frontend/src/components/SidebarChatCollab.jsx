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
            placeholder="New group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <button onClick={handleCreate}>Create</button>
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
                onClick={() => {
                  const link = onCopyInvite(activeGroup.id);
                  alert("Invite link copied to clipboard:\n" + link);
                }}
              >
                Copy invite link
              </button>

              {joinedGroups.includes(activeGroup.id) ? (
                <div className="joined-badge">Joined</div>
              ) : (
                <button
                  onClick={() =>
                    onJoinGroup(activeGroup.id, { id: "current-user", name: "You", avatar: null })
                  }
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