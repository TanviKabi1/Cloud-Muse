import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typewriter } from "./Typewriter";
import { CopyAction } from "./CopyAction";

const PaperBird = ({ onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.1, rotate: -6 }}
    whileTap={{ scale: 0.94 }}
    data-testid="paper-bird-toggle"
    className="relative w-40 h-40 grid place-items-center"
    aria-label="Unfold LinkedIn post"
  >
    <motion.svg
      viewBox="0 0 120 120"
      className="w-full h-full drop-shadow-[0_10px_30px_rgba(199,180,255,0.5)]"
      animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id="bird" x1="0" x2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fbcfe8" />
        </linearGradient>
      </defs>
      <path d="M10 60 L110 20 L80 110 L60 70 L10 60Z" fill="url(#bird)" stroke="rgba(180,170,220,0.7)" strokeWidth="1.5" />
      <path d="M60 70 L110 20" stroke="rgba(180,170,220,0.5)" strokeWidth="1.2" fill="none" />
      <path d="M10 60 L60 70" stroke="rgba(180,170,220,0.5)" strokeWidth="1.2" fill="none" />
    </motion.svg>
    <span className="absolute -bottom-1 font-hand text-lg text-indigo-400/80 whitespace-nowrap">unfold the bird for LinkedIn</span>
  </motion.button>
);

export const LinkedInPostcard = ({ content }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative flex flex-col items-center"
      data-testid="linkedin-postcard"
    >
      <p className="font-hand text-xl text-indigo-500 mb-2">a flying message</p>

      <AnimatePresence mode="wait">
        {!open ? (
          <motion.div
            key="bird"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7, rotate: 20 }}
            className="py-6"
          >
            <PaperBird onClick={() => setOpen(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="postcard"
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0, rotate: -2 }}
            exit={{ opacity: 0, rotateY: 90 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ rotate: 0 }}
            className="relative w-full max-w-md bg-[#FFFCF6] rounded-xl p-7 border border-pink-100 shadow-[0_25px_60px_rgba(164,172,210,0.35)]"
            data-testid="postcard-open"
          >
            <div className="absolute -top-3 -right-3 w-16 h-20 bg-gradient-to-br from-pink-200 to-indigo-200 border-2 border-white rounded-md grid place-items-center rotate-6 shadow-md">
              <span className="font-hand text-sm text-slate-700 leading-tight text-center">from<br />the sky</span>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="font-display italic text-pink-500">postcard</span>
              <button onClick={() => setOpen(false)} data-testid="postcard-fold" className="font-hand text-sm text-slate-400 hover:text-slate-700">
                fold back ↺
              </button>
            </div>

            <div className="font-body text-slate-700 whitespace-pre-wrap leading-relaxed text-[15px] min-h-[140px]">
              <Typewriter text={content || ""} />
            </div>

            <div className="mt-5 pt-4 border-t border-dashed border-pink-200 flex justify-end">
              <CopyAction text={content} testid="copy-linkedin" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
