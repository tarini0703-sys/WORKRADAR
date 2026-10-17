import { Clock, ChevronRight } from 'lucide-react';
import { StatusBadge, TrustTag, ScorePill } from '@/components/ui';
import { ItemActions } from '@/components/ItemActions';
import type { SnoozeDuration, WorkItem } from '@/data';

interface TaskRowProps {
  item: WorkItem;
  onOpen: (id: string) => void;
  onAssign: (id: string, owner: string) => void;
  onDone: (id: string) => void;
  onSnooze: (id: string, d: SnoozeDuration) => void;
  onUnsnooze: (id: string) => void;
}

export default function TaskRow({ item, onOpen, onAssign, onDone, onSnooze, onUnsnooze }: TaskRowProps) {
  const faded = item.done || item.snoozed;
  return (
    <div
      onClick={() => onOpen(item.id)}
      className={`group flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/40 ${
        faded ? 'opacity-50' : ''
      }`}
    >
      {/* Mark done */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (item.done) onUnsnooze(item.id); else onDone(item.id);
        }}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
          item.done
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-600 text-transparent group-hover:border-emerald-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
        }`}
        aria-label="Mark done"
      >
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 6l2.5 2.5L10 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* ID + title */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-semibold text-brand-light">{item.id}</span>
          <span className={`truncate text-[13px] font-medium text-slate-100 ${item.done ? 'line-through' : ''}`}>
            {item.title}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <ScorePill score={item.urgency} />
          <StatusBadge status={item.status} label={item.statusLabel} />
          <TrustTag verified={item.verifiedOnly} label={item.verifiedOnly ? 'Verified' : 'Inferred'} />
          {item.snoozed && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
              <Clock className="h-3 w-3" /> Snoozed {item.snoozedUntil ?? ''}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div onClick={(e) => e.stopPropagation()}>
        <ItemActions
          owner={item.owner}
          done={item.done}
          snoozed={item.snoozed}
          onAssign={(o) => onAssign(item.id, o)}
          onDone={() => onDone(item.id)}
          onSnooze={(d) => onSnooze(item.id, d)}
          onUnsnooze={() => onUnsnooze(item.id)}
          compact
        />
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-slate-600 transition-transform group-hover:translate-x-0.5" />
    </div>
  );
}
