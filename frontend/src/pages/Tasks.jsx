// frontend/src/pages/Tasks.jsx
import React, { useEffect, useState } from "react";
import TaskItem from "../components/TaskItem";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function EditModal({ open, task, onClose, onSave }) {
  const [name, setName] = useState("");
  const [baseXp, setBaseXp] = useState(5);
  const [required, setRequired] = useState(false);

  useEffect(() => {
    if (task) {
      setName(task.name || "");
      setBaseXp(task.base_xp ?? 5);
      setRequired(!!task.required_daily);
    }
  }, [task]);

  if (!open) return null;
  return (
    <div style={{position:"fixed", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.3)"}}>
      <div style={{background:"#fff", padding:18, borderRadius:10, width:420}}>
        <h3>Edit task</h3>
        <div style={{marginTop:8}}>
          <input value={name} onChange={e=>setName(e.target.value)} style={{width:"100%", padding:8, marginBottom:8}}/>
          <input type="number" value={baseXp} onChange={e=>setBaseXp(Number(e.target.value))} style={{width:"100%", padding:8, marginBottom:8}}/>
          <label style={{display:"flex", gap:8, alignItems:"center"}}>
            <input type="checkbox" checked={required} onChange={e=>setRequired(e.target.checked)}/> Required daily
          </label>
        </div>

        <div style={{display:"flex", justifyContent:"flex-end", gap:8, marginTop:12}}>
          <button onClick={onClose} style={{padding:"6px 10px", borderRadius:8}}>Cancel</button>
          <button onClick={()=>onSave({...task, name, base_xp: baseXp, required_daily: required})} style={{padding:"6px 10px", borderRadius:8, background:"#0ea5a4", color:"#fff"}}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState(() => {
    const u = localStorage.getItem("streax_user_id");
    return u ? Number(u) : 1;
  });
  const [newTaskName, setNewTaskName] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  async function fetchTasks() {
    try {
      const res = await fetch(`${API}/tasks?user_id=${userId}&limit=200`);
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error("fetchTasks error", err);
    }
  }

  useEffect(()=>{ fetchTasks(); }, [userId]);

  async function createTask() {
    if (!newTaskName) return;
    const payload = { user_id: userId, name: newTaskName, type: "small", base_xp: 5, required_daily: false };
    await fetch(`${API}/tasks`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload) });
    setNewTaskName("");
    fetchTasks();
  }

  async function handleEdit(task) {
    setEditing(task);
    setModalOpen(true);
  }
  async function handleDelete(task) {
    if (!confirm(`Delete task "${task.name}"?`)) return;
    await fetch(`${API}/tasks/${task.id}`, { method:"DELETE" });
    fetchTasks();
  }

  async function handleSave(edited) {
    setModalOpen(false);
    await fetch(`${API}/tasks/${edited.id}`, { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify(edited) });
    fetchTasks();
  }

  function changeUser(e) {
    const v = Number(e.target.value);
    setUserId(v);
    localStorage.setItem("streax_user_id", String(v));
  }

  return (
    <div style={{maxWidth:900, margin:"36px auto", padding:18}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
        <h1>Tasks</h1>

        <div style={{display:"flex", alignItems:"center", gap:8}}>
          <label className="small">User:</label>
          <input type="number" value={userId} onChange={changeUser} style={{width:80, padding:6}} />
        </div>
      </div>

      <div style={{display:"flex", gap:8, marginBottom:12}}>
        <input value={newTaskName} onChange={e=>setNewTaskName(e.target.value)} placeholder="New task name" style={{flex:1, padding:8}}/>
        <button onClick={createTask} className="btn">Create</button>
      </div>

      <div>
        {tasks.length===0 ? <div className="small">No tasks</div> :
          tasks.map(t => (
            <TaskItem key={t.id} task={t} onEdit={handleEdit} onDelete={handleDelete} />
          ))
        }
      </div>

      <EditModal open={modalOpen} task={editing} onClose={() => setModalOpen(false)} onSave={handleSave} />
    </div>
  );
}
