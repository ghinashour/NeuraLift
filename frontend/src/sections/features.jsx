import "../styles/features.css";
import { useNavigate } from "react-router-dom";

const PHOTOS = {
  tasks: require("../assets/new-design/feature-tasks.jpg"),
  focus: require("../assets/new-design/feature-focus.jpg"),
  schedule: require("../assets/new-design/feature-schedule.jpg"),
  health: require("../assets/new-design/feature-health.jpg"),
};

const hideBroken = (e) => { e.target.style.display = "none"; };

const Features = () => {
  const navigate = useNavigate();
  const go = (p) => () => navigate(p);
  return (
    <section id="Features" className="nl-features">
      <div className="wrap">
        <div className="nl-feat-head">
          <div>
            <p className="eyebrow">Features</p>
            <h2 className="serif nl-h2 left">
              Everything You Need
              <br />
              to Build <em>a Better You</em>
            </h2>
            <p className="nl-muted left">Productivity, wellness, and personal growth — all in one place.</p>
          </div>
          <div className="nl-leaf" aria-hidden="true">
            <svg viewBox="0 0 90 130" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M45 6 C45 55 45 95 45 124" />
              <path d="M45 26 C63 21 74 9 76 2 C60 3 49 13 45 26z" />
              <path d="M45 58 C27 53 16 41 14 27 C30 29 41 41 45 58z" />
              <path d="M45 92 C63 87 74 75 76 61 C60 63 49 75 45 92z" />
            </svg>
          </div>
        </div>

        <div className="nl-feat-list">
          <article className="nl-feat-row">
            <div className="nl-mock">
              <img className="nl-mock-photo" src={PHOTOS.tasks} alt="Task management preview" onError={hideBroken} />
              <div className="nl-mock-tint" />
            </div>
            <div className="nl-feat-copy">
              <span className="nl-num">01</span>
              <h3 className="serif">Task Management</h3>
              <p>Organize your day, set priorities, and get things done with a clean and simple interface.</p>
              <button className="link-arrow" onClick={go("/taskmanager")}>Learn more <span>→</span></button>
            </div>
          </article>

          <article className="nl-feat-row rev">
            <div className="nl-feat-copy">
              <span className="nl-num">02</span>
              <h3 className="serif">Focus Mode</h3>
              <p>Stay focused, eliminate distractions, and build better habits with a customizable focus timer.</p>
              <button className="link-arrow" onClick={go("/focustimer")}>Learn more <span>→</span></button>
            </div>
            <div className="nl-mock nl-mock-dark">
              <img className="nl-mock-photo" src={PHOTOS.focus} alt="Focus mode preview" onError={hideBroken} />
              <div className="nl-mock-tint" />
            </div>
          </article>

          <article className="nl-feat-row">
            <div className="nl-mock">
              <img className="nl-mock-photo" src={PHOTOS.schedule} alt="Schedule preview" onError={hideBroken} />
              <div className="nl-mock-tint" />
            </div>
            <div className="nl-feat-copy">
              <span className="nl-num">03</span>
              <h3 className="serif">Schedule</h3>
              <p>Plan your time, manage your events, and never miss what matters.</p>
              <button className="link-arrow" onClick={go("/schedule")}>Learn more <span>→</span></button>
            </div>
          </article>

          <article className="nl-feat-row rev" id="Pricing">
            <div className="nl-feat-copy">
              <span className="nl-num">04</span>
              <h3 className="serif">Health &amp; Medicine</h3>
              <p>Track your health, manage your medicine reminders, and take better care of yourself.</p>
              <button className="link-arrow" onClick={go("/medicinehealth")}>Learn more <span>→</span></button>
              <div className="nl-price">
                <strong>Free to start · Pro when you need it</strong>
                <span>Unlimited tasks, focus history, and health tracking on every plan.</span>
              </div>
            </div>
            <div className="nl-mock">
              <img className="nl-mock-photo" src={PHOTOS.health} alt="Health tracking preview" onError={hideBroken} />
              <div className="nl-mock-tint" />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Features;
