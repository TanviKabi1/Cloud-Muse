import { useEffect, useState } from "react";

export const Typewriter = ({ text, speed = 8, className = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => { setCount(0); }, [text]);

  useEffect(() => {
    if (count >= text.length) return;
    const chunk = Math.max(1, Math.floor(text.length / 250));
    const t = setTimeout(() => setCount((c) => Math.min(c + chunk, text.length)), speed);
    return () => clearTimeout(t);
  }, [count, text, speed]);

  const shown = text.slice(0, count);

  return (
    <span className={className}>
      <span>{shown}</span>
      {count < text.length && (
        <span
          className="inline-block w-1 h-4 ml-0.5 align-middle rounded-full"
          style={{
            background: "linear-gradient(to bottom, #fff, #fbcfe8)",
            boxShadow: "0 0 8px #fff",
            animation: "twinkle 0.9s infinite ease-in-out",
          }}
        />
      )}
    </span>
  );
};
