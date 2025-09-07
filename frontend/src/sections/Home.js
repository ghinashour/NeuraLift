import React from "react";
import "../styles/Home.css"; // import CSS

const Home = () => {
  return (
    
    <section id="home" className="home-section">
      <div className="home-container">
        {/* Headline */}
        <h1 className="home-title">
          Transform Your Life with <span className="highlight">NeuraLift</span>
        </h1>


        {/* Tagline */}
        <p className="home-tagline">
          Manage tasks, get inspired with daily quotes, release stress through
          mindfulness and express creativity on our digital canvas – all in one
          powerful platform designed for your wellbeing.
        </p>

        {/* Buttons */}
        <div className="home-buttons">
          <button className="btn-primary">Get Started Today →</button>
          <button className="btn-secondary">Learn More</button>
        </div>

        {/* Stats */}
        <div className="home-stats">
          <div className="stat">
            <h2>10K+</h2>
            <p>Active Users</p>
          </div>
          <div className="stat">
            <h2>500+</h2>
            <p>Success Stories</p>
          </div>
          <div className="stat">
            <h2>95%</h2>
            <p>Satisfaction Rate</p>
          </div>
          <div className="stat">
            <h2>24/7</h2>
            <p>Community & Support</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
