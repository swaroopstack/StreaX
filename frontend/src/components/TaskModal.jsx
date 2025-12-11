// frontend/src/components/TaskModal.jsx
import React, { useEffect, useState } from "react";

export default function TaskModal({ open, onClose, onSave, task }) {
  const [name, setName] = useState("");
  const [baseXp, setBaseXp] = useState(10);
  const [type, setType] = useState("small");
  const [requiredDaily, setRequiredDaily] = useState(false);

  useEffect(() => {
    if (task) {
      setName(task.name || "");
      setBaseXp(task.base_xp ?? 10);
      setType(task.type || "small");
      setRequiredDaily(!!task.required_daily);
    } else {
      setName("");
      setBaseXp(10);
      setType("small");
      setRequiredDaily(false);
    }
  }, [task, open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-40">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-50">
        <h3 className="text-lg font-semibold mb-3">{task ? "Edit Task" : "Add Task"}</h3>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-600">Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} className="mt-1 block w-full rounded-md border-slate-200 p-2" />
          </div>

          <div>
            <label className="text-sm text-slate-600">XP</label>
            <input type="number" value={baseXp} onChange={e=>setBaseXp(Number(e.target.value))} className="mt-1 block w-full rounded-md border-slate-200 p-2" />
          </div>

          <div className="flex gap-2 items-center">
            <div>
              <label className="text-sm text-slate-600">Type</label>
              <select value={type} onChange={e=>setType(e.target.value)} className="mt-1 block rounded-md border-slate-200 p-2">
                <option value="small">small</option>
                <option value="medium">medium</option>
                <option value="large">large</option>
              </select>
            </div>

            <label className="flex items-center gap-2 ml-auto">
              <input type="checkbox" checked={requiredDaily} onChange={e=>setRequiredDaily(e.target.checked)} />
              <span className="text-sm text-slate-600">Required daily</span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
          <button onClick={()=>onSave({ ...task, name, base_xp: baseXp, type, required_daily: requiredDaily })} className="px-4 py-2 rounded-md bg-emerald-500 text-white">Save</button>
        </div>
      </div>
    </div>
  );
}
