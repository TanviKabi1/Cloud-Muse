import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Book, Trash2 } from "lucide-react";
import { fetchHistory, deleteDream } from "../lib/api";
import { toast } from "sonner";

export const HistoryDrawer = ({ onOpenDream, refreshKey }) => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchHistory();
      setItems(data);
    } catch {
      toast("Could not fetch saved dreams.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [refreshKey]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteDream(id);
      setItems((list) => list.filter((i) => i.id !== id));
      toast("A dream drifted away.");
    } catch {
      toast("Could not remove that dream.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          data-testid="history-open-btn"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/80 backdrop-blur-md text-slate-700 hover:bg-white/80 transition font-hand text-lg shadow-sm"
        >
          <Book className="w-4 h-4" />
          dream archive
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-white/70 backdrop-blur-2xl border-l border-white/80 w-[380px] sm:w-[420px]"
        data-testid="history-drawer"
      >
        <SheetHeader>
          <SheetTitle className="font-display text-2xl italic text-slate-800">dream archive</SheetTitle>
        </SheetHeader>
        <p className="font-hand text-indigo-400 mt-1">every topic you've whispered</p>

        <div className="mt-6 space-y-3 overflow-y-auto max-h-[80vh] pr-1">
          {loading && <p className="font-body text-slate-500">gathering clouds…</p>}
          {!loading && items.length === 0 && (
            <p className="font-hand text-lg text-slate-500">no dreams yet — whisper the first one into the clouds.</p>
          )}
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => { onOpenDream?.(it); setOpen(false); }}
              data-testid={`history-item-${it.id}`}
              className="group relative w-full text-left p-4 rounded-2xl bg-white/70 border border-white/90 hover:bg-white transition shadow-sm"
            >
              <p className="font-display text-lg text-slate-800 truncate">{it.topic}</p>
              <p className="font-body text-xs text-slate-500 mt-1">{new Date(it.created_at).toLocaleString()}</p>
              <p className="font-body text-sm text-slate-600 mt-2 line-clamp-2">{it.summary}</p>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => handleDelete(it.id, e)}
                onKeyDown={(e) => { if (e.key === "Enter") handleDelete(it.id, e); }}
                data-testid={`history-delete-${it.id}`}
                className="absolute top-2 right-2 p-1.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </span>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
