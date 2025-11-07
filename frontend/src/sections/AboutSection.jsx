import React from "react";
import "../styles/AboutSection.css";


const AboutSection = () => {
  const founders = [
    {
      name: "Ghina Shour",
      role: "Lead Developer & Team Manager",
      description: "Full-stack developer with 2+ experience in wellness tech. Passionate about creating user-centric applications that make a real difference in people's lives.",
      image: require("../assets/ghina.png"),
      roleClass: "about-role-badge-blue"
    },
    {
      name: "Hassan Ramadan",
      role: "Frontend Developer",
      description: "Creative frontend engineer specializing in responsive, accessible designs. Hassan crafts engaging user experiences that drive wellness and personal growth.",
      image: require("../assets/hassan.png"),
      roleClass: "about-role-badge-green"
    },
    {
      name: "Yara Eslim",
      role: "UX/UI Designer and backend Developer",
      description: "Award-winning designer focused on creating intuitive, accessible interfaces. Yara's designs help millions of users navigate their wellness journey effortlessly.",
      image: require("../assets/yara.png"),
      roleClass: "about-role-badge-purple"
    },
    {
      name: "Omar Moussa",
      role: "Ai Developer",
      description: "AI specialist with a passion for mental health tech. Omar develops intelligent systems that provide personalized support and enhance user well-being.",
      image: require("../assets/omar.png"),
      roleClass: "about-role-badge-blue"
    },
    {
      name: "Mohammad Zein",
      role: "Frontend Developer",
      description: "Skilled frontend developer dedicated to building seamless, user-friendly applications. Mohammad focuses on creating engaging digital experiences that promote mental wellness.",
      image: require("../assets/mhmd.png"),
      roleClass: "about-role-badge-green"
    }
  ];

  return (
    <section id="About" className="about-section">
      <div className="about-founders-page">
        <div className="about-container">
          <div className="about-header-section">
            <h1 className="about-main-title">
              Meet Our Founders
            </h1>
            <p className="about-main-description">
              A passionate team of developers, designers, and wellness experts dedicated to
              transforming how people approach personal growth and mental health.
            </p>
          </div>

          <div className="about-founders-grid">
            {founders.map((founder, index) => (
              <div key={index} className="about-founder-card">
                <div className="image-container">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="about-founder-image"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=${founder.name.split(' ').map(n => n[0]).join('')}`;
                    }}
                  />
                </div>

                <div className="about-card-content">
                  <h3 className="about-founder-name">
                    {founder.name}
                  </h3>

                  <div className={`about-role-badge ${founder.roleClass}`}>
                    <span className="about-role-text">
                      {founder.role}
                    </span>
                  </div>

                  <p className="about-founder-description">
                    {founder.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;