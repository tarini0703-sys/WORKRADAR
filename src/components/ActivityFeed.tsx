import { GitMerge, CheckCircle2, MessageSquare, RotateCcw, Clock, UserPlus } from 'lucide-react';
import type { ActivityEntry } from '@/data';

interface ActivityFeedProps {
  activity: ActivityEntry[];
}

const ICONS: Record<string, typeof GitMerge> = {
  merged: GitMerge,
  resolved: CheckCircle2,
  discussed: MessageSquare,
  'marked done': CheckCircle2,
  assigned: UserPlus,
  snoozed: Clock,
  unsnoozed: RotateCcw,
  'sent nudge': MessageSquare,
  reopened: RotateCcw,
};

const ICON_COLOR: Record<string, string> = {
  merged: 'text-emerald-600 dark:text-emerald-400',
  resolved: 'text-emerald-600 dark:text-emerald-400',
  'marked done': 'text-emerald-600 dark:text-emerald-400',
  discussed: 'text-amber-600 dark:text-amber-400',
  'sent nudge': 'text-brand',
  assigned: 'text-blue-600 dark:text-blue-400',
  snoozed: 'text-amber-600 dark:text-amber-400',
};

export default function ActivityFeed({ activity }: ActivityFeedProps) {
  return (
    <div className="space-y-1">
      {activity.map((a) => {
        const Icon = ICONS[a.action] ?? GitMerge;
        const color = ICON_COLOR[a.action] ?? 'text-slate-500';
        return (
          <div key={a.id} className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-slate-900/40">
            <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${color}`} />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-300">
                <span className="font-semibold">{a.actor}</span>{' '}
                <span className="text-slate-500">{a.action}</span>{' '}
                <span className="text-slate-300">{a.detail}</span>
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500">{a.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
