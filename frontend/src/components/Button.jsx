import React from 'react';
import '../styles/Button.css'

const Button = ({ 
  onClick, 
  variant = 'primary', 
  children, 
  className = '', 
  disabled = false,
  ...props 
}) => {
  return (
    <button
      className={`btn btn--${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;