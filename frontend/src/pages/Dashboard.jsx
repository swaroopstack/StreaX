import React, { useEffect, useState } from "react";
import XPBar from "../components/XPBar";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const userId = 1;

  async function fetchStats() {
    try {
      const res = await fetch(`${API}/users/${userId}/stats`);
      const data = await res.json();
      setStats(data.stats);
    } catch (e) {
      console.error("Stats fetch error:", e);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div style={{ maxWidth: 900, margin: "36px auto", padding: 18 }}>
        Loading dashboard…
      </div>
    );
  }

  const xpToNext = stats.next_level_threshold - stats.xp_to_next_level;
  const threshold = stats.next_level_threshold;

  return (
    <div style={{ maxWidth: 900, margin: "36px auto", padding: 18 }}>
      <h2 style={{ marginBottom: 12 }}>Dashboard</h2>

      {/* Level Card */}
      <div style={{
        padding: 20,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 14px rgba(0,0,0,0.07)",
        marginBottom: 20
      }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          Level {stats.current_level}
        </div>

        <div style={{ marginBottom: 6 }}>
          Total XP: <strong>{stats.total_xp}</strong>
        </div>
        <div style={{ marginBottom: 6 }}>
          Streak: <strong>{stats.streak_days} days</strong>
        </div>
        <div style={{ marginBottom: 8 }}>
          XP Progress: {xpToNext} / {threshold}
        </div>

        {/* XP Progress Bar */}
        <XPBar currentXP={xpToNext} threshold={threshold} />
      </div>

      {/* Quick Actions */}
      <div style={{
        padding: 20,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 14px rgba(0,0,0,0.07)"
      }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>
          Quick Actions
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn" onClick={() => (window.location.href = "/tasks")}>
            Open Tasks
          </button>
          <button className="btn" onClick={() => (window.location.href = "/streaks")}>
            View Streaks
          </button>
        </div>
      </div>
    </div>
  );
}
