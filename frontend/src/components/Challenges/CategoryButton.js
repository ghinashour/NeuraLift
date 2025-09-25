// src/components/CategoryButton.js
import React from "react";
import "../../styles/Challenges.css";

function CategoryButton({ label, color, svg }) {
  return (
    <button className={`category-btn ${color}`}>
      {svg && <span className="icon">{svg}</span>}
      {label}
    </button>
  );
}

export default CategoryButton;
