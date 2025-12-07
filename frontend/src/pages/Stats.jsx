// frontend/src/pages/Stats.jsx
import React, { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Stats() {
  const [stats, setStats] = useState(null);
  const userId = 1;

  useEffect(() => {
    fetch(`${API}/users/${userId}/stats`)
      .then(r => r.json())
      .then(j => setStats(j.stats))
      .catch(e => console.error(e));
  }, []);

  if (!stats) return <div style={{maxWidth:900, margin:"36px auto", padding:18}}>Loading...</div>;

  return (
    <div style={{maxWidth:900, margin:"36px auto", padding:18}}>
      <h2>Stats</h2>
      <pre style={{whiteSpace:"pre-wrap"}}>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
}
