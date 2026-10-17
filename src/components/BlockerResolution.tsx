import { ArrowRight, MessageSquare, Pin } from 'lucide-react';
import { Avatar } from '@/components/ui';
import type { WorkItem } from '@/data';

interface BlockerResolutionProps {
  item: WorkItem;
  onOpen: (id: string) => void;
  onNudge: (id: string) => void;
}

export default function BlockerResolution({ item, onOpen, onNudge }: BlockerResolutionProps) {
  if (!item.blockerChain) return null;
  const { from, artifact, to } = item.blockerChain;

  return (
    <div
      onClick={() => onOpen(item.id)}
      className="group cursor-pointer rounded-xl border border-slate-800 p-3.5 transition-all duration-200 hover:border-slate-700"
    >
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
        <span className="font-mono text-brand-light">{item.id}</span>
        <span>·</span>
        <span>{item.statusLabel}</span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Avatar name={from} size="md" />
          <div className="leading-tight">
            <div className="text-xs font-semibold text-slate-100">{from}</div>
            <div className="text-[10px] text-rose-500 dark:text-rose-400">Blocked</div>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center px-2">
          <span className="font-mono text-[10px] text-slate-500">{artifact}</span>
          <ArrowRight className="h-4 w-4 text-slate-600" />
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right leading-tight">
            <div className="text-xs font-semibold text-slate-100">{to}</div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Can unblock</div>
          </div>
          <Avatar name={to} size="md" />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onNudge(item.id)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-600"
        >
          <MessageSquare className="h-3.5 w-3.5" /> Send Slack Nudge
        </button>
        <button className="flex items-center justify-center rounded-lg border border-slate-800 px-2.5 py-2 text-slate-500 transition-colors hover:bg-slate-800">
          <Pin className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
