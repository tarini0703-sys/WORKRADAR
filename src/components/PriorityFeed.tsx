import { useState } from 'react';
import TaskRow from '@/components/TaskRow';
import { Card } from '@/components/ui';
import type { FeedFilter, SnoozeDuration, WorkItem, ActivityEntry } from '@/data';

interface PriorityFeedProps {
  items: WorkItem[];
  activity: ActivityEntry[];
  onOpen: (id: string) => void;
  onAssign: (id: string, owner: string) => void;
  onDone: (id: string) => void;
  onSnooze: (id: string, d: SnoozeDuration) => void;
  onUnsnooze: (id: string) => void;
}

const FILTERS: { id: FeedFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'urgent', label: 'Immediate Attention' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'verified', label: 'Verified Only' },
  { id: 'done', label: 'Completed' },
  { id: 'snoozed', label: 'Snoozed' },
];

function matches(item: WorkItem, filter: FeedFilter): boolean {
  if (filter === 'done') return item.done;
  if (filter === 'snoozed') return item.snoozed;
  if (item.done || item.snoozed) return filter === 'all';
  if (filter === 'urgent') return item.urgency >= 80;
  if (filter === 'blocked') return item.blocked;
  if (filter === 'verified') return item.verifiedOnly;
  return true;
}

export default function PriorityFeed({ items, onOpen, onAssign, onDone, onSnooze, onUnsnooze }: PriorityFeedProps) {
  const [filter, setFilter] = useState<FeedFilter>('all');
  const filtered = items.filter((i) => matches(i, filter)).sort((a, b) => b.urgency - a.urgency);

  return (
    <div className="mx-auto max-w-5xl space-y-4 animate-fade-in">
      <div>
        <h1 className="text-lg font-bold text-slate-100">Priority Feed</h1>
        <p className="text-xs text-slate-500">Ordered by WorkRadar Urgency Score · deadline proximity + PR stagnation + blocker signals</p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {FILTERS.map((f) => {
          const count = f.id === 'all' ? items.filter((i) => !i.done && !i.snoozed).length : items.filter((i) => matches(i, f.id)).length;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                filter === f.id
                  ? 'bg-slate-200 text-slate-800'
                  : 'border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {f.label} <span className="ml-1 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      <Card>
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">No items in this filter.</div>
        ) : (
          <div className="space-y-0.5 p-2">
            {filtered.map((item) => (
              <TaskRow
                key={item.id}
                item={item}
                onOpen={onOpen}
                onAssign={onAssign}
                onDone={onDone}
                onSnooze={onSnooze}
                onUnsnooze={onUnsnooze}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
