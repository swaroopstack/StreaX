// frontend/src/components/StreakGrid.jsx
import React from "react";

/**
 * StreakGrid
 * props:
 *  - data: Map of 'YYYY-MM-DD' -> count (number of completed tasks that day)
 *  - days: number of days to show (default 365)
 *
 * Renders a week-by-week grid (columns = weeks, rows = weekdays)
 */
export default function StreakGrid({ data = new Map(), days = 365 }) {
  // Build an array of dates for last `days` (oldest first)
  const today = new Date();
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d);
  }

  // Group into weeks starting from sunday (so columns are weeks)
  const weeks = [];
  let week = [];
  // pad first week so Sunday is first cell
  const firstDayIndex = dates[0].getDay(); // 0=Sun..6=Sat
  for (let i = 0; i < firstDayIndex; i++) {
    week.push(null);
  }
  dates.forEach(d => {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length > 0) weeks.push(week);

  // Flatten counts to determine max for color scaling
  let maxCount = 0;
  dates.forEach(d => {
    const key = d.toISOString().slice(0, 10);
    const c = data.get(key) || 0;
    if (c > maxCount) maxCount = c;
  });

  // helper for color by count
  function colorForCount(c) {
    if (c <= 0) return "#ebedf0"; // empty (light gray)
    // simple 4-step scale
    if (c === 1) return "#9be9a8";
    if (c === 2) return "#40c463";
    return "#30a14e"; // 3+ or highest
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ display: "flex", gap: 6, padding: 8 }}>
        {weeks.map((w, wi) => (
          <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {w.map((d, idx) => {
              if (!d) {
                return <div key={idx} style={{ width: 14, height: 14 }} />;
              }
              const key = d.toISOString().slice(0, 10);
              const count = data.get(key) || 0;
              const color = colorForCount(count);
              return (
                <div
                  key={idx}
                  title={`${key} — ${count} task${count !== 1 ? "s" : ""}`}
                  style={{
                    width: 14,
                    height: 14,
                    background: color,
                    borderRadius: 3,
                    border: "1px solid rgba(0,0,0,0.04)",
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, color: "#64748b", fontSize: 13 }}>
        <strong>Legend:</strong>&nbsp;
        <span style={{ display: "inline-block", width: 14, height: 14, background: "#ebedf0", borderRadius: 3, marginRight: 6 }} /> none
        <span style={{ display: "inline-block", width: 14, height: 14, background: "#9be9a8", borderRadius: 3, marginLeft: 12, marginRight: 6 }} /> 1
        <span style={{ display: "inline-block", width: 14, height: 14, background: "#40c463", borderRadius: 3, marginLeft: 6, marginRight: 6 }} /> 2
        <span style={{ display: "inline-block", width: 14, height: 14, background: "#30a14e", borderRadius: 3, marginLeft: 6 }} /> 3+
      </div>
    </div>
  );
}
