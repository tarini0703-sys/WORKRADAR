import { useState } from 'react';
import Briefing from '@/components/Briefing';
import TaskRow from '@/components/TaskRow';
import BlockerResolution from '@/components/BlockerResolution';
import ActivityFeed from '@/components/ActivityFeed';
import { Card, SectionTitle } from '@/components/ui';
import type { SnoozeDuration, WorkItem, ActivityEntry } from '@/data';

interface DashboardProps {
  items: WorkItem[];
  activity: ActivityEntry[];
  onOpen: (id: string) => void;
  onAssign: (id: string, owner: string) => void;
  onDone: (id: string) => void;
  onSnooze: (id: string, d: SnoozeDuration) => void;
  onUnsnooze: (id: string) => void;
  onNudge: (id: string) => void;
}

export default function Dashboard({
  items, activity, onOpen, onAssign, onDone, onSnooze, onUnsnooze, onNudge,
}: DashboardProps) {
  const [tab, setTab] = useState<'active' | 'snoozed' | 'done'>('active');

  const active = items.filter((i) => !i.done && !i.snoozed).sort((a, b) => b.urgency - a.urgency);
  const snoozed = items.filter((i) => i.snoozed);
  const done = items.filter((i) => i.done);
  const blockers = active.filter((i) => i.blocked && i.blockerChain);

  const tabItems = tab === 'active' ? active : tab === 'snoozed' ? snoozed : done;

  return (
    <div className="mx-auto max-w-6xl space-y-5 animate-fade-in">
      <Briefing items={items} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left column 60% */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <h2 className="text-[13px] font-semibold text-slate-100">Immediate Attention & Priorities</h2>
              <div className="flex items-center gap-1 rounded-lg bg-slate-800/60 p-0.5 text-[11px]">
                {([['active', `Active (${active.length})`], ['snoozed', `Snoozed (${snoozed.length})`], ['done', `Done (${done.length})`]] as const).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={`rounded-md px-2 py-1 font-medium transition-all duration-200 ${
                      tab === id
                        ? 'bg-slate-200 text-slate-800'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-2 pb-2">
              {tabItems.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-500">
                  {tab === 'done' ? 'No completed items yet.' : tab === 'snoozed' ? 'Nothing snoozed.' : 'All clear — no active items.'}
                </div>
              ) : (
                <div className="space-y-0.5">
                  {tabItems.map((item) => (
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
            </div>
          </Card>
        </div>

        {/* Right column 40% */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <SectionTitle>Active Blocker Resolution</SectionTitle>
            <div className="space-y-3 px-3 pb-4">
              {blockers.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500">No active blockers — all clear.</div>
              ) : (
                blockers.map((b) => (
                  <BlockerResolution key={b.id} item={b} onOpen={onOpen} onNudge={onNudge} />
                ))
              )}
            </div>
          </Card>

          <Card>
            <SectionTitle
              right={<span className="text-[10px] font-medium text-slate-500">Auto-ingested</span>}
            >
              What Happened Today
            </SectionTitle>
            <div className="px-2 pb-3">
              <ActivityFeed activity={activity.slice(0, 6)} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
