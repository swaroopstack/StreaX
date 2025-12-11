// frontend/src/components/TaskItem.jsx
import React from "react";

export default function TaskItem({ task, onEdit, onDelete }) {
  return (
    <div style={{display:"flex", justifyContent:"space-between", padding:10, borderBottom:"1px solid #eef2f7", alignItems:"center"}}>
      <div>
        <div style={{fontWeight:600}}>{task.name}</div>
        <div style={{color:"#64748b", fontSize:13}}>xp: {task.base_xp} • {task.type}</div>
      </div>

      <div style={{display:"flex", gap:8}}>
        <button onClick={() => onEdit(task)} style={{padding:"6px 8px", borderRadius:8, border:"none", cursor:"pointer"}}>Edit</button>
        <button onClick={() => onDelete(task)} style={{padding:"6px 8px", borderRadius:8, border:"none", cursor:"pointer", background:"#ef4444", color:"#fff"}}>Delete</button>
      </div>
    </div>
  );
}
