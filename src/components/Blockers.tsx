import BlockerResolution from '@/components/BlockerResolution';
import ActivityFeed from '@/components/ActivityFeed';
import { Card, SectionTitle } from '@/components/ui';
import type { WorkItem, ActivityEntry } from '@/data';

interface BlockersProps {
  items: WorkItem[];
  activity: ActivityEntry[];
  onOpen: (id: string) => void;
  onNudge: (id: string) => void;
}

export default function Blockers({ items, activity, onOpen, onNudge }: BlockersProps) {
  const blockers = items.filter((i) => i.blocked && !i.done && !i.snoozed);

  return (
    <div className="mx-auto max-w-5xl space-y-4 animate-fade-in">
      <div>
        <h1 className="text-lg font-bold text-slate-100">Blockers</h1>
        <p className="text-xs text-slate-500">Dependency chains mapped from tool metadata — no manual check-ins required</p>
      </div>

      {blockers.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
              <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 10l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-100">Zero active blockers</h3>
            <p className="mt-1 max-w-sm text-xs text-slate-500">
              WorkRadar analyzed 24 GitHub events, 9 Jira updates, and 48 Slack messages overnight. All squad members are moving smoothly.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {blockers.map((b) => (
            <Card key={b.id}>
              <BlockerResolution item={b} onOpen={onOpen} onNudge={onNudge} />
            </Card>
          ))}
        </div>
      )}

      <Card>
        <SectionTitle>Blocker Resolution Activity</SectionTitle>
        <div className="px-2 pb-3">
          <ActivityFeed activity={activity.filter((a) => a.action.includes('nudge') || a.action.includes('assigned') || a.action.includes('done')).slice(0, 8)} />
        </div>
      </Card>
    </div>
  );
}
