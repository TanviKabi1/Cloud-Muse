import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const CHIME_URL =
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_8cb749d484.mp3?filename=wind-chimes-a-74607.mp3";

export const SoundToggle = () => {
  const [on, setOn] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      const a = new Audio(CHIME_URL);
      a.loop = true;
      a.volume = 0.18;
      audioRef.current = a;
    }
    if (on) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [on]);

  useEffect(() => () => audioRef.current?.pause(), []);

  return (
    <button
      onClick={() => setOn((v) => !v)}
      data-testid="sound-toggle"
      aria-label={on ? "Mute wind chimes" : "Play wind chimes"}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/80 backdrop-blur-md text-slate-700 hover:bg-white/80 transition font-hand text-lg shadow-sm"
    >
      {on ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      <span>{on ? "chimes on" : "chimes off"}</span>
    </button>
  );
};
