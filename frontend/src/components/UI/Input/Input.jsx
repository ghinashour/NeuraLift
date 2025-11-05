// src/UI/Input/Input.jsx
import React, { useState, useEffect } from 'react';
import './Input.css';

const Input = ({ label, type = 'text', value, onChange, name, placeholder, required }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const shouldFloat = isFocused || value.length > 0;

  return (
    <div className="input-wrapper">
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          className="input-field textarea-field"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          className="input-field"
        />
      )}
      <label className={`input-label ${shouldFloat ? 'float' : ''}`}>
        {label}
      </label>
    </div>
  );
};

export default Input;
