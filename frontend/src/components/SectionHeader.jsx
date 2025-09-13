import React from 'react';
import '../styles/SectionHeader.css';

const SectionHeader = ({ title, subtitle, action }) => {
    return (
        <div className="section-header">
            <div className="section-titles">
                <h2 className="section-title">{title}</h2>
                {subtitle && <p className="section-subtitle">{subtitle}</p>}
            </div>
            {action && <div className="section-action">{action}</div>}
        </div>
    );
};

export default SectionHeader;


