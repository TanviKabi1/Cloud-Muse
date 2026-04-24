import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const WORDS = ["imagine","wander","whisper","spark","bloom","drift","muse","starlit","softly","weave","dream","glow"];
const STAGES = [
  "gathering clouds…",
  "awakening the dream engine…",
  "weaving constellations…",
  "letting ideas rain…",
];

export const MagicalLoader = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStage((s) => (s + 1) % STAGES.length), 2300);
    return () => clearInterval(t);
  }, []);

  const points = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2;
    return { x: 120 + Math.cos(a) * 90, y: 120 + Math.sin(a) * 90 };
  });

  return (
    <div className="relative flex flex-col items-center justify-center py-16" data-testid="magical-loader">
      <div className="relative w-[240px] h-[240px]">
        <motion.div
          className="absolute inset-12 rounded-full bg-gradient-to-tr from-white via-pink-100 to-indigo-200 pulse-glow"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0, 0.8, 0, 0.4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <svg viewBox="0 0 240 240" className="w-full h-full">
            <path d="M120 40 L110 110 L140 110 L100 200" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </motion.div>

        <svg viewBox="0 0 240 240" className="absolute inset-0 w-full h-full">
          {points.map((p, i) => {
            const next = points[(i + 2) % points.length];
            return (
              <line key={i} x1={p.x} y1={p.y} x2={next.x} y2={next.y} stroke="rgba(199,180,255,0.5)" strokeWidth="1" strokeDasharray="2 4" />
            );
          })}
          {points.map((p, i) => (
            <circle key={`d-${i}`} cx={p.x} cy={p.y} r="2.5" fill="#fff" opacity="0.9" />
          ))}
        </svg>

        {WORDS.map((w, i) => {
          const duration = 11 + (i % 5);
          const delay = -((i / WORDS.length) * duration);
          return (
            <motion.span
              key={w}
              className="absolute left-1/2 top-1/2 font-hand text-indigo-400/80 text-lg select-none"
              style={{ marginLeft: -30, marginTop: -10 }}
              animate={{ rotate: 360 }}
              transition={{ duration, repeat: Infinity, ease: "linear", delay }}
            >
              <span style={{ display: "inline-block", transform: `translateX(110px)` }}>{w}</span>
            </motion.span>
          );
        })}
      </div>

      <motion.p
        key={stage}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 font-display italic text-2xl text-slate-700 glow-heading"
        data-testid="loader-stage"
      >
        {STAGES[stage]}
      </motion.p>
    </div>
  );
};
