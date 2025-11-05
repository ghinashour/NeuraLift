import React from 'react';
import './Divider.css'; // We'll use CSS for the animation

const Divider = ({ className = '' }) => {
  return <hr className={`divider ${className}`} />;
};

export default Divider;
