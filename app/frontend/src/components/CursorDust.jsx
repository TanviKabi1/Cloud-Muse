import { useEffect, useRef } from "react";

export const CursorDust = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastTime = 0;
    const handle = (e) => {
      const now = performance.now();
      if (now - lastTime < 22) return;
      lastTime = now;

      const dot = document.createElement("span");
      dot.className = "dust-dot";
      const size = 4 + Math.random() * 10;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${e.clientX - size / 2}px`;
      dot.style.top = `${e.clientY - size / 2}px`;
      dot.style.opacity = "0.9";
      dot.style.transition = "opacity 900ms ease-out, transform 900ms ease-out";
      container.appendChild(dot);

      requestAnimationFrame(() => {
        dot.style.opacity = "0";
        dot.style.transform = `translate(${(Math.random() - 0.5) * 40}px, ${-15 - Math.random() * 25}px) scale(${0.4 + Math.random() * 0.8})`;
      });

      setTimeout(() => dot.remove(), 950);
    };

    window.addEventListener("pointermove", handle);
    return () => window.removeEventListener("pointermove", handle);
  }, []);

  return <div ref={containerRef} data-testid="cursor-dust-layer" />;
};
