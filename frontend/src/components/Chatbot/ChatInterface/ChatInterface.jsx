import React from 'react';
import MessageList from '../MessageList/MessageList';
import InputArea from '../InputArea/InputArea';
import TypingIndicator from '../TypingIndicator/TypingIndicator';
import QuickReplies from '../QuickReplies/QuickReplies';
import './ChatInterface.css';

const ChatInterface = ({ messages, onSendMessage, isTyping, suggestions, onQuickReply }) => {
  return (
    <div className="chat-interface">
      <div className="messages-container">
        <MessageList messages={messages} onQuickReply={onQuickReply} />
        {isTyping && <TypingIndicator isVisible={isTyping} />}
        {suggestions && suggestions.length > 0 && (
          <QuickReplies suggestions={suggestions} onSelect={onQuickReply} />
        )}
      </div>
      <InputArea onSendMessage={onSendMessage} disabled={isTyping} />
    </div>
  );
};

export default ChatInterface;
