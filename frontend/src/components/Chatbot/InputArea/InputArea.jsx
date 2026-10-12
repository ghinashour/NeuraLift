import React, { useState, useRef, useEffect } from 'react';
import './InputArea.css';
import { isValidMessage, sanitizeInput } from '../../../utils/aiHelpers';

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 19V5M5 12l7-7 7 7"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InputArea = ({ onSend, disabled }) => {
  const [inputText, setInputText] = useState('');
  const inputRef = useRef(null);

  // Auto-grow up to max-height, then scroll
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [inputText]);

  const handleSend = async () => {
    const sanitized = sanitizeInput(inputText || '');
    if (!isValidMessage(sanitized) || disabled) return;
    setInputText('');
    await onSend?.(sanitized);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = inputText.trim().length > 0 && !disabled;

  return (
    <div className="input-area nl-input-area">
      <div className="input-wrapper">
        <textarea
          ref={inputRef}
          className="chat-textarea"
          placeholder="Ask about focus, stress, sleep, or planning…"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Chat message input"
          rows={1}
          disabled={disabled}
        />
        <button
          type="button"
          className="send-button"
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          title="Send"
        >
          <SendIcon />
        </button>
      </div>
      <p className="input-hint">Enter to send · Shift + Enter for new line · AI can make mistakes</p>
    </div>
  );
};

export default InputArea;
