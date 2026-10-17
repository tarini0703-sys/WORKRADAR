import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import IntegrationsPanel from '@/components/IntegrationsPanel';
import Dashboard from '@/components/Dashboard';
import PriorityFeed from '@/components/PriorityFeed';
import Blockers from '@/components/Blockers';
import DetailPage from '@/components/DetailPage';
import StatesView from '@/components/StatesView';
import SearchModal from '@/components/SearchModal';
import { ToastProvider, useToast } from '@/components/Toast';
import { ThemeProvider } from '@/theme';
import { useStore } from '@/store';
import type { DataState, ScreenId, SnoozeDuration } from '@/data';

function WorkRadarApp() {
  const { showToast } = useToast();
  const store = useStore();

  const [screen, setScreen] = useState<ScreenId>('dashboard');
  const [dataState, setDataStateRaw] = useState<DataState>('live');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);

  const counts = useMemo(
    () => ({
      blocked: store.items.filter((i) => i.blocked && !i.done && !i.snoozed).length,
      urgent: store.items.filter((i) => i.urgency >= 80 && !i.done && !i.snoozed).length,
    }),
    [store.items]
  );

  const switchScreen = useCallback((s: ScreenId) => {
    setScreen(s);
    setDetailId(null);
  }, []);

  const setDataState = useCallback(
    (mode: DataState) => {
      setDataStateRaw(mode);
      if (mode === 'live') {
        if (!store.itemById('AUTH-104')) store.seedFresh();
        switchScreen('dashboard');
        showToast('Live data restored — all tools connected');
      } else if (mode === 'empty') {
        setScreen('states');
        setDetailId(null);
        showToast('Empty state: zero active blockers');
      } else if (mode === 'error') {
        setScreen('states');
        setDetailId(null);
        showToast('Error state: Slack OAuth expired — partial radar mode');
      }
    },
    [showToast, switchScreen, store]
  );

  const openItem = useCallback((id: string) => setDetailId(id), []);
  const closeDetail = useCallback(() => setDetailId(null), []);

  const handleAssign = useCallback(
    (id: string, owner: string) => {
      store.assign(id, owner);
      showToast(`Reassigned ${id} to ${owner}`);
    },
    [store, showToast]
  );

  const handleDone = useCallback(
    (id: string) => {
      const item = store.itemById(id);
      if (item?.done) {
        store.undoDone(id);
        showToast(`Reopened ${id}`);
      } else {
        store.markDone(id);
        showToast(`Marked ${id} as done`);
      }
    },
    [store, showToast]
  );

  const handleSnooze = useCallback(
    (id: string, d: SnoozeDuration) => {
      store.snooze(id, d);
      const labels: Record<SnoozeDuration, string> = { '2h': '2 hours', '4h': '4 hours', tomorrow: 'until tomorrow' };
      showToast(`Snoozed ${id} for ${labels[d]}`);
    },
    [store, showToast]
  );

  const handleUnsnooze = useCallback(
    (id: string) => {
      store.unsnooze(id);
      showToast(`Unsnoozed ${id}`);
    },
    [store, showToast]
  );

  const handleNudge = useCallback(
    (id: string) => {
      const item = store.itemById(id);
      if (item) {
        store.sendNudge(id, item.nudgeDraft);
        showToast(`Slack nudge sent to ${item.unblocker}`);
      }
    },
    [store, showToast]
  );

  const handleReset = useCallback(() => {
    store.reset();
    setDetailId(null);
    setScreen('dashboard');
    showToast('Demo data reset to defaults');
  }, [store, showToast]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === 'Escape') {
        if (searchOpen) {
          setSearchOpen(false);
        } else if (detailId) {
          setDetailId(null);
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [searchOpen, detailId]);

  const detailItem = detailId ? store.itemById(detailId) : null;

  const visibleItems = useMemo(() => {
    if (dataState === 'empty') {
      return store.items.map((i) => ({ ...i, done: true, status: 'done' as const, statusLabel: 'Done' }));
    }
    return store.items;
  }, [dataState, store.items]);

  const slackDegraded = dataState === 'error';

  return (
    <div className="flex h-screen overflow-hidden bg-canvas font-sans text-slate-400 antialiased transition-colors duration-200">
      <Sidebar
        active={screen}
        onSwitch={switchScreen}
        onOpenSearch={() => setSearchOpen(true)}
        dataState={dataState}
        counts={counts}
      />

      <div className="flex h-screen flex-1 flex-col overflow-hidden">
        <Header
          onOpenSearch={() => setSearchOpen(true)}
          dataState={dataState}
          setDataState={setDataState}
          onReset={handleReset}
          drawerOpen={drawerOpen}
          onToggleDrawer={() => setDrawerOpen((v) => !v)}
        />

        {slackDegraded && (
          <div className="flex items-center justify-between border-b border-amber-500/25 bg-amber-500/8 px-5 py-2.5 text-xs transition-colors animate-slide-up">
            <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>
                <strong>Slack OAuth Expired (2h ago)</strong> — Partial Radar Mode. GitHub & Jira verified signals are live; Slack AI-inferences are paused.
              </span>
            </div>
            <button
              onClick={() => setDataState('live')}
              className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 font-medium text-white transition-colors hover:bg-amber-600"
            >
              Reconnect Slack
            </button>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            {detailItem ? (
              <DetailPage
                item={detailItem}
                activity={store.activity}
                onBack={closeDetail}
                onAssign={handleAssign}
                onDone={handleDone}
                onSnooze={handleSnooze}
                onUnsnooze={handleUnsnooze}
                onSendNudge={(id, msg) => {
                  store.sendNudge(id, msg);
                  showToast(`Nudge sent to ${detailItem.unblocker}`);
                }}
              />
            ) : screen === 'dashboard' ? (
              <Dashboard
                items={visibleItems}
                activity={store.activity}
                onOpen={openItem}
                onAssign={handleAssign}
                onDone={handleDone}
                onSnooze={handleSnooze}
                onUnsnooze={handleUnsnooze}
                onNudge={handleNudge}
              />
            ) : screen === 'feed' ? (
              <PriorityFeed
                items={visibleItems}
                activity={store.activity}
                onOpen={openItem}
                onAssign={handleAssign}
                onDone={handleDone}
                onSnooze={handleSnooze}
                onUnsnooze={handleUnsnooze}
              />
            ) : screen === 'blockers' ? (
              <Blockers
                items={visibleItems}
                activity={store.activity}
                onOpen={openItem}
                onNudge={handleNudge}
              />
            ) : screen === 'states' ? (
              <StatesView dataState={dataState} setDataState={setDataState} />
            ) : null}
          </main>

          <IntegrationsPanel
            dataState={dataState}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          />
        </div>
      </div>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        items={store.items}
        onOpenItem={openItem}
        onDone={handleDone}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <WorkRadarApp />
      </ToastProvider>
    </ThemeProvider>
  );
}
