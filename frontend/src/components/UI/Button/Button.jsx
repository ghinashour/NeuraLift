import React from 'react';
import './Button.css';

const Button = ({ children, onClick, className = '', type = 'button', ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`schedule-btn ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;