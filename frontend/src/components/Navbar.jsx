import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import logo from "../assets/NeuraLift.png";
import { Link } from "react-router-dom";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-content">
        <div className="logo">
          <img src={logo} alt="NeuraLift Logo" />
        </div>

        <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <li><a href="#Home" onClick={toggleMenu}>Home</a></li>
          <li><a href="#Features" onClick={toggleMenu}>Features</a></li>
          <li><a href="#About" onClick={toggleMenu}>About</a></li>
          <li><a href="#SuccessStories" onClick={toggleMenu}>Success Stories</a></li>
          <li><a href="#Contact" onClick={toggleMenu}>Contact</a></li>
        </ul>

        <div className="nav-right">
          {/* signing up the user */}
          <Link to="/signup" className="get-started" onClick={toggleMenu}>
            Get Started
          </Link>

          <div className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? (
              <svg className="menu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 18L18 6M6 6L18 18" stroke="#3C8AF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg className="menu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="#3C8AF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
