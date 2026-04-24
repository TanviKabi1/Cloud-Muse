import { useMemo } from "react";

const Cloud = ({ className = "", style = {}, scale = 1, opacity = 0.8 }) => (
  <svg viewBox="0 0 200 100" className={className} style={{ ...style, opacity, transform: `scale(${scale})` }} aria-hidden="true">
    <defs>
      <radialGradient id="cg" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="70%" stopColor="#ffffff" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="60" rx="55" ry="30" fill="url(#cg)" />
    <ellipse cx="110" cy="50" rx="65" ry="35" fill="url(#cg)" />
    <ellipse cx="150" cy="65" rx="45" ry="25" fill="url(#cg)" />
    <ellipse cx="95" cy="70" rx="70" ry="22" fill="url(#cg)" />
  </svg>
);

const PaperPlane = ({ className = "", style = {} }) => (
  <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden="true">
    <path d="M2 30 L62 2 L44 60 L32 36 L2 30Z" fill="rgba(255,255,255,0.85)" stroke="rgba(180,170,220,0.6)" strokeWidth="1" />
    <path d="M32 36 L62 2" stroke="rgba(180,170,220,0.5)" strokeWidth="1" fill="none" />
  </svg>
);

export const SkyBackground = () => {
  const stars = useMemo(
    () => Array.from({ length: 60 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 3,
    })),
    []
  );

  return (
    <div className="fixed inset-0 -z-10 sky-gradient overflow-hidden" data-testid="sky-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-10%] top-[60%] w-[60vw] h-[30vh] rounded-[50%] bg-white/25 blur-3xl" />
        <div className="absolute right-[-5%] top-[10%] w-[40vw] h-[25vh] rounded-[50%] bg-pink-100/40 blur-3xl" />
        <div className="absolute left-[20%] top-[20%] w-[30vw] h-[20vh] rounded-[50%] bg-indigo-100/40 blur-3xl" />
      </div>

      {stars.map((s, i) => (
        <span
          key={i}
          className="twinkle absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            boxShadow: "0 0 8px rgba(255,255,255,0.9)",
          }}
        />
      ))}

      <Cloud className="cloud-drift-1 absolute w-[320px] h-[160px]" style={{ top: "12%", opacity: 0.7 }} />
      <Cloud className="cloud-drift-2 absolute w-[260px] h-[130px]" style={{ top: "38%", opacity: 0.55 }} />
      <Cloud className="cloud-drift-3 absolute w-[420px] h-[200px]" style={{ top: "62%", opacity: 0.5 }} />
      <Cloud className="cloud-drift-1 absolute w-[220px] h-[110px]" style={{ top: "80%", opacity: 0.45, animationDelay: "-40s" }} />

      <PaperPlane className="cloud-drift-2 absolute w-10 h-10" style={{ top: "22%", animationDuration: "110s" }} />
      <PaperPlane className="cloud-drift-1 absolute w-8 h-8" style={{ top: "72%", animationDuration: "140s", animationDelay: "-60s" }} />

      <div className="shooting-star absolute w-24 h-[2px] bg-gradient-to-r from-white to-transparent" style={{ top: 0, left: 0, filter: "blur(1px)" }} />
    </div>
  );
};
