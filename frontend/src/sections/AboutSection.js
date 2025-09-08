import React from "react";
import "./AboutSection.css";

const AboutSection = () => {
  const founders = [
    {
      name: "Sarah Johnson",
      role: "Lead Developer & Co-Founder",
      description: "Full-stack developer with 8+ years experience in wellness tech. Passionate about creating user-centric applications that make a real difference in people's lives.",
      image: require("./images/Sarah Johnson - Lead Developer & Co-Founder.png"),
      roleClass: "role-badge-blue"
    },
    {
      name: "Dr. Michael Chen",
      role: "Wellness Expert & Advisor",
      description: "Licensed psychologist specializing in digital therapeutics. Michael ensures our app follows evidence-based practices for mental health and wellbeing.",
      image: require("./images/Dr. Michael Chen - Wellness Expert & Advisor.png"),
      roleClass: "role-badge-green"
    },
    {
      name: "Emily Rodriguez",
      role: "UX/UI Designer",
      description: "Award-winning designer focused on creating intuitive, accessible interfaces. Emily's designs help millions of users navigate their wellness journey effortlessly.",
      image: require("./images/UI Designer.png"),
      roleClass: "role-badge-purple"
    },
    {
      name: "Alex Thompson",
      role: "Backend Developer",
      description: "Infrastructure specialist ensuring NeuraLift scales seamlessly. Alex builds robust systems that keep our community connected and data secure.",
      image: require("./images/Alex Thompson - Backend Developer.png"),
      roleClass: "role-badge-blue"
    },
    {
      name: "Maya Patel",
      role: "Community Manager",
      description: "Community builder and wellness advocate. Maya fosters our supportive user community and ensures everyone feels heard and valued on their journey.",
      image: require("./images/Maya Patel - Community Manager.png"),
      roleClass: "role-badge-green"
    }
  ];

  return (
    <div className="founders-page">
      <div className="container">
        <div className="header-section">
          <h1 className="main-title">
            Meet Our Founders
          </h1>
          <p className="main-description">
            A passionate team of developers, designers, and wellness experts dedicated to
            transforming how people approach personal growth and mental health.
          </p>
        </div>

        <div className="founders-grid">
          {founders.map((founder, index) => (
            <div key={index} className="founder-card">
              <div className="image-container">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="founder-image"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=${founder.name.split(' ').map(n => n[0]).join('')}`;
                  }}
                />
              </div>

              <div className="card-content">
                <h3 className="founder-name">
                  {founder.name}
                </h3>

                <div className={`role-badge ${founder.roleClass}`}>
                  <span className="role-text">
                    {founder.role}
                  </span>
                </div>

                <p className="founder-description">
                  {founder.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutSection;