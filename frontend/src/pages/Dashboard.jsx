// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

/* futuristic Dashboard */
const STORAGE_KEY = "streax_demo_state_v1";
function loadMock() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) }
  catch { /* ignore */ }
  return {
    username: "abhi",
    current_level: 11,
    total_xp: 1887,
    next_level_threshold: 4157,
    streak_days: 163
  };
}
function saveMock(s) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }

function NeonBadge({ level }) {
  return (
    <div className="w-28 h-28 rounded-xl emblem flex-col">
      <div style={{fontSize:14, opacity:0.95}}>Lv</div>
      <div style={{fontSize:28, fontWeight:900, marginTop:2}}>{level}</div>
    </div>
  );
}

function XPBar({ value, max }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="mt-3">
      <div className="xp-track rounded-full overflow-hidden">
        <motion.div
          className="xp-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between items-center mt-3">
        <div className="small muted">XP: {value}/{max}</div>
        <div className="small muted">{pct}%</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [state, setState] = useState(loadMock);
  const [gain, setGain] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(()=> saveMock(state), [state]);

  function grantXP(n) {
    const nextTotal = state.total_xp + n;
    const leveled = nextTotal >= state.next_level_threshold;
    const newS = { ...state };
    if (leveled) {
      newS.current_level = state.current_level + 1;
      newS.total_xp = Math.max(0, nextTotal - state.next_level_threshold);
      newS.next_level_threshold = Math.round(100 * Math.pow(newS.current_level + 1, 1.5));
      setShowConfetti(true);
      setTimeout(()=>setShowConfetti(false), 4200);
    } else {
      newS.total_xp = nextTotal;
    }
    newS.streak_days = state.streak_days + 1;
    setGain(n);
    setState(newS);
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="emblem">S</div>
          <div>
            <div className="text-slate-200 font-bold">StreaX</div>
            <div className="small muted">Grind. Level. Conquer.</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="small muted text-right">
            <div style={{fontWeight:700, color:"white"}}>{state.username}</div>
            <div className="muted">level {state.current_level}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hero card */}
        <div className="lg:col-span-2 card-glass rounded-2xl p-6">
          <div className="flex items-start gap-6">
            <NeonBadge level={state.current_level} />

            <div className="flex-1">
              <div className="text-slate-100 font-bold text-2xl">Total XP</div>
              <div className="text-5xl font-black mt-2" style={{color:"rgba(255,255,255,0.95)"}}>{state.total_xp}</div>

              <XPBar value={state.total_xp} max={state.next_level_threshold} />

              <div className="mt-6 flex items-center gap-3">
                <button onClick={()=>grantXP(25)} className="btn-neon px-4 py-2 rounded-lg">Small +25</button>
                <button onClick={()=>grantXP(50)} className="btn-neon px-4 py-2 rounded-lg">Medium +50</button>
                <button onClick={()=>grantXP(120)} className="btn-neon px-4 py-2 rounded-lg">Large +120</button>
                <button onClick={()=>{ localStorage.removeItem('streax_demo_state_v1'); setState(loadMock()); }} className="ml-auto btn-ghost px-3 py-2 rounded-lg">Reset demo</button>
              </div>

              {gain && (
                <motion.div initial={{opacity:0, y:-6}} animate={{opacity:1, y:0}} className="mt-4 p-3 rounded-md" style={{background:"linear-gradient(90deg, rgba(6,246,240,0.06), rgba(255,93,162,0.04))"}}>
                  <div style={{fontWeight:700}} className="text-slate-100">+{gain} XP</div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Right summary */}
        <div className="card-glass rounded-2xl p-6">
          <div className="text-slate-200 font-semibold">Quick Summary</div>
          <div className="mt-4 space-y-3 muted small">
            <div className="flex justify-between"><div>Level</div><div style={{fontWeight:700}}>{state.current_level}</div></div>
            <div className="flex justify-between"><div>Total XP</div><div style={{fontWeight:700}}>{state.total_xp}</div></div>
            <div className="flex justify-between"><div>To next</div><div style={{fontWeight:700}}>{Math.max(0, state.next_level_threshold - state.total_xp)}</div></div>
            <div className="flex justify-between"><div>Streak</div><div style={{fontWeight:700}}>{state.streak_days} 🔥</div></div>
          </div>

          <div className="mt-6">
            <button className="w-full rounded-lg py-3 text-black font-semibold" style={{background:"linear-gradient(90deg,#0f172a,#0f172a)", boxShadow:"0 12px 30px rgba(2,6,23,0.6)"}} onClick={()=> window.location.href="/tasks"}>Open Tasks</button>
          </div>

          <div className="mt-6 text-center">
            <div className="inline-block px-6 py-3 rounded-full font-bold" style={{background:"linear-gradient(90deg,#FFB66B,#FF5DA2)", color:"#041018", boxShadow:"0 16px 40px rgba(255,93,162,0.12)"}}>CONQUER</div>
          </div>
        </div>
      </div>

      {showConfetti && <Confetti recycle={false} numberOfPieces={420} />}
    </div>
  );
}
