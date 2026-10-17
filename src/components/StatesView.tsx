import { CheckCircle2, Zap, RotateCcw, AlertTriangle } from 'lucide-react';
import { ToolIcon } from '@/components/ToolIcon';
import type { DataState } from '@/data';

interface StatesViewProps {
  dataState: DataState;
  setDataState: (s: DataState) => void;
}

export default function StatesView({ dataState, setDataState }: StatesViewProps) {
  return (
    <div className="mx-auto max-w-5xl space-y-5 animate-fade-in">
      <div>
        <h1 className="text-lg font-bold text-slate-100">Empty & Error States</h1>
        <p className="text-xs text-slate-500">UX states for (A) zero active blockers and (B) disconnected tool / partial radar mode</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Empty state */}
        <div className="rounded-xl border border-slate-800 bg-surface p-8 text-center transition-colors">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <span className="mt-4 inline-block rounded-full border border-emerald-500/25 bg-emerald-500/12 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Empty State · All Clear
          </span>
          <h3 className="mt-3 text-base font-bold text-slate-100">Zero Active Blockers Detected</h3>
          <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-slate-500">
            WorkRadar analyzed 24 GitHub events, 9 Jira ticket updates, and 48 public Slack messages overnight. All 9 squad members are moving smoothly with no stalled PRs.
          </p>

          <div className="mx-auto mt-5 max-w-sm space-y-2 rounded-xl border border-slate-800 bg-slate-900/50 p-3.5 text-left text-xs">
            <div className="font-semibold text-slate-300">Low-priority watchlist (non-blocking)</div>
            <div className="flex items-center justify-between text-slate-500">
              <span>PR #408 opened 3h ago by @Marcus</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">CI Passing</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>@Elena scheduled PTO on Friday</span>
              <span className="font-mono text-slate-500">Calendar</span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2.5">
            <button
              onClick={() => setDataState('live')}
              className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-100 transition-colors hover:bg-slate-700"
            >
              Restore Live Data
            </button>
            <button className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800">
              View resolved blockers
            </button>
          </div>
        </div>

        {/* Error state */}
        <div className="rounded-xl border border-slate-800 bg-surface p-8 transition-colors">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/12 text-amber-600 dark:text-amber-400">
              <Zap className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <span className="inline-block rounded bg-amber-500/12 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Error · Graceful Degradation
              </span>
              <h3 className="text-base font-bold text-slate-100">Slack Integration Disconnected</h3>
              <p className="text-xs leading-relaxed text-slate-500">
                WorkRadar is running in <strong className="text-slate-300">Verified-Only Partial Mode</strong>. Objective signals from GitHub and Jira remain live, while AI-inferred conversational signals from Slack are paused.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2 rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-xs">
            <div className="font-semibold text-slate-300">Tool ingestion diagnostics</div>
            {([
              { tool: 'GitHub', label: 'GitHub Webhook Stream (PRs & Commits)', val: 'Connected', cls: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/12 border-emerald-500/25' },
              { tool: 'Jira', label: 'Jira Cloud API (Sprint Tickets)', val: 'Connected', cls: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/12 border-emerald-500/25' },
              { tool: 'Slack', label: 'Slack Public Channels (#proj-auth, #billing)', val: 'Token Expired (401)', cls: 'text-rose-500 dark:text-rose-400 bg-rose-500/12 border-rose-500/25' },
            ] as { tool: string; label: string; val: string; cls: string }[]).map((r) => {
              return (
                <div key={r.label} className="flex items-center justify-between border-b border-slate-800 py-1.5 last:border-0">
                  <span className="flex items-center gap-2 font-medium text-slate-300">
                    <ToolIcon tool={r.tool} size={16} /> {r.label}
                  </span>
                  <span className={`rounded border px-2 py-0.5 font-mono text-[10px] ${r.cls}`}>{r.val}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-center gap-2.5">
            <button
              onClick={() => setDataState('live')}
              className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-600"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reconnect Slack
            </button>
            <button
              onClick={() => setDataState('live')}
              className="rounded-lg border border-slate-800 px-3.5 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800"
            >
              Continue with partial mode
            </button>
          </div>
        </div>
      </div>

      {/* Global error banner preview */}
      {dataState === 'error' && (
        <div className="flex items-center justify-between rounded-xl border border-amber-500/25 bg-amber-500/8 px-5 py-3 text-xs animate-slide-up">
          <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              <strong>Slack OAuth Token Expired (2h ago)</strong> — Running in Partial Radar Mode. Verified GitHub & Jira signals are live, but AI-inferred conversational blockers from Slack are paused.
            </span>
          </div>
          <button
            onClick={() => setDataState('live')}
            className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 font-medium text-white dark:bg-amber-500 transition-colors hover:bg-amber-600"
          >
            Reconnect
          </button>
        </div>
      )}
    </div>
  );
}
