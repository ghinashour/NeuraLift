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
  const fileInputRef = useRef(null);
  const [isTypingLocal, setIsTypingLocal] = useState(false);
  const typingTimer = useRef(null);

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
  // build grouped messages by day and compute consecutive flags
  const groupedByDay = () => {
    if (!group?.messages) return [];
    const groups = [];
    let currentDay = null;
    const msgs = group.messages;
    for (let i = 0; i < msgs.length; i++) {
      const m = msgs[i];
      const day = new Date(m.ts).toDateString();
      if (day !== currentDay) {
        currentDay = day;
        groups.push({ type: "day", label: formatDayLabel(m.ts) });
      }

      // consecutive = same user as previous and within 5 minutes
      let isConsecutive = false;
      if (i > 0) {
        const prev = msgs[i - 1];
        const sameUser = prev.user?.id && m.user?.id && prev.user.id === m.user.id;
        const withinTime = Math.abs(m.ts - prev.ts) < 1000 * 60 * 5; // 5 minutes
        const sameDay = new Date(prev.ts).toDateString() === new Date(m.ts).toDateString();
        if (sameUser && withinTime && sameDay) isConsecutive = true;
      }

      groups.push({ type: "msg", payload: m, isConsecutive });
    }
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
              <div key={"d-" + idx} className="date-divider">
                <span>{it.label}</span>
              </div>
            ) : (
              (() => {
                const m = it.payload;
                if (m.type === "system") {
                  return (
                    <div key={m.id} className="system-message">
                      <div className="message-content">{m.text}</div>
                    </div>
                  );
                }
                const isMine = m.user && m.user.id === "current-user";
                const isConsecutive = !!it.isConsecutive;
                return (
                  <div key={m.id} className={`message ${isConsecutive ? "consecutive" : ""} ${isMine ? "mine" : "their"}`}>
                    {!isMine && (
                      <div className="message-avatar" title={m.user?.name}>
                        {m.user?.avatar ? <img src={m.user.avatar} alt={m.user.name} /> : <span>{m.user?.name?.[0]}</span>}
                      </div>
                    )}

                    <div className="message-content">
                      {!isMine && !isConsecutive && (
                        <div className="message-sender">
                          <div className="sender-name">{m.user?.name}</div>
                          <div className="message-time">{formatTime(m.ts)}</div>
                        </div>
                      )}

                      <div className={`message-bubble ${isMine ? "bubble-mine" : "bubble-their"}`}>
                        {m.type === "file" ? (
                          <div className="message-text">📎 {m.fileName || m.text}</div>
                        ) : (
                          <div className="message-text">{m.text}</div>
                        )}
                        <div className="message-meta">
                          <span className="message-time compact">{formatTime(m.ts)}</span>
                          {isMine && (
                            <span className="read-receipt" aria-hidden>
                              {m.status === "read" ? "✓✓" : m.status === "delivered" ? "✓" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isMine && (
                      <div className="message-avatar" title="You">
                        <span>Y</span>
                      </div>
                    )}
                  </div>
                );
              })()
            )
          )}

          {/* Typing indicator (UI only): expects group.typingUsers = [{id,name}] */}
          {group?.typingUsers && group.typingUsers.length > 0 && (
            <div className="typing-indicator">
              <div className="avatars">
                {group.typingUsers.slice(0,3).map((u) => (
                  <div key={u.id} className="message-avatar" title={u.name}>{u.name?.[0]}</div>
                ))}
              </div>
              <div className="typing-text">
                {group.typingUsers.length === 1 ? `${group.typingUsers[0].name} is typing...` : `${group.typingUsers.length} people are typing...`}
              </div>
              <div className="typing-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>

      <div className="message-input-form">
        <div className="input-container">
          <button
            className="attach-btn"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            title="Attach file"
            aria-label="Attach file"
            disabled={!joined}
          >
            📎
          </button>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const msg = {
                id: "m" + Date.now(),
                type: "file",
                fileName: f.name,
                user: { id: "current-user", name: "You" },
                ts: Date.now(),
              };
              onPostMessage(msg);
              e.target.value = "";
            }}
          />

          <div className="text-input-wrapper">
            <textarea
              className="message-textarea"
              placeholder={joined ? "Type a message. Enter to send, Shift+Enter for newline" : "Join the group to send messages"}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setIsTypingLocal(true);
                if (typingTimer.current) clearTimeout(typingTimer.current);
                typingTimer.current = setTimeout(() => {
                  setIsTypingLocal(false);
                  if (typeof onPostMessage === "function") {
                    // UI-only for now; apps can hook onTyping prop for socket emits
                  }
                }, 900);
              }}
              disabled={!joined}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
          </div>

          <button className="header-btn" onClick={sendMessage} disabled={!joined || !text.trim()} aria-label="Send message">
            Send
          </button>
        </div>
      </div>
    </main>
  );
}