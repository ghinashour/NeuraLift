import React, { useRef, useEffect, useLayoutEffect } from 'react';
import MessageBubble from '../MessageBubble/MessageBubble';
import './MessageList.css';

const MessageList = ({ messages, onQuickReply }) => {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  // Scroll smoothly when new messages are added
  const scrollToBottom = (behavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior });
  };

  // Ensure scroll to bottom on mount (instant)
  useLayoutEffect(() => {
    scrollToBottom('auto');
  }, []);

  // Scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Group messages by sender for better bubble layout
  const groupedMessages = [];
  for (let i = 0; i < messages.length; i++) {
    const current = messages[i];
    const prev = messages[i - 1];
    const sameSender = prev && prev.sender === current.sender;
    groupedMessages.push({
      ...current,
      showAvatar: !sameSender,
      showName: !sameSender && current.sender !== 'user',
    });
  }

  return (
    <div className="message-list" ref={containerRef}>
      {groupedMessages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isUser={message.sender === 'user'}
          showAvatar={message.showAvatar}
          showName={message.showName}
          onQuickReply={onQuickReply}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
