import React from "react";
import Tenzies from "../../components/Challenges/Tenzis";

//you roll 10 dice 
//goal is to have all dice showing the same number
//you can hold to keep dice from rolling
//track roll count and best score
function TenzisGame() {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1 style={{ 
          fontSize: "2rem", 
          color: "#2c3e50", 
          marginBottom: "10px", 
          fontWeight: "bold" 
        }}>
          Tenzies Game
          </h1>
      <p         style={{ 
          fontSize: "1.1rem", 
          color: "#555", 
          marginBottom: "20px" 
        }}>
          Play the dice-based coding challenge here!
          </p>
      <Tenzies/>
    </div>
  );
}

export default TenzisGame;
