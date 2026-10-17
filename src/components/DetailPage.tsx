import { useState } from 'react';
import {
  ArrowLeft, CheckCircle2, Sparkles, MessageSquare, Pin, Clock, Wrench,
} from 'lucide-react';
import { Avatar, StatusBadge, TrustTag, ScorePill } from '@/components/ui';
import { ItemActions } from '@/components/ItemActions';
import { ToolIcon } from '@/components/ToolIcon';
import ActivityFeed from '@/components/ActivityFeed';
import { type SnoozeDuration, type WorkItem, type ActivityEntry } from '@/data';

interface DetailPageProps {
  item: WorkItem;
  activity: ActivityEntry[];
  onBack: () => void;
  onAssign: (id: string, owner: string) => void;
  onDone: (id: string) => void;
  onSnooze: (id: string, d: SnoozeDuration) => void;
  onUnsnooze: (id: string) => void;
  onSendNudge: (id: string, msg: string) => void;
}

export default function DetailPage({
  item, activity, onBack, onAssign, onDone, onSnooze, onUnsnooze, onSendNudge,
}: DetailPageProps) {
  const [nudge, setNudge] = useState(item.nudgeDraft);
  const [sent, setSent] = useState(false);
  const itemActivity = activity.filter((a) => a.itemId === item.id);

  const handleSend = () => {
    onSendNudge(item.id, nudge);
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

  return (
    <div className="mx-auto max-w-4xl animate-slide-up">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-200"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      <div className="space-y-5">
        {/* Header */}
        <div className="rounded-xl border border-slate-800 bg-surface p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-brand-light">{item.id}</span>
                <StatusBadge status={item.status} label={item.statusLabel} />
                <ScorePill score={item.urgency} />
                {item.snoozed && (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                    <Clock className="h-3 w-3" /> Snoozed {item.snoozedUntil}
                  </span>
                )}
              </div>
              <h1 className="text-xl font-bold text-slate-100">{item.title}</h1>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  Owner <Avatar name={item.owner} /> <span className="font-medium text-slate-300">{item.owner}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  Unblocker <Avatar name={item.unblocker} /> <span className="font-medium text-slate-300">{item.unblocker}</span>
                </span>
              </div>
            </div>

            {/* Action bar */}
            <div className="flex items-center gap-2">
              <ItemActions
                owner={item.owner}
                done={item.done}
                snoozed={item.snoozed}
                onAssign={(o) => onAssign(item.id, o)}
                onDone={() => onDone(item.id)}
                onSnooze={(d) => onSnooze(item.id, d)}
                onUnsnooze={() => onUnsnooze(item.id)}
              />
            </div>
          </div>

          {/* Why urgent */}
          <div className="mt-4 rounded-xl border border-brand/20 bg-brand/5 p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-light">
              <Sparkles className="h-3.5 w-3.5" /> Copilot Reasoning
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-200">{item.why}</p>
          </div>
        </div>

        {/* Verified vs Inferred */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Verified Tool Facts
              </span>
              <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">Ground Truth</span>
            </div>
            <ul className="mt-3 space-y-2">
              {item.verifiedFacts.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-amber-400">
                <Sparkles className="h-4 w-4" /> AI-Inferred Signal
              </span>
              <span className="rounded bg-amber-500/15 px-1.5 py-0.5 font-mono text-[10px] text-amber-600 dark:text-amber-400">{item.confidence}</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-300">{item.inferredText}</p>
          </div>
        </div>

        {/* Citations */}
        <div className="rounded-xl border border-slate-800 bg-surface p-5">
          <h3 className="text-[13px] font-semibold text-slate-100">Source Citations</h3>
          <p className="mt-0.5 text-[11px] text-slate-500">Click any artifact to open the original source</p>
          <div className="mt-3 space-y-2.5">
            {item.citations.map((c, i) => (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 transition-colors hover:border-slate-700">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <ToolIcon tool={c.tool} size={14} />
                    <span className="font-semibold text-slate-200">{c.tool}</span>
                    <TrustTag verified={c.badge.includes('Verified')} label={c.badge} />
                  </div>
                  <span className="font-mono text-slate-500">{c.time}</span>
                </div>
                <p className="mt-2 rounded-lg border border-slate-800 bg-surface p-2.5 font-mono text-xs text-slate-300">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Nudge composer + Activity log */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="md:col-span-3 rounded-xl border border-slate-800 bg-surface p-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-100">
                <Wrench className="h-3.5 w-3.5" /> Blocker Resolution Nudge
              </span>
              <span className="text-[11px] text-slate-500">To <strong className="text-brand-light">{item.unblocker}</strong></span>
            </div>
            <textarea
              rows={4}
              value={nudge}
              onChange={(e) => setNudge(e.target.value)}
              className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-900/50 p-3 text-sm text-slate-200 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={handleSend}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-all duration-200 ${
                  sent ? 'bg-emerald-500' : 'bg-brand hover:bg-brand-600'
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" /> {sent ? 'Sent via Slack' : 'Send Slack Nudge'}
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-slate-800 px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800">
                <Pin className="h-3.5 w-3.5" /> Pin to Standup
              </button>
            </div>
          </div>

          <div className="md:col-span-2 rounded-xl border border-slate-800 bg-surface p-5">
            <h3 className="text-[13px] font-semibold text-slate-100">Activity Log</h3>
            <div className="mt-3">
              {itemActivity.length === 0 ? (
                <p className="text-xs text-slate-500">No manager actions yet.</p>
              ) : (
                <ActivityFeed activity={itemActivity} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
