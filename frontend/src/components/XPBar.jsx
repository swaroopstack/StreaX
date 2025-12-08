// frontend/src/components/XPBar.jsx
import { motion } from "framer-motion";

export default function XPBar({ currentXP, threshold }) {
  const progress = Math.min(100, Math.round((currentXP / threshold) * 100));

  return (
    <div style={{
      background: "#e2e8f0",
      height: 12,
      borderRadius: 10,
      overflow: "hidden",
      width: "100%",
      marginTop: 6
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          height: "100%",
          background: "#0ea5a4",
          borderRadius: 10
        }}
      />
    </div>
  );
}
