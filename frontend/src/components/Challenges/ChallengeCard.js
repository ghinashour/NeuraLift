// src/components/Challenges/ChallengeCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "../../styles/Challenges.css";

function ChallengeCard({ title, description, link }) {
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      navigate(link);
    }
  };

  return (
    <div
      className="challenge-card"
      onClick={() => navigate(link)}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="challenge-play">
        Play <ArrowRight size={15} />
      </span>
    </div>
  );
}

export default ChallengeCard;
