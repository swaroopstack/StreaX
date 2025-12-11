// frontend/src/components/TaskCard.jsx
import React from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function TaskCard({ task, onEdit, onDelete, onToggleDone }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition grid grid-cols-[auto_1fr_auto] gap-4 items-center">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={!!task.done}
          onChange={() => onToggleDone(task)}
          className="w-5 h-5 rounded-md border-slate-200"
        />
      </label>

      <div>
        <div className="flex items-center gap-3">
          <div className="font-semibold text-slate-900">{task.name}</div>
          <div className="text-xs text-slate-400 px-2 py-0.5 rounded-md bg-slate-50">{task.type}</div>
        </div>
        <div className="text-sm text-slate-500 mt-1">XP: <span className="font-medium">{task.base_xp}</span> • {task.required_daily ? "Daily" : "Optional"}</div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(task)}
          className="p-2 rounded-md hover:bg-slate-50 transition"
          aria-label="Edit"
        >
          <PencilSquareIcon className="w-5 h-5 text-slate-600" />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="p-2 rounded-md hover:bg-red-50 transition"
          aria-label="Delete"
        >
          <TrashIcon className="w-5 h-5 text-rose-500" />
        </button>
      </div>
    </div>
  );
}
