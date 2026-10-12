import React from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

const AVATARS = [
  { img: require("../assets/team-ghina.jpg"), initials: "G" },
  { img: require("../assets/team-hassan.jpg"), initials: "H" },
  { img: require("../assets/team-yara.jpg"), initials: "Y" },
  { img: require("../assets/team-omar.jpg"), initials: "O" },
  { img: require("../assets/team-mhmd.jpg"), initials: "M" },
];

const TOOLS = [
  {
    title: "Tasks",
    desc: "Get things done with ease.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 19C5 10 12 5 20 5c0 8-4 14-13 14" />
        <path d="M5 19c3-5.5 7-9.5 11-11" />
      </svg>
    ),
  },
  {
    title: "Schedule",
    desc: "Plan your day and stay on track.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="5.5" width="16" height="14" rx="2.5" />
        <path d="M4 10.5h16M8.5 3v4M15.5 3v4" />
      </svg>
    ),
  },
  {
    title: "Focus",
    desc: "Build deeper focus and better habits.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Health",
    desc: "Track your wellness and medicine.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20.5C7 16 3.5 12.8 3.5 9.2 3.5 6.6 5.5 5 7.9 5c1.6 0 3 .9 4.1 2.3C13.1 5.9 14.5 5 16.1 5c2.4 0 4.4 1.6 4.4 4.2 0 3.6-3.5 6.8-8.5 11.3z" />
      </svg>
    ),
  },
  {
    title: "Motivation",
    desc: "Stay inspired every day.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.5l2.1 5.6 6 .4-4.6 3.8 1.5 5.9-5-3-5 3 1.5-5.9L3.9 9.5l6-.4z" />
      </svg>
    ),
  },
  {
    title: "Success Board",
    desc: "Celebrate your progress.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M4 20h16" />
        <path d="M7.5 20v-6M12 20V7M16.5 20v-9" />
      </svg>
    ),
  },
];

const CHECKS = [
  "Stay organized and focused",
  "Track your health and medicine",
  "Get personalized AI support",
  "Build better habits",
  "Celebrate your achievements",
];

const HERO_PHOTO = require("../assets/new-design/hero-desk.jpg");
const PLATFORM_PHOTO = require("../assets/new-design/platform-journal.jpg");

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <section id="Home" className="nl-hero">
        <div className="nl-hero-photo" aria-hidden="true">
          <img
            src={HERO_PHOTO}
            alt=""
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <div className="nl-hero-shade" />
        </div>

        <div className="wrap nl-hero-grid">
          <div className="nl-hero-copy">
            <p className="eyebrow">Your productivity &amp; wellness companion</p>
            <h1 className="serif nl-h1">
              A Calmer Mind
              <br />
              <em>A More Productive You</em>
            </h1>
            <p className="nl-sub">
              Neuralift combines productivity, wellness, and AI guidance to help
              you stay organized, build better habits, and become the best
              version of yourself.
            </p>
            <div className="nl-hero-cta">
              <button className="btn-dark" onClick={() => navigate("/signup")}>
                Get Started Free <span aria-hidden="true">→</span>
              </button>
              <a className="btn-ghost" href="#Features">
                <span className="nl-play" aria-hidden="true">
                  <svg viewBox="0 0 12 12" width="11" height="11">
                    <path d="M3 1.8v8.4L10 6z" fill="currentColor" />
                  </svg>
                </span>
                Watch Video
              </a>
            </div>
            <div className="nl-social">
              <div className="nl-avatars">
                {AVATARS.map((a) => (
                  <span key={a.initials}>
                    {a.initials}
                    <img
                      src={a.img}
                      alt=""
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </span>
                ))}
              </div>
              <p>
                <strong>Join 5,000+ users</strong>
                <br />
                building a healthier, more focused life.
              </p>
            </div>
          </div>

          <div className="nl-hero-visual" aria-hidden="true">
            <div className="nl-notes">
              Focus
              <br />
              Plan
              <br />
              Grow
              <br />
              Feel Better
            </div>
          </div>
        </div>

        <svg className="nl-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0,58 C220,105 460,5 720,42 C980,79 1210,100 1440,48 L1440,90 L0,90 Z"
          />
        </svg>
      </section>

      <section className="nl-tools">
        <div className="wrap nl-tools-inner">
          <p className="eyebrow">All your essential tools in one place</p>
          <h2 className="serif nl-h2">Less Overwhelm. More You.</h2>
          <p className="nl-muted">
            From tasks and schedules to health tracking and motivation,
            Neuralift brings everything together so you can focus on what really matters.
          </p>
          <div className="nl-tools-grid">
            {TOOLS.map((t) => (
              <div key={t.title} className="nl-tool">
                <div className="nl-tool-icon">{t.icon}</div>
                <strong>{t.title}</strong>
                <span>{t.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="About" className="nl-platform">
        <div className="wrap">
          <div className="nl-platform-grid">
            <div className="nl-platform-photo" aria-hidden="true">
              <img
                src={PLATFORM_PHOTO}
                alt=""
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div className="nl-platform-card">
                <p className="serif">
                  Ship Code
                  <br />
                  Stay Balanced
                </p>
                <ul>
                  <li>Deep Focus</li>
                  <li>Clean Sprints</li>
                  <li>Healthy Habits</li>
                  <li>Steady Growth</li>
                </ul>
              </div>
            </div>
            <div className="nl-platform-copy">
              <p className="eyebrow">More than a to-do list</p>
              <h2 className="serif nl-h2 left">
                A Platform That
                <br />
                Supports Your Whole Self
              </h2>
              <p className="nl-muted left">
                Neuralift is designed to help you balance productivity, wellness,
                and personal growth — with the power of AI by your side.
              </p>
              <ul className="nl-checks">
                {CHECKS.map((c) => (
                  <li key={c}>
                    <span className="nl-check" aria-hidden="true">
                      <svg viewBox="0 0 12 12" width="11" height="11">
                        <path
                          d="M2 6.4L4.8 9 10 3.4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
              <a className="btn-dark" href="#Features">
                Explore Features <span aria-hidden="true">→</span>
              </a>
              <div className="nl-leaf-line" aria-hidden="true">
                <svg viewBox="0 0 60 120" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M30 8 C30 50 30 80 30 112" />
                  <path d="M30 30 C44 26 52 16 54 4 C40 6 32 16 30 30z" />
                  <path d="M30 58 C16 54 8 44 6 32 C20 34 28 44 30 58z" />
                  <path d="M30 88 C44 84 52 74 54 62 C40 64 32 74 30 88z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
