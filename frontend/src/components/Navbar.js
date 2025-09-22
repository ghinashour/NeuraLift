import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import logo from "../assets/NeuraLift.png";
import { Link } from "react-router-dom";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

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
          <a href="#Home" smooth={true} duration={600}>Home</a>
          <a href="#Features"smooth={true} duration={600}>Features</a>
          <a href="#About"smooth={true} duration={600}>About</a>
          <a href="#SuccessStories"smooth={true} duration={600}>Success Stories</a>
          <a href="#Contact"smooth={true} duration={600}>Contact</a>
        </ul>
         <Link to="/signup" className="get-started">
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;