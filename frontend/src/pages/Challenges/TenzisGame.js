import React from "react";
import Tenzies from "../../components/Challenges/Tenzis";

//you roll 10 dice 
//goal is to have all dice showing the same number
//you can hold to keep dice from rolling
//track roll count and best score
function TenzisGame() {
  return (
    <div>
      <h1>Tenzis Game</h1>
      <p>Play the dice-based coding challenge here!</p>
      <Tenzies/>
    </div>
  );
}

export default TenzisGame;
