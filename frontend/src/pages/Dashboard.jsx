// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

/*
  Polished Dashboard (frontend-first)
  - mock-driven state in localStorage
  - animated XP bar
  - level card, quick actions, streak count
  - confetti on level-up
  - responsive, Tailwind-ready classes used where appropriate
*/

const STORAGE_KEY = "streax_demo_state_v1";

function loadMock() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    username: "abhi",
    current_level: 2,
    total_xp: 320,
    next_level_threshold: 500,
    streak_days: 4,
  };
}
function saveMock(s) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

function XPBar({ value, max }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full">
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="h-3 rounded-full"
          style={{ background: "linear-gradient(90deg,#06b6d4,#0ea5a4)", boxShadow: "0 8px 22px rgba(6,182,212,0.12)" }}
        />
      </div>
      <div className="mt-2 text-sm text-slate-600 flex justify-between">
        <div>XP: {value}/{max}</div>
        <div>{pct}%</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [state, setState] = useState(loadMock);
  const [lastGain, setLastGain] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => saveMock(state), [state]);

  function giveXP(amount = 50) {
    const nextTotal = state.total_xp + amount;
    const willLevel = nextTotal >= state.next_level_threshold;
    const newState = { ...state };

    if (willLevel) {
      newState.current_level = state.current_level + 1;
      // next threshold formula (kept same idea as engine): 100 * L^1.5
      const nextThreshold = Math.round(100 * Math.pow(newState.current_level + 1, 1.5));
      newState.total_xp = Math.max(0, nextTotal - state.next_level_threshold);
      newState.next_level_threshold = nextThreshold;
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4200);
    } else {
      newState.total_xp = nextTotal;
    }
    newState.streak_days = Math.max(0, state.streak_days + 1);
    setLastGain(amount);
    setState(newState);
  }

  function resetDemo() {
    localStorage.removeItem(STORAGE_KEY);
    const fresh = loadMock();
    setState(fresh);
    setLastGain(null);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-extrabold">Welcome back, <span className="text-teal-500">{state.username}</span></div>
              <div className="text-xs text-slate-500 mt-1">Break the pattern today — conquer the small wins.</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Streak</div>
              <div className="font-bold text-lg">{state.streak_days} 🔥</div>
            </div>
          </div>

          <div className="mt-6 flex gap-6 items-center">
            <div className="w-28 h-28 rounded-xl flex items-center justify-center text-white font-extrabold text-2xl"
                 style={{ background: "linear-gradient(135deg,#06b6d4,#0ea5a4)", boxShadow: "0 12px 30px rgba(6,182,212,0.14)" }}>
              Lv {state.current_level}
            </div>

            <div className="flex-1">
              <div className="text-sm font-semibold">Total XP</div>
              <div className="text-3xl font-extrabold mt-1">{state.total_xp}</div>
              <div className="mt-4"><XPBar value={state.total_xp} max={state.next_level_threshold} /></div>

              <div className="mt-5 flex gap-3">
                <button onClick={() => giveXP(25)} className="px-4 py-2 rounded-md bg-emerald-500 text-white shadow hover:scale-[1.01] transition">Small +25</button>
                <button onClick={() => giveXP(50)} className="px-4 py-2 rounded-md bg-teal-500 text-white shadow hover:scale-[1.01] transition">Medium +50</button>
                <button onClick={() => giveXP(120)} className="px-4 py-2 rounded-md bg-cyan-600 text-white shadow hover:scale-[1.01] transition">Large +120</button>

                <button onClick={resetDemo} className="ml-auto px-3 py-2 rounded-md border">Reset</button>
              </div>

              <AnimatePresence>
                {lastGain && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-4 p-3 bg-blue-50 border rounded-md">
                    <div className="font-semibold">+{lastGain} XP</div>
                    <div className="text-sm text-slate-600">Nice! XP was added to your total.</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Side card */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="font-semibold">Quick Summary</div>
          <div className="text-sm text-slate-500 mt-1">Overview</div>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <div className="text-sm text-slate-500">Level</div>
              <div className="font-semibold">{state.current_level}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-sm text-slate-500">Total XP</div>
              <div className="font-semibold">{state.total_xp}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-sm text-slate-500">To next</div>
              <div className="font-semibold">{Math.max(0, state.next_level_threshold - state.total_xp)}</div>
            </div>
          </div>

          <div className="mt-6">
            <button className="w-full px-4 py-2 rounded-md bg-slate-900 text-white" onClick={() => window.location.href="/tasks"}>Open Tasks</button>
          </div>

          {/* decorative badge */}
          <div className="mt-6 text-center">
            <div className="inline-block px-4 py-3 rounded-lg font-bold" style={{ background: "linear-gradient(90deg,#ffd166,#ff7a7a)", boxShadow:"0 12px 28px rgba(255,122,122,0.12)" }}>
              CONQUER
            </div>
          </div>
        </div>
      </div>

      {showConfetti && <Confetti recycle={false} numberOfPieces={450} /> }
    </div>
  );
}
