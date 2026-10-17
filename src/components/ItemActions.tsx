import { Check, Clock, UserPlus, MoreHorizontal } from 'lucide-react';
import { Popover } from '@/components/Popover';
import { Avatar, initials } from '@/components/ui';
import { TEAM_MEMBERS, type SnoozeDuration } from '@/data';

interface ActionProps {
  owner: string;
  done: boolean;
  snoozed: boolean;
  onAssign: (owner: string) => void;
  onDone: () => void;
  onSnooze: (d: SnoozeDuration) => void;
  onUnsnooze?: () => void;
  compact?: boolean;
}

const SNOOZE_OPTIONS: { id: SnoozeDuration; label: string }[] = [
  { id: '2h', label: '2 hours' },
  { id: '4h', label: '4 hours' },
  { id: 'tomorrow', label: 'Until tomorrow' },
];

export function ItemActions({ owner, done, snoozed, onAssign, onDone, onSnooze, onUnsnooze, compact }: ActionProps) {
  return (
    <div className="flex items-center gap-1.5">
      {/* Mark Done */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDone();
        }}
        className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-200 ${
          done
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-600 text-transparent hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400'
        }`}
        aria-label={done ? 'Completed' : 'Mark done'}
        title={done ? 'Completed' : 'Mark done'}
      >
        <Check className="h-3.5 w-3.5" />
      </button>

      {/* Assign */}
      <Popover
        width={180}
        trigger={
          <button
            onClick={(e) => e.stopPropagation()}
            className={`flex items-center gap-1.5 rounded-full border px-1.5 py-1 text-[11px] font-medium transition-colors duration-200 ${
              compact ? 'border-transparent hover:bg-slate-800' : 'border-slate-700'
            }`}
            title="Assign"
          >
            {compact ? <UserPlus className="h-3.5 w-3.5 text-slate-500" /> : <Avatar name={owner} />}
            {!compact && <span className="text-slate-300">{owner.split(' ')[0]}</span>}
          </button>
        }
      >
        {(close) => (
          <div className="space-y-0.5">
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Assign to</div>
            {TEAM_MEMBERS.map((m) => (
              <button
                key={m}
                onClick={(e) => {
                  e.stopPropagation();
                  onAssign(m);
                  close();
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors ${
                  m === owner
                    ? 'bg-brand/10 text-brand-light'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Avatar name={m} />
                <span className="font-medium">{m}</span>
                {m === owner && <span className="ml-auto text-[10px] text-brand-light">current</span>}
              </button>
            ))}
          </div>
        )}
      </Popover>

      {/* Snooze */}
      <Popover
        width={160}
        trigger={
          <button
            onClick={(e) => e.stopPropagation()}
            className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors duration-200 ${
              snoozed
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-slate-600 text-slate-500 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400'
            }`}
            aria-label="Snooze"
            title="Snooze"
          >
            <Clock className="h-3.5 w-3.5" />
          </button>
        }
      >
        {(close) =>
          snoozed && onUnsnooze ? (
            <div className="space-y-0.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUnsnooze();
                  close();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700"
              >
                Unsnooze item
              </button>
            </div>
          ) : (
            <div className="space-y-0.5">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Snooze for</div>
              {SNOOZE_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSnooze(o.id);
                    close();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700"
                >
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  {o.label}
                </button>
              ))}
            </div>
          )
        }
      </Popover>
    </div>
  );
}

export { initials, MoreHorizontal };
