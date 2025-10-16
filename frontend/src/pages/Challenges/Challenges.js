// src/pages/Challenges.js
import React from "react";
import ChallengeCard from "../../components/Challenges/ChallengeCard";
import CategoryButton from "../../components/Challenges/CategoryButton";
import "../../styles/Challenges.css";

const svgIcon = (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FAFAFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="#FAFAFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="#FAFAFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>);
  
function Challenges() {
  return (
    <div className="challenges-container">
 
      <div className="header">
      <svg
    width="34"
    height="33"
    viewBox="0 0 34 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.48 29.3337C25.0739 29.3337 31.23 23.3641 31.23 16.0003C31.23 8.63653 25.0739 2.66699 17.48 2.66699C9.8861 2.66699 3.73001 8.63653 3.73001 16.0003C3.73001 23.3641 9.8861 29.3337 17.48 29.3337Z"
      stroke="#3C83F6"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.48 24C22.0364 24 25.73 20.4183 25.73 16C25.73 11.5817 22.0364 8 17.48 8C12.9237 8 9.23001 11.5817 9.23001 16C9.23001 20.4183 12.9237 24 17.48 24Z"
      stroke="#3C83F6"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.48 18.6663C18.9988 18.6663 20.23 17.4724 20.23 15.9997C20.23 14.5269 18.9988 13.333 17.48 13.333C15.9612 13.333 14.73 14.5269 14.73 15.9997C14.73 17.4724 15.9612 18.6663 17.48 18.6663Z"
      stroke="#3C83F6"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  <span className="title">Challenges</span>
  </div>

      <p className="subtitle"> Challenge Your Self Now!!</p>

      {/* Top Buttons */}
      <div className="button-row">
        <CategoryButton label="Easy Challenge" color="green" svg={svgIcon} />
        <CategoryButton label="Medium Challenge" color="yellow" svg={svgIcon} />
        <CategoryButton label="Hard Challenge" color="red" svg={svgIcon} />
      </div>

      <div className="button-row">
        <CategoryButton label="Coding" color="green-dark" />
        <CategoryButton label="Fun Quizzes" color="red-dark" />
      </div>

      {/* Cards Section */}
      <div className="cards-grid">
        <ChallengeCard
          title="Assembly Game"
          description="Guess the world is under it. Attempts to keep the programming world safe from Assembly!"
          link="/challenges/assembly-game"
       />
        <ChallengeCard
          title="True/False"
          description="Answer quick programming true or false questions."
          link="/challenges/true-false"
        />
        <ChallengeCard
          title="Tenzis Game"
          description="Play the dice-based coding challenge game."
          link="/challenges/tenzis-game"
        />
        <ChallengeCard
          title="Dev Questions"
          description="Challenge yourself with tricky developer questions."
          link="/challenges/dev-questions"
        />
      </div>
    </div>
  );
}

export default Challenges;
