import React from 'react';
import '../styles/ProgressSummary.css';

const ProgressSummary = ({ completedCount, remainingCount, totalCount, onProgressClick }) => {
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const CompletedIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 12L11 14L15 10" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    const RemainingIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    const ProgressIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M8 2V6" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 2V6" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 10H21" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    return (
        <div className="progress-summary">
            <div className="progress-item" onClick={onProgressClick}>
                <button className="progress-icon completed" aria-label="View detailed progress">
                    <CompletedIcon />
                </button>
                <div className="progress-details">
                    <div className="progress-number">{completedCount}</div>
                    <div className="progress-label">Completed</div>
                </div>
            </div>

            <div className="progress-item" onClick={onProgressClick}>
                <button className="progress-icon remaining" aria-label="View detailed progress">
                    <RemainingIcon />
                </button>
                <div className="progress-details">
                    <div className="progress-number">{remainingCount}</div>
                    <div className="progress-label">Remaining</div>
                </div>
            </div>

            <div className="progress-item" onClick={onProgressClick}>
                <button className="progress-icon percentage" aria-label="View detailed progress">
                    <ProgressIcon />
                </button>
                <div className="progress-details">
                    <div className="progress-number">{percentage}%</div>
                    <div className="progress-label">Progress</div>
                </div>
            </div>
        </div>
    );
};

export default ProgressSummary;