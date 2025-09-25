// src/components/ChallengeCard.js
import React from "react";
import "../../styles/Challenges.css";

function ChallengeCard({ title, description }) {
  return (
    <div className="challenge-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default ChallengeCard;
