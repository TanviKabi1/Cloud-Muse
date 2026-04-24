import { motion } from "framer-motion";
import { Typewriter } from "./Typewriter";
import { CopyAction } from "./CopyAction";

export const SummaryOrb = ({ content }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="relative flex flex-col items-center"
      data-testid="summary-orb"
    >
      <p className="font-hand text-xl text-pink-500 mb-3">a crystal of essence</p>
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div
          className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full pulse-glow"
          style={{
            background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.95), rgba(255,255,255,0.35) 55%, rgba(224,210,255,0.2) 100%)",
            border: "1px solid rgba(255,255,255,0.8)",
            backdropFilter: "blur(18px)",
          }}
        >
          <div
            className="absolute top-6 left-8 w-16 h-10 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)" }}
          />
          <div className="absolute inset-0 grid place-items-center p-10">
            <p className="font-display italic text-slate-700 text-center text-lg md:text-xl leading-relaxed">
              <Typewriter text={content || ""} />
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mt-6">
        <CopyAction text={content} testid="copy-summary" />
      </div>
    </motion.div>
  );
};
