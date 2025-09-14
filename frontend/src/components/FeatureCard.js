// src/components/FeatureCard.js
import React from "react";
import { FaClock, FaTasks, FaBrain, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function FeatureCard({ title, subtext, iconType, gradient, link }) {
  const navigate = useNavigate();

  const icons = {
    timer: <FaClock />,
    tasks: <FaTasks />,
    brain: <FaBrain />,
    heart: <FaHeart />,
  };

  return (
    <div
      className="feature-card"
      onClick={() => navigate(link)}
      style={{ cursor: "pointer" }}
    >
      <div className="icon-wrapper" style={{ background: gradient }}>
        {icons[iconType]}
      </div>
      <h3>{title}</h3>
      <p>{subtext}</p>
    </div>
  );
}

export default FeatureCard;