import React from "react";

const StressSelector = ({isStressed, onStressChange}) =>{
    return (
         <div className="stress-selector">
            <div className="stress-options">
                <button className={`stress-option ${isStressed === false ? 'selected' : ''}`} onClick={() => onStressChange(false)}>
                    🤩 No
                </button>
                <button 
                    className={`stress-option ${isStressed === true ? 'selected' : ''}`}
                    onClick={() => onStressChange(true)}
                >
                    🥲 Yes
                </button>
            </div>
        </div>
    )
}

export default StressSelector;