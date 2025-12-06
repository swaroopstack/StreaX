// frontend/src/pages/Tasks.jsx
import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState(1);
  const [newTaskName, setNewTaskName] = useState("");
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState(null);

  async function fetchTasks() {
    try {
      const res = await fetch(`${API}/tasks?user_id=${userId}&limit=100`);
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error("fetchTasks error", err);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  async function createTask() {
    if (!newTaskName) return;
    const payload = {
      user_id: userId,
      name: newTaskName,
      type: "small",
      base_xp: 5,
      required_daily: false
    };
    try {
      await fetch(`${API}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setNewTaskName("");
      fetchTasks();
    } catch (err) {
      console.error("createTask error", err);
    }
  }

  async function processDay() {
    setLoading(true);
    const tasksPayload = tasks.map(t => ({
      id: t.id + 1000,
      name: t.name,
      type: t.type,
      base_xp: t.base_xp,
      required_daily: t.required_daily
    }));
    const payload = {
      user: { user_id: userId, username: "abhi" },
      tasks: tasksPayload
    };
    try {
      const res = await fetch(`${API}/process-day`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setEvent(data.event);
      await fetchTasks();
    } catch (err) {
      console.error("processDay error", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div className="h1">StreaX — Tasks</div>
        <div>
          <input className="input" value={newTaskName} onChange={e => setNewTaskName(e.target.value)} placeholder="New task name"/>
          <button className="btn" onClick={createTask}>Create</button>
        </div>
      </div>

      <div style={{marginBottom:12}}>
        <button className="btn" onClick={processDay} disabled={loading}>
          {loading ? "Processing..." : "Process Day"}
        </button>
      </div>

      <div>
        {tasks.length === 0 ? <div className="small">No tasks yet</div> :
          tasks.map(t => (
            <div key={t.id} className="task">
              <div>
                <div style={{fontWeight:600}}>{t.name}</div>
                <div className="small">xp: {t.base_xp} • {t.type}</div>
              </div>
              <div className="small">{t.required_daily ? "Daily" : ""}</div>
            </div>
          ))
        }
      </div>

      {event && (
        <div style={{marginTop:16, padding:12, border:'1px solid #eef2f7', borderRadius:8}}>
          <div style={{fontWeight:700, marginBottom:6}}>Last Event</div>
          <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(event, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
