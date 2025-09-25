// src/components/CategoryButton.js
import React from "react";
import "../../styles/Challenges.css";

function CategoryButton({ label, color }) {
  return (
    <button className={`category-btn ${color}`}>
      {label}
    </button>
  );
}

export default CategoryButton;
