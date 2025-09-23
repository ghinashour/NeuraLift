import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import logo from "../assets/NeuraLift.png";
import { Link } from "react-router-dom";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-content">
        <div className="logo">
          <img src={logo} alt="NeuraLift Logo" />
        </div>

        <ul className="nav-links">
          <li><a href="#Home">Home</a></li>
          <li><a href="#Features">Features</a></li>
          <li><a href="#About">About</a></li>
          <li><a href="#SuccessStories">Success Stories</a></li>
          <li><a href="#Contact">Contact</a></li>
        </ul>

        {/* signing up the user */}
        <Link to="/signup" className="get-started">
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
