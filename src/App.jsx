import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";

const STORAGE_KEY = "nclc7_user";

export default function App() {
  const [page, setPage] = useState("loading");
  const [userData, setUserData] = useState(null);

  // On mount — check localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setUserData(parsed);
        setPage("dashboard");
      } else {
        setPage("landing");
      }
    } catch {
      setPage("landing");
    }
  }, []);

  // Browser back button — always returns to landing
  useEffect(() => {
    const handlePopState = () => setPage("landing");
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Streak tracking on dashboard visit
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

  const goTo = (p) => {
    window.history.pushState({ page: p }, "");
    setPage(p);
  };

  const handleStartAssessment = () => goTo("onboarding");
  const handleBackToLanding = () => goTo("landing");

  const handleOnboardingComplete = (data) => {
    const enriched = {
      ...data,
      joinedAt: new Date().toISOString(),
      streak: 1,
      lastVisit: new Date().toISOString(),
      completedExercises: [],
      vocabulary: [],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));
    setUserData(enriched);
    goTo("dashboard");
  };

  const handleRetake = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUserData(null);
    goTo("onboarding");
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUserData(null);
    goTo("landing");
  };

  const handleStartModule = (moduleId) => {
    // Modules coming next — placeholder for now
    alert(`${moduleId} module coming soon!`);
  };

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
    return (
      <Onboarding
        onComplete={handleOnboardingComplete}
        onBack={handleBackToLanding}
      />
    );
  }

  if (page === "dashboard") {
    return (
      <Dashboard
        userData={userData}
        onRetake={handleRetake}
        onLogout={handleLogout}
        onStartModule={handleStartModule}
      />
    );
  }
}
