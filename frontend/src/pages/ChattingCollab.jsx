import React, { useState } from "react";
import SidebarChatCollab from "../components/SidebarChatCollab";
import ChatArea from "../components/ChatArea";
import RightChatCollab from "../components/RightChatCollab";
import "../styles/ChattingCollab.css";

/**
 * ChattingCollab page (3-column layout)
 * - left: SidebarChatCollab (group tasks by status)
 * - center: ChatArea (messages + input)
 * - right: RightChatCollab (task details + change status)
 *
 * All data mocked locally. Status changes produce system messages.
 */
const INITIAL_GROUPS = [
  {
    id: "g1",
    name: "Design Team",
    desc: "UI/UX discussions and assets",
    members: [
      { id: "u1", name: "Ghinaa Shour", avatar: null },
      { id: "u2", name: "Hassan", avatar: null },
      { id: "u3", name: "Maya", avatar: null },
    ],
    tasks: [
      {
        id: "t1",
        title: "Design Homepage",
        description: "Create a responsive and modern homepage design.",
        status: "To-Do",
        attachments: [{ id: "a1", name: "wireframe.pdf", type: "file" }],
      },
      {
        id: "t2",
        title: "Develop API Endpoints",
        description: "Create endpoints for auth and profiles.",
        status: "In Progress",
        attachments: [],
      },
      {
        id: "t3",
        title: "User Personas Research",
        description: "Build personas for target audience.",
        status: "Done",
        attachments: [],
      },
    ],
    messages: [
      {
        id: "m1",
        type: "system",
        text: "Group created by Ghinaa Shour",
        ts: Date.now() - 1000 * 60 * 60 * 24,
      },
      {
        id: "m2",
        type: "user",
        user: { id: "u3", name: "Maya", avatar: null },
        text: "Hey team, I uploaded the draft presentation",
        ts: Date.now() - 1000 * 60 * 60,
      },
    ],
  },
];

export default function ChattingCollab() {
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [activeGroupId, setActiveGroupId] = useState(groups[0].id);
  const [joinedGroups, setJoinedGroups] = useState([]); // ids of groups the current user joined

  const activeGroup = groups.find((g) => g.id === activeGroupId);

  const createGroup = (group) => {
    setGroups((prev) => [group, ...prev]);
    setActiveGroupId(group.id);
  };

  const copyInviteLink = (groupId) => {
    const link = `${window.location.origin}/chat/group/${groupId}`;
    navigator.clipboard?.writeText(link);
    return link;
  };

  const joinGroup = (groupId, user) => {
    if (!joinedGroups.includes(groupId)) {
      setJoinedGroups((s) => [...s, groupId]);
      // add system message to group
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId
            ? {
                ...g,
                members: [...g.members, user],
                messages: [
                  ...g.messages,
                  {
                    id: "sys-" + Date.now(),
                    type: "system",
                    text: `${user.name} joined the group`,
                    ts: Date.now(),
                  },
                ],
              }
            : g
        )
      );
    }
  };

  const leaveGroup = (groupId, userId) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              members: g.members.filter((m) => m.id !== userId),
              messages: [
                ...g.messages,
                {
                  id: "sys-" + Date.now(),
                  type: "system",
                  text: "A member left the group",
                  ts: Date.now(),
                },
              ],
            }
          : g
      )
    );
    setJoinedGroups((s) => s.filter((id) => id !== groupId));
  };

  const postMessage = (groupId, message) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, messages: [...g.messages, message] } : g))
    );
  };

  const changeTaskStatus = (groupId, taskId, newStatus, user) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              tasks: g.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
              messages: [
                ...g.messages,
                {
                  id: "sys-" + Date.now(),
                  type: "system",
                  text: `${user.name} changed "${g.tasks.find(t => t.id===taskId)?.title || 'task'}" status to ${newStatus}`,
                  ts: Date.now(),
                },
              ],
            }
          : g
      )
    );
  };

  return (
    <div className="chat-page">
      <SidebarChatCollab
        groups={groups}
        activeGroupId={activeGroupId}
        onSelectGroup={(id) => setActiveGroupId(id)}
        onCreateGroup={createGroup}
        onCopyInvite={copyInviteLink}
        onJoinGroup={joinGroup}
        joinedGroups={joinedGroups}
      />

      <ChatArea
        group={activeGroup}
        joined={joinedGroups.includes(activeGroupId)}
        onPostMessage={(msg) => postMessage(activeGroupId, msg)}
        onLeave={() => leaveGroup(activeGroupId, "current-user")}
      />

      <RightChatCollab
        group={activeGroup}
        onChangeTaskStatus={(taskId, status, user) =>
          changeTaskStatus(activeGroupId, taskId, status, user)
        }
      />
    </div>
  );
}