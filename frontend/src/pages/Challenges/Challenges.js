// src/pages/Challenges.js
import React from "react";
import ChallengeCard from "../../components/Challenges/ChallengeCard";
import CategoryButton from "../../components/Challenges/CategoryButton";
import AILogo from '../../components/AiLogo';

import "../../styles/Challenges.css";

const svgIcon = (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>);

function Challenges() {
  return (
    <div className="nl-page challenges-page">

      <div className="nl-hero">
        <div className="nl-hero-copy">
          <p className="nl-eyebrow">Challenges</p>
          <h1 className="nl-title">
            Challenge yourself,
            <br />grow <em>every day</em>.
          </h1>
          <p className="nl-lede">
            Pick a game below — quick quizzes, dice challenges, and dev trivia
            to keep your mind sharp and your streak alive.
          </p>
        </div>
        <p className="nl-hero-quote">“A little challenge makes the day brighter.”</p>
      </div>

      {/* Top Buttons */}
      <div className="button-row" role="group" aria-label="Challenge difficulty">
        <CategoryButton label="Easy Challenge" color="green" svg={svgIcon} />
        <CategoryButton label="Medium Challenge" color="yellow" svg={svgIcon} />
        <CategoryButton label="Hard Challenge" color="red" svg={svgIcon} />
      </div>

      <div className="button-row" role="group" aria-label="Challenge type">
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
              title="Tenzis (Solo)"
              description="Quick solo dice game (new)."
              link="/challenges/tenzis-solo"
            />
            <ChallengeCard
              title="Leaderboard"
              description="See top players for games."
              link="/challenges/leaderboard"
            />
            <ChallengeCard
              title="Code Quiz"
              description="Short developer quiz - answer to score points."
              link="/challenges/code-quiz"
            />
        <ChallengeCard
          title="Dev Questions"
          description="Challenge yourself with tricky developer questions."
          link="/challenges/dev-questions"
        />
      </div>
       <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <AILogo />
      </div>
    </div>
  );
}

export default Challenges;
