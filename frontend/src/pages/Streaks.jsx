// frontend/src/pages/Streaks.jsx
import React, { useEffect, useState } from "react";
import StreakGrid from "../components/StreakGrid";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

/**
 * Streaks page
 * - fetches task logs for last ~365 days
 * - builds a map of date -> count
 * - passes map to StreakGrid
 */
export default function Streaks() {
  const [map, setMap] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const userId = 1;

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // request last 400 logs to be safe (backend returns most recent first)
        const res = await fetch(`${API}/task-logs?user_id=${userId}&limit=400`);
        const json = await res.json();
        const logs = json.logs || [];
        // count tasks per day
        const counts = new Map();
        logs.forEach(l => {
          // l.date should be 'YYYY-MM-DD' already
          const day = l.date;
          if (!day) return;
          const prev = counts.get(day) || 0;
          counts.set(day, prev + (l.xp_awarded ? 1 : 0)); // count by entries (you can change)
        });

        // NOTE: backend returns recent first; counts map ready
        setMap(counts);
      } catch (e) {
        console.error("Failed to load task logs", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={{maxWidth:900, margin:"36px auto", padding:18}}>
      <h2>Streaks</h2>
      <p style={{color:"#64748b"}}>A year view of your activity (each cell is a day).</p>

      {loading ? <div style={{color:"#64748b"}}>Loading...</div> : <StreakGrid data={map} days={365} />}
    </div>
  );
}
