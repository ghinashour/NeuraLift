import React from 'react';
import { useNavigate } from 'react-router-dom';
import IcAI from '../assets/Ellipse.svg';
import '../styles/FloatingLogo.css';

const FloatingLogo = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    };

    return (
        <button
            className="floating-logo"
            onClick={handleClick}
            aria-label="Go to dashboard"
        >
            <img src={IcAI} alt="NeuraLift" className="floating-logo-icon" />
        </button>
    );
};

export default FloatingLogo;
