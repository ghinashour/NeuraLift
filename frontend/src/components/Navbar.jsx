import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav className={`nl-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nl-nav-inner">
        <div className="nl-brand" onClick={() => navigate("/")} style={{cursor:"pointer"}}>
          <span className="nl-mark" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 2C10 7 6 9 6 15a8 8 0 0 0 16 0c0-6-4-8-8-13Z" fill="#8E7FB8"/>
              <path d="M14 6v16M14 12l-5-3M14 12l5-3M14 17l-4-2M14 17l4-2" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="nl-name">Neuralift</span>
        </div>

        <ul className={`nl-links ${open ? "open" : ""}`}>
          <li><a href="#Home" className="active" onClick={()=>setOpen(false)}>Home</a></li>
          <li><a href="#Features" onClick={()=>setOpen(false)}>Features</a></li>
          <li><a href="#About" onClick={()=>setOpen(false)}>About</a></li>
          <li><a href="#Pricing" onClick={()=>setOpen(false)}>Pricing</a></li>
        </ul>

        <div className="nl-actions">
          <Link to="/login" className="nl-login">Log in</Link>
          <Link to="/signup" className="btn-dark nl-cta">Get Started <span aria-hidden>→</span></Link>
          <button className="nl-burger" onClick={()=>setOpen(!open)} aria-label="menu">
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
