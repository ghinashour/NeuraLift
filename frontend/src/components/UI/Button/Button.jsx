import React from 'react';

const Button = ({ children, onClick, className = '', type = 'button', ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;