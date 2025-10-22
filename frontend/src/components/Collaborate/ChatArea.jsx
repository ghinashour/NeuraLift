// src/components/ChatArea.jsx
import React, { useState, useRef, useEffect } from "react";

/**
 * ChatArea (enhanced)
 * - sticky header
 * - scrollable, auto-scroll to bottom on new message
 * - date separators (Today / Yesterday / DD/MM/YY)
 * - message grouping and polished timestamps
 *
 * Props:
 * - group: active group object { id, name, members, messages[] }
 * - joined: boolean (can send)
 * - onPostMessage(msg)
 * - onLeave()
 */
export default function ChatArea({ group, joined, onPostMessage, onLeave }) {
  const [text, setText] = useState("");
  const messagesRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    // scroll to bottom when group changes
    scrollToBottom();
    // eslint-disable-next-line
  }, [group?.id]);

  useEffect(() => {
    if (autoScroll) scrollToBottom();
    // eslint-disable-next-line
  }, [group?.messages?.length]);

  const scrollToBottom = () => {
    if (!messagesRef.current) return;
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  };

  const handleScroll = () => {
    if (!messagesRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 30;
    setAutoScroll(atBottom);
  };

  const sendMessage = () => {
    if (!text.trim() || !joined) return;
    const msg = {
      id: "m" + Date.now(),
      type: "user",
      user: { id: "current-user", name: "You", avatar: null },
      text: text.trim(),
      ts: Date.now(),
    };
    onPostMessage(msg);
    setText("");
    // allow time for DOM update then scroll
    setTimeout(() => setAutoScroll(true), 50);
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDayLabel = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    const diffDays = Math.floor((+now - +d) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-GB");
  };

  // build grouped messages by day to show separators
  const groupedByDay = () => {
    if (!group?.messages) return [];
    const groups = [];
    let currentDay = null;
    group.messages.forEach((m) => {
      const day = new Date(m.ts).toDateString();
      if (day !== currentDay) {
        currentDay = day;
        groups.push({ type: "day", label: formatDayLabel(m.ts) });
      }
      groups.push({ type: "msg", payload: m });
    });
    return groups;
  };

  if (!group) {
    return (
      <main className="chat-area empty">
        <div className="empty-inner">Select or create a group to start chatting</div>
      </main>
    );
  }

  const items = groupedByDay();

  return (
    <main className="chat-area">
      <div className="chat-header sticky">
        <div className="chat-title">{group.name}</div>
        <div className="chat-header-right">
          <div className="avatars">
            {group.members.map((m) => (
              <div key={m.id} className="avatar-small" title={m.name}>
                {m.avatar ? <img src={m.avatar} alt={m.name} /> : <span>{m.name[0]}</span>}
              </div>
            ))}
          </div>
          <button className="leave-btn" onClick={() => onLeave()}>
            Leave Chat
          </button>
        </div>
      </div>

      <div
        className="messages"
        ref={messagesRef}
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
      >
        {items.map((it, idx) =>
          it.type === "day" ? (
            <div key={"d-" + idx} className="msg-day-sep">
              <span>{it.label}</span>
            </div>
          ) : (
            (() => {
              const m = it.payload;
              if (m.type === "system") {
                return (
                  <div key={m.id} className="msg-system">
                    {m.text}
                  </div>
                );
              }
              const isMine = m.user && m.user.id === "current-user";
              return (
                <div key={m.id} className={`msg-row ${isMine ? "mine" : "theirs"}`}>
                  {!isMine && (
                    <div className="msg-avatar" title={m.user?.name}>
                      {m.user?.avatar ? <img src={m.user.avatar} alt={m.user.name} /> : <span>{m.user?.name?.[0]}</span>}
                    </div>
                  )}
                  <div className={`msg-bubble ${isMine ? "bubble-mine" : "bubble-their"}`}>
                    {!isMine && <div className="msg-author">{m.user?.name}</div>}
                    <div className="msg-text">{m.text}</div>
                    <div className="msg-time">{formatTime(m.ts)}</div>
                  </div>
                  {isMine && (
                    <div className="msg-avatar" title="You">
                      <span>Y</span>
                    </div>
                  )}
                </div>
              );
            })()
          )
        )}
      </div>

      <div className="chat-input-row sticky-bottom">
        <input
          placeholder={joined ? "Type a message and press Enter..." : "Join the group to send messages"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!joined}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={!joined || !text.trim()}>
          Send
        </button>
      </div>
    </main>
  );
}