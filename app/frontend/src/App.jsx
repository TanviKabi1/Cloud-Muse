import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { Sparkles } from "lucide-react";

import { SkyBackground } from "@/components/SkyBackground";
import { CursorDust } from "@/components/CursorDust";
import { TopicCloud } from "@/components/TopicCloud";
import { GenerateButton } from "@/components/GenerateButton";
import { MagicalLoader } from "@/components/MagicalLoader";
import { BlogScroll } from "@/components/BlogScroll";
import { LinkedInPostcard } from "@/components/LinkedInPostcard";
import { SummaryOrb } from "@/components/SummaryOrb";
import { HistoryDrawer } from "@/components/HistoryDrawer";
import { SoundToggle } from "@/components/SoundToggle";
import { generateDream } from "@/lib/api";

const SUGGESTIONS = [
  "the philosophy of slow mornings",
  "how AI will reshape storytelling",
  "why nostalgia feels like a warm room",
  "the science of lucid dreaming",
];

const Home = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGenerate = async () => {
    const t = topic.trim();
    if (!t || loading) return;
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const data = await generateDream(t);
      setResult(data);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      const msg = e?.response?.data?.detail || "The muse is resting. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDream = (dream) => {
    setTopic(dream.topic);
    setResult(dream);
    setError("");
  };

  return (
    <div className="App min-h-screen">
      <SkyBackground />
      <CursorDust />
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: "bg-white/80 backdrop-blur-xl border border-white/80 !text-slate-700 font-body",
        }}
      />

      <header className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
          data-testid="app-brand"
        >
          <span className="relative w-10 h-10 rounded-full bg-gradient-to-br from-white to-indigo-200 border border-white shadow-[0_0_30px_rgba(255,255,255,0.7)] grid place-items-center">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </span>
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-slate-800 leading-none">CloudMuse</h1>
            <p className="font-hand text-sm text-indigo-400 -mt-0.5">content from clouds of thought</p>
          </div>
        </motion.div>

        <div className="flex items-center gap-2" data-testid="top-controls">
          <SoundToggle />
          <HistoryDrawer onOpenDream={handleOpenDream} refreshKey={refreshKey} />
        </div>
      </header>

      <section className="relative z-10 px-6 md:px-12 pt-8 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <p className="font-hand text-2xl text-pink-500">welcome, daydreamer</p>
            <h2 className="font-display text-5xl md:text-7xl text-slate-800 leading-tight glow-heading">
              <em className="not-italic">whisper a topic,</em>
              <br />
              <span className="italic text-indigo-500">watch it rain into words</span>
            </h2>
            <p className="mt-6 font-body text-slate-600 max-w-2xl mx-auto">
              CloudMuse weaves your idea into a heavenly scroll, a flying postcard, and a crystal of essence — all from a single breath of thought.
            </p>
          </motion.div>

          <TopicCloud value={topic} onChange={setTopic} onSubmit={handleGenerate} disabled={loading} />

          <div className="mt-8 flex justify-center">
            <GenerateButton
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              label={loading ? "dreaming…" : "summon the muse"}
            />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-3">
            {SUGGESTIONS.map((s, i) => (
              <motion.button
                key={s}
                whileHover={{ scale: 1.05, y: -2 }}
                onClick={() => setTopic(s)}
                data-testid={`suggestion-${i}`}
                className="px-4 py-1.5 rounded-full bg-white/50 border border-white/70 backdrop-blur-md text-slate-600 text-sm font-body hover:bg-white/80 transition"
              >
                ✦ {s}
              </motion.button>
            ))}
          </div>

          {error && (
            <p
              data-testid="error-msg"
              className="mt-8 text-center font-body text-rose-500 bg-white/60 rounded-full inline-block py-2 px-4 border border-rose-100 mx-auto"
            >
              {error}
            </p>
          )}
        </div>
      </section>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 px-6 pb-24"
          >
            <MagicalLoader />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && !loading && (
          <motion.section
            key={result.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 px-6 md:px-12 pb-32"
            data-testid="outputs-section"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
              <div className="md:col-span-7 md:mt-4">
                <BlogScroll topic={result.topic} content={result.blog} />
              </div>
              <div className="md:col-span-5 flex flex-col gap-14 md:mt-24">
                <SummaryOrb content={result.summary} />
                <LinkedInPostcard content={result.linkedin} />
              </div>
            </div>
            <div className="mt-24 text-center">
              <p className="font-hand text-2xl text-indigo-400/80">~ may your ideas drift far ~</p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {!result && !loading && (
        <footer className="relative z-10 pb-16 text-center">
          <p className="font-hand text-lg text-indigo-400/70">
            tip: hover the clouds, listen to the chimes, let the sky hold you
          </p>
        </footer>
      )}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
