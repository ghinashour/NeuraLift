import React from "react";

function Dice({ value, isHeld, toggleHold }) {
  return (
    <div 
      className={`die ${isHeld ? "held" : ""}`} 
      onClick={toggleHold}
    >
      {value}
    </div>
  );
}

export default Dice;
