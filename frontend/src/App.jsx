// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Tasks from "./pages/Tasks";
import Dashboard from "./pages/Dashboard";
import Streaks from "./pages/Streaks";
import Stats from "./pages/Stats";
import "./styles.css";

function Navbar() {
  return (
    <nav style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:12, borderBottom:"1px solid #eef2f7", background:"#fff"}}>
      <div style={{fontWeight:800}}>StreaX</div>
      <div style={{display:"flex", gap:12}}>
        <Link to="/" style={{textDecoration:"none", color:"#0f172a"}}>Dashboard</Link>
        <Link to="/tasks" style={{textDecoration:"none", color:"#0f172a"}}>Tasks</Link>
        <Link to="/streaks" style={{textDecoration:"none", color:"#0f172a"}}>Streaks</Link>
        <Link to="/stats" style={{textDecoration:"none", color:"#0f172a"}}>Stats</Link>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{minHeight:"100vh", background:"#f7fafc"}}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/streaks" element={<Streaks />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
