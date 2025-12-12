// frontend/src/pages/Tasks.jsx
import React, { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import { PlusIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "streax_tasks_v1";

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [
    { id: 1, name: "Coding Practice", type: "medium", base_xp: 25, required_daily: true, done: false },
    { id: 2, name: "Workout", type: "small", base_xp: 10, required_daily: true, done: false },
    { id: 3, name: "Read docs", type: "small", base_xp: 5, required_daily: false, done: false },
  ];
}
function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export default function Tasks() {
  const [tasks, setTasks] = useState(loadTasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => saveTasks(tasks), [tasks]);

  function handleAdd() {
    setEditing(null);
    setModalOpen(true);
  }
  function handleSave(task) {
    if (!task.name || !task.base_xp) return alert("Name and XP are required");
    if (task.id) {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, ...task } : t));
    } else {
      const next = Math.max(0, ...tasks.map(t => t.id)) + 1;
      setTasks(prev => [{ id: next, ...task, done: false }, ...prev]);
    }
    setModalOpen(false);
  }
  function handleEdit(task) {
    setEditing(task);
    setModalOpen(true);
  }
  function handleDelete(task) {
    if (!confirm(`Delete "${task.name}" ?`)) return;
    setTasks(prev => prev.filter(t => t.id !== task.id));
  }
  function toggleDone(task) {
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, done: !t.done } : t));
  }

  const filtered = tasks.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Tasks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Create, edit, and conquer your tasks.</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tasks..."
            className="rounded-md border-slate-200 dark:border-slate-700 p-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
          <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-md shadow hover:scale-105 transition">
            <PlusIcon className="w-5 h-5" /> Add Task
          </button>
        </div>
      </div>

      <AnimatePresence>
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(task => (
            <motion.div layout key={task.id}>
              <TaskCard key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} onToggleDone={toggleDone} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} task={editing} />
    </div>
  );
}
