import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const GenerateButton = ({ onClick, disabled, label = "generate" }) => {
  const [rings, setRings] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const [puffing, setPuffing] = useState(false);

  const handle = () => {
    if (disabled) return;
    const id = Date.now();
    setRings((r) => [...r, id]);
    setPuffing(true);
    const bursts = Array.from({ length: 14 }, (_, i) => ({
      id: id + i,
      angle: (i / 14) * Math.PI * 2,
      dist: 60 + Math.random() * 50,
    }));
    setSparkles((s) => [...s, ...bursts]);
    setTimeout(() => setRings((r) => r.filter((x) => x !== id)), 900);
    setTimeout(() => setSparkles((s) => s.filter((x) => x.id < id || x.id > id + 14)), 900);
    setTimeout(() => setPuffing(false), 700);
    onClick?.();
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handle}
        disabled={disabled}
        data-testid="generate-cloud-button"
        aria-label="Generate content from your topic"
        className={`relative z-10 cloud-morph px-10 py-6 bg-gradient-to-br from-white via-pink-50 to-indigo-100 text-slate-700 font-display text-2xl tracking-wide shadow-[0_12px_40px_rgba(199,180,255,0.5)] border border-white/80 hover:shadow-[0_18px_60px_rgba(252,203,223,0.7)] transition-shadow disabled:opacity-60 disabled:cursor-not-allowed ${puffing ? "puff" : ""}`}
      >
        <span className="relative">{label}</span>
      </button>

      <AnimatePresence>
        {rings.map((r) => (
          <span key={r} className="shockwave absolute inset-0 rounded-full border-2 border-white/80 pointer-events-none" />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {sparkles.map((s) => (
          <motion.span
            key={s.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
            animate={{ x: Math.cos(s.angle) * s.dist, y: Math.sin(s.angle) * s.dist, opacity: 0, scale: 1.4 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, #fff, #fbcfe8 60%, transparent)",
              boxShadow: "0 0 10px #fff",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
