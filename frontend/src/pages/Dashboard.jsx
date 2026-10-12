import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Play,
  CalendarDays,
  Timer,
  CheckCheck,
  Flame,
  Heart,
  ChevronRight,
  ListChecks,
  Target,
  BarChart3,
  Activity,
  Sparkles,
} from "lucide-react";
import "../styles/Dashboard.css";

import Greeting from "../components/Greetings";
import InspirationSection from "../components/InspirationSection";
import useDashboardData from "../hooks/useDashboardData";
import { useTaskContext } from "../context/TaskContext";
import { getCurrentUser, getEvents, getMoods } from "../api/axios";
import AILogo from "../components/AiLogo";

/* ---------- helpers ---------- */
const sameDay = (a, b) => {
  const x = new Date(a);
  const y = new Date(b);
  return (
    x.getFullYear() === y.getFullYear() &&
    x.getMonth() === y.getMonth() &&
    x.getDate() === y.getDate()
  );
};

const startOfWeekMonday = (d = new Date()) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const dow = (x.getDay() + 6) % 7; // Mon=0
  x.setDate(x.getDate() - dow);
  return x;
};

const fmtTime = (iso) => {
  const d = new Date(iso);
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
};

const relTime = (iso) => {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso)) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
};

const PRIORITY_LABEL = { urgent: "Urgent", high: "High", medium: "Medium", low: "Low" };

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [moods, setMoods] = useState([]);
  const [query, setQuery] = useState("");

  const { tasks, toggleTask } = useTaskContext();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getCurrentUser();
        if (mounted) setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [ev, md] = await Promise.all([
          getEvents().catch(() => ({ data: [] })),
          getMoods().catch(() => []),
        ]);
        if (!mounted) return;
        setEvents(Array.isArray(ev?.data) ? ev.data : []);
        setMoods(Array.isArray(md) ? md : Array.isArray(md?.data) ? md.data : []);
      } catch (err) {
        console.error("Failed to fetch dashboard extras:", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const { greeting, streak, notifications } = useDashboardData(user?._id);
  void greeting;

  const safeTasks = useMemo(() => (Array.isArray(tasks) ? tasks : []), [tasks]);
  const openTasks = useMemo(
    () => safeTasks.filter((t) => !t.completed),
    [safeTasks]
  );
  const doneTasks = useMemo(
    () => safeTasks.filter((t) => t.completed),
    [safeTasks]
  );
  const todayDone = useMemo(() => {
    const now = new Date();
    return doneTasks.filter((t) => t.updatedAt && sameDay(t.updatedAt, now)).length;
  }, [doneTasks]);

  const focusTask = useMemo(() => {
    const prioRank = { urgent: 0, high: 1, medium: 2, low: 3 };
    return [...openTasks].sort((a, b) => {
      const ad = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bd = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      if (ad !== bd) return ad - bd;
      return (prioRank[a.priority] ?? 2) - (prioRank[b.priority] ?? 2);
    })[0];
  }, [openTasks]);

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = openTasks.slice(0, 6);
    if (!q) return { list, filtering: false };
    return {
      list: openTasks
        .filter(
          (t) =>
            (t.title || "").toLowerCase().includes(q) ||
            (t.description || "").toLowerCase().includes(q)
        )
        .slice(0, 6),
      filtering: true,
    };
  }, [openTasks, query]);

  const todayEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter((e) => e.startDate && sameDay(e.startDate, now))
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 5);
  }, [events]);

  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  const weekBars = useMemo(() => {
    const start = startOfWeekMonday();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
    const counts = days.map(
      (d) =>
        doneTasks.filter((t) => t.updatedAt && sameDay(t.updatedAt, d)).length
    );
    const prevStart = new Date(start);
    prevStart.setDate(prevStart.getDate() - 7);
    const prevEnd = new Date(start);
    const prevTotal = doneTasks.filter((t) => {
      if (!t.updatedAt) return false;
      const u = new Date(t.updatedAt);
      return u >= prevStart && u < prevEnd;
    }).length;
    const total = counts.reduce((a, b) => a + b, 0);
    const delta =
      prevTotal === 0 ? (total > 0 ? 100 : 0) : Math.round(((total - prevTotal) / prevTotal) * 100);
    return { days, counts, total, delta, max: Math.max(1, ...counts) };
  }, [doneTasks]);

  const todayMood = useMemo(() => {
    const now = new Date();
    const todays = moods.filter((m) => m.date && sameDay(m.date, now));
    return todays.length ? todays[todays.length - 1] : null;
  }, [moods]);

  const weekMoodCount = useMemo(() => {
    const start = startOfWeekMonday();
    return moods.filter((m) => m.date && new Date(m.date) >= start).length;
  }, [moods]);

  const recentActivity = useMemo(
    () =>
      [...safeTasks]
        .filter((t) => t.updatedAt)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 6)
        .map((t) => ({
          id: t._id,
          text: t.completed ? `Completed "${t.title}"` : `Updated "${t.title}"`,
          kind: t.completed ? "done" : "updated",
          when: relTime(t.updatedAt),
        })),
    [safeTasks]
  );

  const total = safeTasks.length;
  const done = doneTasks.length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  if (loading) return <div className="dashboard-page">Loading...</div>;

  return (
    <div className="dashboard-page dash">
      {/* Header: greeting + live task search */}
      <header className="dash-head">
        <div className="dash-head-copy">
          {user && <Greeting name={user.username} userId={user._id} />}
        </div>
        <div className="dash-search" role="search">
          <Search size={15} aria-hidden="true" />
          <input
            type="search"
            placeholder="Search tasks, notes, or anything…"
            aria-label="Search tasks, notes, or anything"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="dash-grid">
        {/* Today's focus */}
        <section className="dash-card dash-focus" aria-label="Today's focus">
          <p className="dash-eyebrow">Today&rsquo;s focus</p>
          {focusTask ? (
            <>
              <h2 className="dash-focus-title">
                {focusTask.title}{" "}
                <span className="dash-chip">
                  {PRIORITY_LABEL[focusTask.priority] || "Medium"}
                </span>
              </h2>
              <p className="dash-muted">
                {focusTask.description ||
                  (focusTask.category
                    ? `Filed under ${focusTask.category}.`
                    : "Your most pressing open task.")}
                {focusTask.dueDate &&
                  ` Due ${new Date(focusTask.dueDate).toLocaleDateString()}.`}
              </p>
              <button
                type="button"
                className="dash-btn"
                onClick={() => navigate("/focustimer")}
              >
                <Play size={15} /> Start Focus Session
              </button>
            </>
          ) : (
            <>
              <h2 className="dash-focus-title">All clear</h2>
              <p className="dash-muted">
                No open tasks. Add one to set today&rsquo;s focus.
              </p>
              <button
                type="button"
                className="dash-btn"
                onClick={() => navigate("/taskmanager")}
              >
                <Play size={15} /> Go to Tasks
              </button>
            </>
          )}
        </section>

        {/* Quote */}
        <div className="dash-quote">
          <InspirationSection />
        </div>

        {/* Schedule */}
        <section className="dash-card dash-schedule" aria-label="Today's schedule">
          <div className="dash-card-top">
            <h2 className="dash-h2">
              <CalendarDays size={15} aria-hidden="true" /> Today&rsquo;s Schedule
            </h2>
            <span className="dash-muted-sm">{todayStr}</span>
          </div>
          {todayEvents.length === 0 ? (
            <p className="dash-muted-sm">Nothing scheduled today.</p>
          ) : (
            <ul className="dash-sched-list">
              {todayEvents.map((e) => (
                <li key={e._id}>
                  <span className="dash-sched-time">{fmtTime(e.startDate)}</span>
                  <span className="dash-sched-dot" style={{ background: e.color || "#b79ced" }} aria-hidden="true" />
                  <span className="dash-sched-title">{e.title}</span>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            className="dash-link"
            onClick={() => navigate("/schedule")}
          >
            View Full Schedule <ChevronRight size={14} />
          </button>
        </section>

        {/* Stat chips */}
        <section className="dash-card dash-chip-stat" aria-label="Today's tasks">
          <CheckCheck size={17} aria-hidden="true" />
          <div>
            <p className="dash-stat-val">
              {todayDone}/{total} <span>today</span>
            </p>
            <div className="dash-bar" role="img" aria-label={`${pct}% of all tasks completed`}>
              <span style={{ width: `${pct}%` }} />
            </div>
          </div>
        </section>

        <section className="dash-card dash-chip-stat" aria-label="Completion rate">
          <Target size={17} aria-hidden="true" />
          <div>
            <p className="dash-stat-val">
              {pct}% <span>completed</span>
            </p>
            <div className="dash-bar" role="img" aria-label={`${done} of ${total} tasks completed`}>
              <span style={{ width: `${pct}%` }} />
            </div>
          </div>
        </section>

        <section className="dash-card dash-chip-stat" aria-label="Day streak">
          <Flame size={17} aria-hidden="true" />
          <div>
            <p className="dash-stat-val">
              {streak} <span>day streak</span>
            </p>
            <p className="dash-muted-sm">
              {notifications?.length || 0} unread updates
            </p>
          </div>
        </section>

        {/* Mini focus timer */}
        <section className="dash-card dash-timer" aria-label="Focus timer shortcut">
          <div className="dash-card-top">
            <h2 className="dash-h2">
              <Timer size={15} aria-hidden="true" /> Focus Timer
            </h2>
            <span className="dash-muted-sm">Focus Mode</span>
          </div>
          <div className="dash-mini-ring" role="img" aria-label="25 minute focus session ready">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="52" className="dash-ring-track" />
              <circle cx="60" cy="60" r="52" className="dash-ring-ticks" />
            </svg>
            <div className="dash-mini-center">
              <strong>25:00</strong>
              <span>Deep Work</span>
            </div>
          </div>
          <button
            type="button"
            className="dash-btn dash-btn-block"
            onClick={() => navigate("/focustimer")}
          >
            <Play size={15} /> Start Session
          </button>
        </section>

        {/* My tasks */}
        <section className="dash-card dash-tasks" aria-label="My tasks">
          <div className="dash-card-top">
            <h2 className="dash-h2">
              <ListChecks size={15} aria-hidden="true" /> My Tasks
            </h2>
            <button
              type="button"
              className="dash-link"
              onClick={() => navigate("/taskmanager")}
            >
              View all <ChevronRight size={14} />
            </button>
          </div>
          {filteredTasks.list.length === 0 ? (
            <p className="dash-muted-sm">
              {filteredTasks.filtering
                ? `No tasks match "${query}".`
                : "No open tasks — enjoy the calm."}
            </p>
          ) : (
            <ul className="dash-task-list">
              {filteredTasks.list.map((t) => (
                <li key={t._id}>
                  <button
                    type="button"
                    className="dash-check"
                    role="checkbox"
                    aria-checked="false"
                    aria-label={`Mark ${t.title} complete`}
                    onClick={() => toggleTask(t._id)}
                  />
                  <span className="dash-task-title">{t.title}</span>
                  <span className={`dash-prio dash-prio-${t.priority || "medium"}`}>
                    {PRIORITY_LABEL[t.priority] || "Medium"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Progress donut */}
        <section className="dash-card dash-progress" aria-label="Project progress">
          <div className="dash-card-top">
            <h2 className="dash-h2">
              <BarChart3 size={15} aria-hidden="true" /> Task Progress
            </h2>
            <span className="dash-muted-sm">{total} total</span>
          </div>
          <div className="dash-donut-wrap">
            <svg viewBox="0 0 120 120" role="img" aria-label={`${pct}% of tasks completed`}>
              <circle cx="60" cy="60" r="52" className="dash-ring-track" />
              <circle
                cx="60"
                cy="60"
                r="52"
                className="dash-ring-prog"
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={2 * Math.PI * 52 * (1 - pct / 100)}
              />
            </svg>
            <div className="dash-mini-center">
              <strong>{pct}%</strong>
              <span>Completed</span>
            </div>
          </div>
          <ul className="dash-legend">
            <li>
              <span className="dash-dot dash-dot-done" aria-hidden="true" /> Completed
              <strong>{done}</strong>
            </li>
            <li>
              <span className="dash-dot dash-dot-open" aria-hidden="true" /> Open
              <strong>{openTasks.length}</strong>
            </li>
          </ul>
          <button
            type="button"
            className="dash-link"
            onClick={() => navigate("/taskmanager")}
          >
            View Tasks <ChevronRight size={14} />
          </button>
        </section>

        {/* Weekly activity */}
        <section className="dash-card dash-weekly" aria-label="Weekly completions">
          <div className="dash-card-top">
            <h2 className="dash-h2">
              <Activity size={15} aria-hidden="true" /> Weekly Completions
            </h2>
          </div>
          <p className="dash-big">
            {weekBars.total}{" "}
            <span className={weekBars.delta >= 0 ? "dash-up" : "dash-down"}>
              {weekBars.delta >= 0 ? "+" : ""}
              {weekBars.delta}% vs last week
            </span>
          </p>
          <div className="dash-bars" role="img" aria-label={`Tasks completed per day: ${weekBars.days.map((d, i) => `${"MTWTFSS"[i]} ${weekBars.counts[i]}`).join(", ")}`}>
            {weekBars.days.map((d, i) => (
              <div className="dash-bar-col" key={d.toISOString()} aria-hidden="true">
                <span className="dash-bar-val">{weekBars.counts[i]}</span>
                <div className="dash-bar-track">
                  <span
                    style={{
                      height: `${Math.round((weekBars.counts[i] / weekBars.max) * 100)}%`,
                    }}
                  />
                </div>
                <span className="dash-bar-day">{"MTWTFSS"[i]}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Streak */}
        <section className="dash-card dash-streak" aria-label="Development streak">
          <Flame size={22} aria-hidden="true" />
          <p className="dash-big">{streak}</p>
          <p className="dash-h2">day streak</p>
          <p className="dash-muted-sm">Keep it going — check in daily.</p>
        </section>

        {/* Wellness */}
        <section className="dash-card dash-wellness" aria-label="Health and wellness">
          <div className="dash-card-top">
            <h2 className="dash-h2">
              <Heart size={15} aria-hidden="true" /> Health &amp; Wellness
            </h2>
          </div>
          <div className="dash-tiles">
            <div className="dash-tile">
              <strong>{todayMood ? todayMood.mood : "—"}</strong>
              <span>Mood today</span>
            </div>
            <div className="dash-tile">
              <strong>{weekMoodCount}</strong>
              <span>Check-ins{weekMoodCount === 1 ? "" : " this week"}</span>
            </div>
            <div className="dash-tile">
              <strong>{todayDone}</strong>
              <span>Done today</span>
            </div>
          </div>
          <button
            type="button"
            className="dash-link"
            onClick={() => navigate("/moodtracker")}
          >
            Open Mood Tracker <ChevronRight size={14} />
          </button>
        </section>

        {/* Recent activity */}
        <section className="dash-card dash-activity" aria-label="Recent activity">
          <div className="dash-card-top">
            <h2 className="dash-h2">
              <Sparkles size={15} aria-hidden="true" /> Recent Activity
            </h2>
            <button
              type="button"
              className="dash-link"
              onClick={() => navigate("/taskmanager")}
            >
              View all <ChevronRight size={14} />
            </button>
          </div>
          {recentActivity.length === 0 ? (
            <p className="dash-muted-sm">No activity yet — tasks you touch will show up here.</p>
          ) : (
            <ul className="dash-act-list">
              {recentActivity.map((a) => (
                <li key={a.id}>
                  <span className={`dash-dot dash-dot-${a.kind}`} aria-hidden="true" />
                  <span className="dash-task-title">{a.text}</span>
                  <span className="dash-muted-sm">{a.when}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div
        style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}
      >
        <AILogo />
      </div>
    </div>
  );
}

export default Dashboard;
