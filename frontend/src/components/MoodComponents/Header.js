import React from "react";

const Header = () => {
    return (
        <header className="mood-header">
            <div className="title-row">
                <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M26.2433 18.6667C28.23 16.72 30.2433 14.3867 30.2433 11.3333C30.2433 9.38841 29.4707 7.52315 28.0955 6.14788C26.7202 4.77262 24.8549 4 22.91 4C20.5633 4 18.91 4.66667 16.91 6.66667C14.91 4.66667 13.2567 4 10.91 4C8.96508 4 7.09982 4.77262 5.72455 6.14788C4.34928 7.52315 3.57667 9.38841 3.57667 11.3333C3.57667 14.4 5.57667 16.7333 7.57667 18.6667L16.91 28L26.2433 18.6667Z" stroke="#3C83F6" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h1>Mood Tracker</h1>
            </div>
            <p>Track your emotional wellness and build healthy habits.</p>
        </header>
    );
};

export default Header;