import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const TopicCloud = ({ value, onChange, onSubmit, disabled }) => {
  const [focused, setFocused] = useState(false);
  const [particles, setParticles] = useState([]);
  const counterRef = useRef(0);

  const handleChange = (e) => {
    onChange(e.target.value);
    const id = counterRef.current++;
    const p = { id, x: Math.random() * 60 + 20, y: Math.random() * 30 + 40 };
    setParticles((prev) => [...prev.slice(-14), p]);
    setTimeout(() => setParticles((prev) => prev.filter((q) => q.id !== id)), 900);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" data-testid="topic-cloud">
      <AnimatePresence>
        {focused && (
          <>
            <motion.div
              initial={{ opacity: 0, x: -80, scale: 0.8 }}
              animate={{ opacity: 0.85, x: -20, scale: 1 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.9 }}
              className="absolute -left-16 -top-6 w-44 h-24 bg-white/60 rounded-[60%] blur-xl pointer-events-none"
            />
            <motion.div
              initial={{ opacity: 0, x: 80, scale: 0.8 }}
              animate={{ opacity: 0.7, x: 30, scale: 1 }}
              exit={{ opacity: 0, x: 80 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="absolute -right-14 -bottom-10 w-52 h-28 bg-pink-100/70 rounded-[60%] blur-xl pointer-events-none"
            />
          </>
        )}
      </AnimatePresence>

      <motion.div
        className="relative cloud-morph bg-white/50 backdrop-blur-xl border border-white/80 shadow-[0_20px_60px_rgba(164,172,210,0.35)] px-8 py-7"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-2 rounded-[inherit] bg-white/25 pointer-events-none" />

        <textarea
          rows={2}
          value={value}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder="whisper a topic into the clouds…"
          data-testid="topic-input"
          className="relative z-10 w-full bg-transparent text-center text-xl md:text-2xl font-display italic text-slate-800 placeholder-slate-400/90 focus:outline-none resize-none"
        />

        <AnimatePresence>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              initial={{ opacity: 1, y: 0, scale: 0.6 }}
              animate={{ opacity: 0, y: -30, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                background: "radial-gradient(circle, #fff, rgba(251,207,232,0.7) 60%, transparent)",
                boxShadow: "0 0 10px rgba(255,255,255,0.9)",
              }}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <p className="mt-3 text-center font-hand text-lg text-indigo-400/80">
        press enter to summon the muse
      </p>
    </div>
  );
};
