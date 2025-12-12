// frontend/src/components/TaskModal.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-40"
        >
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6 z-50"
            initial={{ y: 12, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 8, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-slate-100">{task ? "Edit Task" : "Add Task"}</h3>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-300">Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-slate-200 dark:border-slate-700 p-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600 dark:text-slate-300">XP</label>
                <input
                  type="number"
                  value={baseXp}
                  onChange={e => setBaseXp(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-slate-200 dark:border-slate-700 p-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex gap-2 items-center">
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-300">Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="mt-1 block rounded-md border-slate-200 dark:border-slate-700 p-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option className="bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" value="small">small</option>
                    <option className="bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" value="medium">medium</option>
                    <option className="bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" value="large">large</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 ml-auto text-slate-700 dark:text-slate-300">
                  <input type="checkbox" checked={requiredDaily} onChange={e => setRequiredDaily(e.target.checked)} />
                  <span className="text-sm">Required daily</span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 rounded-md border bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100">Cancel</button>
              <button onClick={() => onSave({ ...task, name, base_xp: baseXp, type, required_daily: requiredDaily })} className="px-4 py-2 rounded-md bg-emerald-500 text-white">Save</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
