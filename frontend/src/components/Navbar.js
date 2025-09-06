import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import logo from "../assets/NeuraLift.png";

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
          <li><a href="#home">Home</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#success">Success Stories</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <button className="get-started">Get Started</button>
      </div>
    </nav>
  );
}

export default Navbar;