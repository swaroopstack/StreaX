// frontend/src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

function NavLink({ to, children }) {
  const loc = useLocation();
  const active = loc.pathname === to;
  return (
    <Link to={to} className={`px-3 py-2 rounded-md text-sm font-medium transition ${active ? "bg-[rgba(6,246,240,0.12)] text-neon-cyan" : "text-slate-200 hover:text-white hover:bg-[rgba(255,255,255,0.02)]"}`}>
      {children}
    </Link>
  );
}

export default function Navbar({ onToggleTheme }) {
  return (
    <header className="w-full bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.03)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="emblem">S</div>
              <div>
                <div className="text-slate-100 font-semibold">StreaX</div>
                <div className="small muted -mt-0.5">Grind. Level. Conquer.</div>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/tasks">Tasks</NavLink>
            <NavLink to="/streaks">Streaks</NavLink>
            <NavLink to="/stats">Stats</NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={onToggleTheme} aria-label="toggle theme" className="p-2 rounded-md hover:bg-[rgba(255,255,255,0.02)]">
              <svg className="w-5 h-5 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2m14 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 7a5 5 0 100 10 5 5 0 000-10z"/></svg>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white/6 flex items-center justify-center text-slate-900 font-semibold">A</div>
              <div className="hidden sm:block text-right">
                <div className="text-slate-100 font-medium">abhi</div>
                <div className="small muted">level 11</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
