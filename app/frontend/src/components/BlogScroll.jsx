import { motion } from "framer-motion";
import { Typewriter } from "./Typewriter";
import { CopyAction } from "./CopyAction";

const renderMarkdown = (md) => {
  const lines = md.split("\n");
  const blocks = [];
  let buffer = [];
  const flush = () => {
    if (buffer.length) {
      blocks.push({ type: "p", text: buffer.join(" ") });
      buffer = [];
    }
  };
  lines.forEach((raw) => {
    const line = raw.trim();
    if (!line) flush();
    else if (line.startsWith("## ")) { flush(); blocks.push({ type: "h2", text: line.replace(/^##\s+/, "") }); }
    else if (line.startsWith("# "))  { flush(); blocks.push({ type: "h1", text: line.replace(/^#\s+/, "") }); }
    else if (line.startsWith("- ") || line.startsWith("* ")) { flush(); blocks.push({ type: "li", text: line.replace(/^[-*]\s+/, "") }); }
    else buffer.push(line);
  });
  flush();
  return blocks;
};

export const BlogScroll = ({ topic, content }) => {
  const blocks = renderMarkdown(content || "");

  return (
    <motion.article
      initial={{ opacity: 0, y: 30, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      data-testid="blog-scroll"
      className="relative"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="relative bg-white/55 backdrop-blur-xl rounded-[28px] border border-white/80 shadow-[0_25px_70px_rgba(164,172,210,0.35)] overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-pink-100/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-indigo-100/80 to-transparent" />

        <div className="p-8 md:p-12">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="font-hand text-xl text-pink-500">a heavenly scroll</p>
              <h3 className="font-display text-3xl md:text-4xl text-slate-800 mt-1 glow-heading">{topic}</h3>
            </div>
            <CopyAction text={content} testid="copy-blog" />
          </div>

          <div className="space-y-5 font-body text-slate-700 leading-relaxed text-[17px]">
            {blocks.map((b, i) => {
              if (b.type === "h2" || b.type === "h1") {
                return <h4 key={i} className="font-display text-2xl text-indigo-500 mt-6"><Typewriter text={b.text} /></h4>;
              }
              if (b.type === "li") {
                return (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0" />
                    <Typewriter text={b.text} />
                  </div>
                );
              }
              return <p key={i}><Typewriter text={b.text} /></p>;
            })}
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
};
