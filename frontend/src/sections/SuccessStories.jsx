import React from "react";
import "../styles/SuccessStories.css";
import quoteIcon from "../assets/quote.png";
import useSuccessStories from "../hooks/useSuccessStories";

const SuccessStories = () => {
  const { featuredStories, loading, error } = useSuccessStories();

  return (
    <section id="SuccessStories">
      <div className="section-success-stories">
        <h1>Success Stories</h1>
        <p className="success-section-description">
          Real people, real transformations. Discover how NeuraLift has helped
          thousands of users improve their mental health and achieve their
          goals.
        </p>

        <div className="success-divider"></div>

        <div className="success-stories-grid">
          {/* Featured stories from database */}
          {featuredStories.slice(0, 3).map((story) => (
            <div
              key={story._id || story.id}
              className="success-story-card success-shared-story"
            >
              <div className="success-quote-icon">
                <img src={quoteIcon} alt="Quote icon" />
              </div>
              <div className="success-rating-stars">★★★★★</div>
              <div className="success-testimonial-text">"{story.description}"</div>
              <div className="success-divider-small"></div>
              <div className="success-user-info">
                <div className="success-user-stats">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                      fill="white"
                    />
                  </svg>
                  {story.category}
                </div>
                <h3>{story.author}</h3>
                <p className="success-user-title">Community Member</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="loading-message">
              <p>Loading featured stories...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>Error loading stories: {error}</p>
            </div>
          )}

          {/* Jessica M. */}
          <div className="success-story-card">
            <div className="success-quote-icon">
              <img src={quoteIcon} alt="Quote icon" />
            </div>
            <div className="success-rating-stars">★★★★★</div>
            <div className="success-testimonial-text">
              "NeuraLift helped me overcome anxiety and boost my productivity.
              The combination of task management and mindfulness tools changed
              my entire approach to work-life balance."
            </div>
            {/*the space between the text as a line*/}
            <div className="success-divider-small"></div>

            <div className="success-user-info">
              <div className="success-user-stats">Reduced stress by 70%</div>
              <h3>Jessica M.</h3>
              <p className="success-user-title">Marketing Professional</p>
            </div>
          </div>

          {/* David L. */}
          <div className="success-story-card">
            <div className="success-quote-icon">
              <img src={quoteIcon} alt="Quote icon" />
            </div>
            <div className="success-rating-stars">★★★★★</div>
            <div className="success-testimonial-text">
              "As a student dealing with depression, Neural It's community
              support and daily motivation gave me the strength to continue. I'm
              now thriving academically and personally."
            </div>
            <div className="success-divider-small"></div>
            <div className="success-user-info">
              <p className="success-user-stats">Improved mood by 65%</p>
              <h3>David L.</h3>
              <p className="success-user-title">College Student</p>
            </div>
          </div>

          {/* Maria S. */}
          <div className="success-story-card">
            <div className="success-quote-icon">
              <img src={quoteIcon} alt="Quote icon" />
            </div>
            <div className="success-rating-stars">★★★★★</div>
            <div className="success-testimonial-text">
              "The creative canvas feature became my daily stress relief ritual.
              Drawing while listening to guided meditations helped me process
              difficult emotions and find clarity."
            </div>
            <div className="success-divider-small"></div>
            <div className="success-user-info">
              <p className="success-user-stats">Sleep enhanced</p>
              <h3>Maria S.</h3>
              <p className="success-user-title">Small Business Owner</p>
            </div>
          </div>

          {/* Robert K. */}
          <div className="success-story-card">
            <div className="success-quote-icon">
              <img src={quoteIcon} alt="Quote icon" />
            </div>
            <div className="success-rating-stars">★★★★★</div>
            <div className="success-testimonial-text">
              "Working in healthcare during tough times, Neural It's health
              tracking and wellness tools helped me maintain my own wellbeing
              while caring for others."
            </div>
            <div className="success-divider-small"></div>
            <div className="success-user-info">
              <p className="success-user-stats">75% less Anxiety</p>
              <h3>Robert K.</h3>
              <p className="success-user-title">Healthcare Worker</p>
            </div>
          </div>

          {/* Aisha T. */}
          <div className="success-story-card">
            <div className="success-quote-icon">
              <img src={quoteIcon} alt="Quote icon" />
            </div>
            <div className="success-rating-stars">★★★★★</div>
            <div className="success-testimonial-text">
              "Between work and parenting, I felt overwhelmed. Neural It's
              gentle reminders and quick meditation sessions fit perfectly into
              my busy schedule."
            </div>
            <div className="success-divider-small"></div>
            <div className="success-user-info">
              <p className="success-user-stats">Productivity increased </p>
              <h3>Aisha T.</h3>
              <p className="success-user-title">New Parent</p>
            </div>
          </div>

          {/* Chris W. */}
          <div className="success-story-card">
            <div className="success-quote-icon">
              <img src={quoteIcon} alt="Quote icon" />
            </div>
            <div className="success-rating-stars">★★★★★</div>
            <div className="success-testimonial-text">
              "After retiring, I felt lost and disconnected. Neural It's
              community features helped me find new purpose and connect with
              like-minded individuals on similar journeys."
            </div>
            <div className="success-divider-small"></div>
            <div className="success-user-info">
              <p className="success-user-stats">New social connections</p>
              <h3>Chris W.</h3>
              <p className="success-user-title">Retired Teacher</p>
            </div>
          </div>
        </div>

        <div className="success-stats-section">
          <h2>Join thousands of others transforming their lives</h2>
          <div className="success-stats-grid">
            <div className="success-stat-item">
              <div style={{ color: "#1BBB5E" }} className="success-stat-number">
                98%
              </div>
              <div className="success-stat-label"> Success Rate</div>
            </div>
            <div className="success-stat-item">
              <div style={{ color: "#3C8AF6" }} className="success-stat-number">
                4.9/5
              </div>
              <div className="success-stat-label">User Rating</div>
            </div>
            <div className="success-stat-item">
              <div style={{ color: "#895AF6" }} className="success-stat-number">
                10K+
              </div>
              <div className="success-stat-label">Lives Changed</div>
            </div>
            <div className="success-stat-item">
              <div style={{ color: "#1BBB5E" }} className="success-stat-number">
                30 Days
              </div>
              <div className="success-stat-label">See Results</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
