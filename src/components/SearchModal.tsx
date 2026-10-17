import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Bot, ArrowRight, CornerDownLeft } from 'lucide-react';
import { ToolIcon } from '@/components/ToolIcon';
import type { WorkItem } from '@/data';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  items: WorkItem[];
  onOpenItem: (id: string) => void;
  onDone: (id: string) => void;
}

const TOOL_TAG: Record<string, { cls: string; label: string }> = {
  GitHub: { cls: 'bg-emerald-500/12 text-emerald-500 dark:text-emerald-400 border-emerald-500/25', label: 'GitHub' },
  Jira: { cls: 'bg-blue-500/12 text-blue-500 dark:text-blue-400 border-blue-500/25', label: 'Jira' },
  Slack: { cls: 'bg-amber-500/12 text-amber-500 dark:text-amber-400 border-amber-500/25', label: 'Slack' },
  default: { cls: 'bg-slate-500/12 text-slate-500 dark:text-slate-300 border-slate-500/25', label: 'Source' },
};

function toolTag(tool: string) {
  const key = Object.keys(TOOL_TAG).find((k) => tool.includes(k));
  return key ? TOOL_TAG[key] : TOOL_TAG.default;
}

export default function SearchModal({ open, onClose, items, onOpenItem, onDone }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = items.filter((i) => !i.done);
    if (!q) return base.slice(0, 5);
    return base
      .filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q) ||
          i.owner.toLowerCase().includes(q) ||
          i.why.toLowerCase().includes(q) ||
          i.citations.some((c) => c.text.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [query, items]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[active]) {
          const id = results[active].id;
          onClose();
          onOpenItem(id);
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, results, active, onClose, onOpenItem]);

  if (!open) return null;

  const topResult = results[0];
  const aiAnswer = query.trim()
    ? topResult
      : items.find((i) => i.blocked && !i.done);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-700 bg-elevated shadow-2xl animate-slide-fade"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3.5">
          <Search className="h-4.5 w-4.5 shrink-0 text-slate-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask WorkRadar or search across GitHub, Jira, Slack…"
            className="w-full bg-transparent text-sm font-medium text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
            ESC
          </kbd>
        </div>

        <div className="max-h-[58vh] overflow-y-auto p-3">
          {/* AI instant answer */}
          {aiAnswer && (
            <div className="mb-3 rounded-xl border border-brand/20 bg-brand/5 p-3.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-brand-light">
                  <Bot className="h-4 w-4" /> WorkRadar Instant Answer
                </span>
                <span className="rounded border border-brand/20 bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-brand-light">
                  {aiAnswer.citations.length} sources cited
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                <span className="font-mono font-semibold text-brand-light">{aiAnswer.id}</span> —{' '}
                {aiAnswer.why}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenItem(aiAnswer.id);
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-600"
                >
                  Open & Resolve <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDone(aiAnswer.id)}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800"
                >
                  Mark Done
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="space-y-0.5">
            <div className="px-1 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {results.length} matching {results.length === 1 ? 'item' : 'items'}
            </div>
            {results.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">No matches found. Try a different query.</div>
            ) : (
              results.map((item, idx) => {
                const tag = toolTag(item.citations[0]?.tool ?? '');
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onClose();
                      onOpenItem(item.id);
                    }}
                    onMouseEnter={() => setActive(idx)}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                      active === idx ? 'bg-slate-800/60' : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <span className={`flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-medium ${tag.cls}`}>
                      {tag.label !== 'Source' && <ToolIcon tool={tag.label} size={12} />}
                      {tag.label}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold text-brand-light">{item.id}</span>
                        <span className="truncate text-xs font-medium text-slate-100">{item.title}</span>
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-slate-500">
                        {item.owner} · {item.statusLabel} · Urgency {item.urgency}
                      </p>
                    </div>
                    {active === idx && (
                      <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/50 px-4 py-2.5 text-[11px] text-slate-500">
          <span>Cross-Tool AI Search</span>
          <span className="font-mono">{'\u2191\u2193'} navigate · {'\u21b5'} open · {'\u2318'}K toggle</span>
        </div>
      </div>
    </div>
  );
}
