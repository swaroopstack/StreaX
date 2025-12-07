// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const userId = 1;

  async function fetchStats() {
    try {
      const res = await fetch(`${API}/users/${userId}/stats`);
      const data = await res.json();
      setStats(data.stats || null);
    } catch (e) {
      console.error("fetchStats", e);
    }
  }

  useEffect(() => { fetchStats(); }, []);

  return (
    <div style={{maxWidth:900, margin:"36px auto", padding:18}}>
      <h2 style={{marginBottom:12}}>Dashboard</h2>

      {!stats ? (
        <div style={{color:"#64748b"}}>Loading stats...</div>
      ) : (
        <div style={{display:"grid", gap:12}}>
          <div style={{padding:16, background:"#fff", borderRadius:8, boxShadow:"0 6px 20px rgba(2,6,23,0.03)"}}>
            <div style={{fontWeight:700}}>Level {stats.current_level}</div>
            <div style={{marginTop:6}}>Total XP: {stats.total_xp}</div>
            <div style={{marginTop:6}}>Streak: {stats.streak_days} days</div>
            <div style={{marginTop:8}}>
              XP to next: {stats.xp_to_next_level} / {stats.next_level_threshold}
            </div>
            {/* Simple progress bar */}
            <div style={{marginTop:10, height:10, background:"#eef2f7", borderRadius:8}}>
              <div style={{
                height:10,
                borderRadius:8,
                width: `${Math.min(100, Math.round(((stats.next_level_threshold - stats.xp_to_next_level) / stats.next_level_threshold) * 100))}%`,
                background:"#06b6d4"
              }} />
            </div>
          </div>

          <div style={{padding:16, background:"#fff", borderRadius:8}}>
            <div style={{fontWeight:700, marginBottom:8}}>Quick Actions</div>
            <div style={{display:"flex", gap:8}}>
              <button className="btn" onClick={() => window.location.href="/tasks"}>Open Tasks</button>
              <button className="btn" onClick={() => window.location.href="/streaks"}>View Streaks</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
