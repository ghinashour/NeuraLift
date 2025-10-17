import React from "react";
import "../styles/Contact.css";
import { FaEnvelope, FaComments, FaPhone, FaPaperPlane } from "react-icons/fa";

function Contact() {
  return (
    <section id="Contact" className="contact-section">
      {/* Title */}
      <h2 className="contact-title">Get in Touch</h2>
      <p className="contact-subtitle">
        Have questions about NeuraLift? We'd love to hear from you. Send us a
        message and we'll respond as quickly as possible.
      </p>

      <div className="contact-grid">
        {/* Contact Form */}
        <div className="contact-form">
          <h3 className="form-title">Send us a Message</h3>

          <form>
            <div className="form-row">
              <div className="contact-form-group">
                <label>
                  First Name <span className="required">*</span>
                </label>
                <input
                  className="inputcolor"
                  type="text"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="contact-form-group">
                <label>
                  Email Address <span className="required">*</span>
                </label>
                <input
                  className="inputcolor"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "20px",
              }}
            >
              {" "}
              <label>Subject</label>
              <input
                className="inputcolor"
                type="text"
                placeholder="What's this about?"
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "20px",
              }}
            >
              <label>
                Message <span className="required">*</span>
              </label>
              <textarea
                style={{ height: "170px", marginBottom: "20px" }}
                className="inputcolor"
                placeholder="Tell us more about how we can help you"
                required
              ></textarea>
            </div>

            <button type="submit" className="send-button">
              <FaPaperPlane className="button-icon" />
              Send Message
            </button>
          </form>
        </div>

        {/* Other Ways to Reach Us */}
        <div className="contact-info">
          <h3 className="info-title">Other ways to Reach Us</h3>
          <p className="info-subtitle">
            We're here to help you on your wellness journey. Choose the method
            that works best for you to get in touch with our team.
          </p>

          {/* Card 1 - Email */}
          <div className="info-card">
            <div className="icon-box email">
              <FaEnvelope className="icon" />
            </div>
            <div>
              <h4>Email Support</h4>
              <p>Reach us by email for any inquiries</p>
              <span className="highlight">info.NeuraLift@gmail.com</span>
            </div>
          </div>

          {/* Card 2 - Live Chat */}
          <div className="info-card">
            <div className="icon-box chat">
              <FaComments className="icon" />
            </div>
            <div>
              <h4>Live Chat</h4>
              <p>Chat with us in real-time</p>
              <span className="highlight green">Available 24/7</span>
            </div>
          </div>

          {/* Card 3 - Phone */}
          <div className="info-card">
            <div className="icon-box phone">
              <FaPhone className="icon" />
            </div>
            <div>
              <h4>Phone Support</h4>
              <p>Speak directly with our team</p>
              <span className="highlight purple">+961 11111111</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
