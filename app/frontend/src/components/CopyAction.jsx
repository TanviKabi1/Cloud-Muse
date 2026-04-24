import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Feather } from "lucide-react";
import { toast } from "sonner";

export const CopyAction = ({ text, testid = "copy-action", label = "copy" }) => {
  const [feathers, setFeathers] = useState([]);

  const fallbackCopy = (val) => {
    try {
      const ta = document.createElement("textarea");
      ta.value = val;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  };

  const handle = async () => {
    const value = text || "";
    let ok = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok) ok = fallbackCopy(value);
    if (ok) {
      toast("Whisked away into the wind ✨", { description: "Copied. Now paste it anywhere the sky reaches." });
    } else {
      toast("Could not copy — try again from the clouds.");
    }

    const burst = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      angle: Math.random() * Math.PI * 2,
      dist: 40 + Math.random() * 50,
      rot: Math.random() * 180 - 90,
    }));
    setFeathers((f) => [...f, ...burst]);
    setTimeout(() => setFeathers([]), 1100);
  };

  return (
    <button
      onClick={handle}
      data-testid={testid}
      className="relative group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white/80 backdrop-blur-md text-slate-600 hover:text-slate-800 hover:bg-white/80 transition font-hand text-lg"
    >
      <Feather className="w-4 h-4" />
      <span>{label}</span>
      <AnimatePresence>
        {feathers.map((f) => (
          <motion.span
            key={f.id}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{ x: Math.cos(f.angle) * f.dist, y: Math.sin(f.angle) * f.dist - 20, opacity: 0, rotate: f.rot }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 pointer-events-none"
          >
            <Feather className="w-3 h-3 text-pink-300" style={{ filter: "drop-shadow(0 0 4px #fff)" }} />
          </motion.span>
        ))}
      </AnimatePresence>
    </button>
  );
};
