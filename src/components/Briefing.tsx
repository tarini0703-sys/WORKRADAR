import { useEffect, useState } from 'react';
import { Bot, RefreshCw, Sparkles } from 'lucide-react';
import type { WorkItem } from '@/data';

interface BriefingProps {
  items: WorkItem[];
}

export default function Briefing({ items }: BriefingProps) {
  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState(0);

  const active = items.filter((i) => !i.done && !i.snoozed);
  const doneToday = items.filter((i) => i.done).length;
  const snoozed = items.filter((i) => i.snoozed).length;
  const blocked = active.filter((i) => i.blocked).length;
  const urgent = active.filter((i) => i.urgency >= 80).length;

  const onTrackPct = active.length === 0 ? 100 : Math.round((active.filter((i) => i.status === 'on-track').length / active.length) * 100);
  const topBlocker = active.find((i) => i.blocked);

  const headline = topBlocker
    ? `Sprint 24 is ${onTrackPct}% on track, but ${topBlocker.owner.split(' ')[0]} is blocked on ${topBlocker.id} (${topBlocker.statusLabel.toLowerCase()}) — needs ${topBlocker.unblocker.split(' ')[0]}'s sign-off before tomorrow's cutoff.`
    : `Sprint 24 is ${onTrackPct}% on track with no active blockers. All squad members are moving smoothly.`;

  const regenerate = () => {
    setLoading(true);
    setVersion((v) => v + 1);
  };

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, [loading, version]);

  const metrics = [
    { label: 'Immediate Attention', value: urgent, color: 'text-rose-500 dark:text-rose-400' },
    { label: 'Active Blockers', value: blocked, color: 'text-amber-500 dark:text-amber-400' },
    { label: 'Snoozed', value: snoozed, color: 'text-slate-500 dark:text-slate-400' },
    { label: 'Completed Today', value: doneToday, color: 'text-emerald-600 dark:text-emerald-400' },
  ];

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-surface p-5 transition-colors duration-200">
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-brand/8 via-brand/5 to-transparent" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-600 text-white shadow-glow">
            <Bot className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-light">Morning Briefing</span>
              <span className="rounded-full border border-emerald-500/25 bg-emerald-500/12 px-2 py-0.5 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                Saved ~38m
              </span>
            </div>
            {loading ? (
              <div className="space-y-2">
                <div className="h-3.5 w-[460px] max-w-full rounded shimmer-bg animate-shimmer" />
                <div className="h-3.5 w-[320px] max-w-full rounded shimmer-bg animate-shimmer" />
              </div>
            ) : (
              <p className="max-w-2xl text-sm leading-relaxed text-slate-200">
                {headline}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={regenerate}
          disabled={loading}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-700 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          Regenerate
        </button>
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-2">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-1.5"
          >
            <span className="text-[10px] uppercase tracking-wider text-slate-500">{m.label}</span>
            <span className={`text-sm font-bold ${m.color}`}>{m.value}</span>
          </div>
        ))}
        <span className="flex items-center gap-1 text-[10px] text-slate-500">
          <Sparkles className="h-3 w-3" /> Recalculated on every action
        </span>
      </div>
    </div>
  );
}
