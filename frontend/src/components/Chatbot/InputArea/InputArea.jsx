import React, { useState, useRef } from 'react';
import './InputArea.css';
import { FaPaperPlane, FaSmile, FaPaperclip } from 'react-icons/fa';
import Input from '../../UI/Input/Input';
import { useChat } from '../../../context/ChatContext';
import { useAI } from '../../../hooks/useAI';
import { isValidMessage, sanitizeInput } from '../../../utils/aiHelpers';

const InputArea = () => {
  const [inputText, setInputText] = useState('');
  const inputRef = useRef(null);
  const { addMessage, setIsTyping } = useChat();
  const { processMessage } = useAI();

  const handleSend = async () => {
    const sanitized = sanitizeInput(inputText);
    
    if (!isValidMessage(sanitized)) return;

    // Add user message
    addMessage({
      sender: 'user',
      text: sanitized
    });

    setInputText('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Get AI response
    const response = await processMessage(sanitized);
    
    // Add bot response
    setIsTyping(false);
    addMessage({
      sender: 'bot',
      text: response
    });

    // Refocus input
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-area">
      <div className="input-wrapper">
        <Input
          ref={inputRef}
          type="textarea"
          placeholder="Ask anything..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Chat message input"
        />
        <div className="input-actions">
          <button className="icon-button" aria-label="Attach file">
            <FaPaperclip className="icon" />
          </button>
          <button className="icon-button" aria-label="Add emoji">
            <FaSmile className="icon" />
          </button>
          <button 
            className="send-button" 
            onClick={handleSend}
            disabled={!inputText.trim()}
            aria-label="Send message"
          >
            <FaPaperPlane className="send-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputArea;