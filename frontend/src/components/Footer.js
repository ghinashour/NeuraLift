import React, { useState, useEffect } from "react";
import "../styles/Footer.css";
import { FaHeart, FaEnvelope, FaMapMarkerAlt, FaArrowCircleUp } from "react-icons/fa";

function Footer() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) { // show button after scrolling 200px
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* First Column */}
        <div className="footer-column">
          <div className="footer-logo">NeuraLift</div>
          <p className="footer-description">
            Transforming lives through mindful productivity and wellness. Join
            our community of individuals committed to personal growth
          </p>
          <div className="footer-heart">
            <FaHeart className="heart-icon" />
            <span>Made with love for your wellbeing</span>
          </div>
        </div>

        {/* Second Column */}
        <div className="footer-column">
          <div className="footer-title">Quick Links</div>
          <ul className="footer-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About us</a></li>
            <li><a href="#success">Success Stories</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* Third Column */}
        <div className="footer-column">
          <div className="footer-title">Resources</div>
          <ul className="footer-links">
            <li><a href="#help">Help Center</a></li>
            <li><a href="#community">Community Guidelines</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Services</a></li>
          </ul>
        </div>

        {/* Fourth Column */}
        <div className="footer-column">
          <div className="footer-title">Get in Touch</div>
          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <span>info.Neuralift@gmail.com</span>
          </div>
          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" />
            <span>Available worldwide</span>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="footer-bottom">
        <div className="left">
          © 2025 NeuraLift. All rights reserved.
        </div>
        <div className="right">
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#cookies">Cookies</a>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showButton && (
        <button className="scroll-top" onClick={scrollToTop}>
          <FaArrowCircleUp className="arrow-icon" />
        </button>
      )}
    </footer>
  );
}

export default Footer;