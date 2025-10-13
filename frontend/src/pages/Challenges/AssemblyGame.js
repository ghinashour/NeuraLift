import React from "react";
import AssemblyGameComponent from "../../components/Challenges/AssemblyGame1"; // Make sure this import matches your file structure
import '../../styles/Challenges/AssemblyGame.css'; // Ensure the CSS file is imported
function AssemblyGame() {
  return (
    <div style={{ padding: '20px' }} className="assembly-game-container">
      <center>
      <h1>Assembly Programming Challenge</h1>
      <p style={{color:"#fafafa"}}>Welcome to the Assembly challenge! Guess the programming language before all languages disappear! 🎮</p>
      </center>
      <AssemblyGameComponent />
    </div>
  );
}

export default AssemblyGame;