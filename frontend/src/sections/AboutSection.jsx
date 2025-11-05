import React from "react";
import "../styles/AboutSection.css";


const AboutSection = () => {
  const founders = [
    {
      name: "Sarah Johnson",
      role: "Lead Developer & Co-Founder",
      description: "Full-stack developer with 8+ years experience in wellness tech. Passionate about creating user-centric applications that make a real difference in people's lives.",
      image: require("../assets/sarah.png"),
      roleClass: "about-role-badge-blue"
    },
    {
      name: "Dr. Michael Chen",
      role: "Wellness Expert & Advisor",
      description: "Licensed psychologist specializing in digital therapeutics. Michael ensures our app follows evidence-based practices for mental health and wellbeing.",
      image: require("../assets/michael.png"),
      roleClass: "about-role-badge-green"
    },
    {
      name: "Emily Rodriguez",
      role: "UX/UI Designer",
      description: "Award-winning designer focused on creating intuitive, accessible interfaces. Emily's designs help millions of users navigate their wellness journey effortlessly.",
      image: require("../assets/Emily.png"),
      roleClass: "about-role-badge-purple"
    },
    {
      name: "Alex Thompson",
      role: "Backend Developer",
      description: "Infrastructure specialist ensuring NeuraLift scales seamlessly. Alex builds robust systems that keep our community connected and data secure.",
      image: require("../assets/alex.png"),
      roleClass: "about-role-badge-blue"
    },
    {
      name: "Maya Patel",
      role: "Community Manager",
      description: "Community builder and wellness advocate. Maya fosters our supportive user community and ensures everyone feels heard and valued on their journey.",
      image: require("../assets/maya.png"),
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