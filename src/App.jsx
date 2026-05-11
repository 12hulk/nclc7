import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import Onboarding from "./pages/Onboarding";

const STORAGE_KEY = "nclc7_user";

export default function App() {
  const [page, setPage] = useState("loading");
  const [userData, setUserData] = useState(null);

  // On mount — check if user has already done assessment
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setUserData(parsed);
        setPage("dashboard"); // returning user → straight to dashboard
      } else {
        setPage("landing"); // new user → show landing page
      }
    } catch {
      setPage("landing");
    }
  }, []);

  const handleStartAssessment = () => {
    setPage("onboarding");
  };

  const handleOnboardingComplete = (data) => {
    const enriched = {
      ...data,
      joinedAt: new Date().toISOString(),
      streak: 1,
      lastVisit: new Date().toISOString(),
      completedExercises: [],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));
    setUserData(enriched);
    setPage("dashboard");
  };

  const handleRetakeAssessment = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUserData(null);
    setPage("onboarding");
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUserData(null);
    setPage("landing");
  };

  // Update streak on every dashboard visit
  useEffect(() => {
    if (page === "dashboard" && userData) {
      const today = new Date().toDateString();
      const lastVisit = userData.lastVisit
        ? new Date(userData.lastVisit).toDateString()
        : null;

      if (lastVisit !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const wasYesterday = lastVisit === yesterday.toDateString();

        const updated = {
          ...userData,
          lastVisit: new Date().toISOString(),
          streak: wasYesterday ? (userData.streak || 0) + 1 : 1,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setUserData(updated);
      }
    }
  }, [page]);

  if (page === "loading") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#faf6ef",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 28,
        fontWeight: 700,
        color: "#b8893a",
      }}>
        NCLC<span style={{ color: "#0c1420" }}>7</span>
      </div>
    );
  }

  if (page === "landing") {
    return <LandingPage onStartAssessment={handleStartAssessment} />;
  }

  if (page === "onboarding") {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (page === "dashboard") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#faf6ef",
        fontFamily: "'Outfit', sans-serif",
        color: "#0c1420",
      }}>

        {/* Nav */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 40px",
          borderBottom: "1px solid #e8dfd0",
          background: "rgba(250,246,239,.92)",
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: "#0c1420" }}>
            NCLC<span style={{ color: "#b8893a" }}>7</span>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ fontSize: 12, color: "#7a8499", background: "rgba(184,137,58,.08)", border: "1px solid rgba(184,137,58,.2)", padding: "4px 12px", borderRadius: 100 }}>
              🔥 {userData?.streak || 0} day streak
            </div>
            <button onClick={handleRetakeAssessment} style={{ fontSize: 13, color: "#7a8499", background: "transparent", border: "1px solid #e8dfd0", padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
              Retake Assessment
            </button>
            <button onClick={handleLogout} style={{ fontSize: 13, color: "#7a8499", background: "transparent", border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
              Sign out
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>🍁</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, marginBottom: 10, color: "#0c1420", letterSpacing: "-0.5px" }}>
            {userData?.joinedAt && new Date(userData.joinedAt).toDateString() === new Date().toDateString()
              ? "Welcome to NCLC7"
              : "Welcome back"}
          </div>
          <div style={{ fontSize: 14, color: "#7a8499", marginBottom: 40, lineHeight: 1.7 }}>
            Target <strong style={{ color: "#b8893a" }}>NCLC {userData?.targetNclc}</strong> · Starting from <strong style={{ color: "#0c1420" }}>{userData?.placedLevel}</strong>
            {userData?.hasDate && userData?.examDate && (
              <span> · Exam on <strong style={{ color: "#0c1420" }}>{userData.examDate}</strong></span>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 40 }}>
            {[
              { label: "Current Level", value: userData?.placedLevel || "—" },
              { label: "Target NCLC", value: userData?.targetNclc || "—" },
              { label: "Day Streak", value: `${userData?.streak || 0} 🔥` },
            ].map((stat) => (
              <div key={stat.label} style={{ background: "#fff", border: "1px solid #e8dfd0", borderRadius: 12, padding: "18px 14px" }}>
                <div style={{ fontSize: 11, color: "#7a8499", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.8px" }}>{stat.label}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: "#0c1420" }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Modules */}
          <div style={{ background: "#fff", border: "1px solid #e8dfd0", borderRadius: 12, padding: "24px", textAlign: "left" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0c1420", marginBottom: 16 }}>Your study modules</div>
            {[
              { icon: "✍️", label: "Writing Practice", desc: "AI-scored essays with NCLC feedback" },
              { icon: "🎧", label: "Listening Practice", desc: "Québec accent audio + comprehension" },
              { icon: "📖", label: "Reading Practice", desc: "TCF-style passages and MCQs" },
              { icon: "🗣️", label: "Speaking Practice", desc: "Prompts and model responses" },
              { icon: "📚", label: "Vocabulary Builder", desc: "Immigration-context word banks" },
            ].map((m) => (
              <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid #f3ece0" }}>
                <span style={{ fontSize: 20 }}>{m.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#0c1420", marginBottom: 2 }}>{m.label}</div>
                  <div style={{ fontSize: 11, color: "#7a8499" }}>{m.desc}</div>
                </div>
                <div style={{ fontSize: 11, color: "#b8893a", background: "rgba(184,137,58,.08)", border: "1px solid rgba(184,137,58,.2)", padding: "3px 10px", borderRadius: 100 }}>
                  Coming soon
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
