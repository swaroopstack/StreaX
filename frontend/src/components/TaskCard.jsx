// frontend/src/components/TaskCard.jsx
import React from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function TaskCard({ task, onEdit, onDelete, onToggleDone }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      whileHover={{ y: -4, boxShadow: "0 14px 30px rgba(2,6,23,0.08)" }}
      whileTap={{ scale: 0.995 }}
      className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md hover:shadow-lg transition grid grid-cols-[auto_1fr_auto] gap-4 items-center"
    >
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={!!task.done}
          onChange={() => onToggleDone(task)}
          className="w-5 h-5 rounded-md border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700"
        />
      </label>

      <div>
        <div className="flex items-center gap-3">
          <div className="font-semibold text-slate-900 dark:text-slate-100">{task.name}</div>
          <div className="text-xs text-slate-400 dark:text-slate-300 px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-700">
            {task.type}
          </div>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          XP: <span className="font-medium text-slate-800 dark:text-slate-100">{task.base_xp}</span> • {task.required_daily ? "Daily" : "Optional"}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(task)}
          className="p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          aria-label="Edit"
        >
          <PencilSquareIcon className="w-5 h-5 text-slate-600 dark:text-slate-200" />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900 transition"
          aria-label="Delete"
        >
          <TrashIcon className="w-5 h-5 text-rose-500" />
        </button>
      </div>
    </motion.div>
  );
}
