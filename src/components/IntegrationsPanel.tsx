import { useState } from 'react';
import { Check, AlertTriangle, Filter, X } from 'lucide-react';
import { ToolIcon } from '@/components/ToolIcon';
import type { DataState } from '@/data';

interface IntegrationsPanelProps {
  dataState: DataState;
  open: boolean;
  onClose: () => void;
}

interface Integration {
  name: string;
  iconBg: string;
  detail: string;
  defaultConnected: boolean;
}

const INTEGRATIONS: Integration[] = [
  {
    name: 'Slack',
    iconBg: 'bg-violet-500/10',
    detail: '#proj-auth, #proj-billing',
    defaultConnected: true,
  },
  {
    name: 'Gmail',
    iconBg: 'bg-red-500/10',
    detail: 'Team inbox & threads',
    defaultConnected: true,
  },
  {
    name: 'Google Drive',
    iconBg: 'bg-emerald-500/10',
    detail: 'Docs, specs, design files',
    defaultConnected: true,
  },
  {
    name: 'Google Calendar',
    iconBg: 'bg-blue-500/10',
    detail: 'Sprint events, PTO, meetings',
    defaultConnected: true,
  },
  {
    name: 'Jira',
    iconBg: 'bg-blue-500/10',
    detail: 'Sprint tickets, story points',
    defaultConnected: true,
  },
  {
    name: 'GitHub',
    iconBg: 'bg-slate-700/40',
    detail: 'PRs, commits, CI builds',
    defaultConnected: true,
  },
];

const STORAGE_KEY = 'workradar-integrations';

function loadConnectedStates(dataState: DataState): Record<string, boolean> {
  const defaults: Record<string, boolean> = {};
  for (const int of INTEGRATIONS) {
    if (int.name === 'Slack' && dataState === 'error') {
      defaults[int.name] = false;
    } else {
      defaults[int.name] = int.defaultConnected;
    }
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Record<string, boolean>;
      if (dataState === 'error' && 'Slack' in parsed) {
        parsed['Slack'] = false;
      }
      return { ...defaults, ...parsed };
    }
  } catch {
    /* ignore */
  }
  return defaults;
}

export default function IntegrationsPanel({ dataState, open, onClose }: IntegrationsPanelProps) {
  const [connected, setConnected] = useState<Record<string, boolean>>(() => loadConnectedStates(dataState));

  const toggleConnected = (name: string) => {
    setConnected((prev) => {
      const next = { ...prev, [name]: !prev[name] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed right-0 top-0 z-40 flex h-screen w-[280px] shrink-0 flex-col border-l border-slate-800 bg-surface transition-transform duration-200 ease-out lg:static lg:z-auto lg:translate-x-0 ${
          open ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        } ${!open ? 'lg:hidden' : ''}`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 px-4">
          <span className="text-sm font-semibold text-slate-200">Integrations</span>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Connected Integrations */}
          <div className="space-y-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">Connected Tools</div>
            {INTEGRATIONS.map((int) => {
              const isConnected = connected[int.name] ?? false;
              const isSlackError = int.name === 'Slack' && dataState === 'error';
              const isDisabled = isSlackError;
              const showConnected = isConnected && !isSlackError;
              return (
                <div
                  key={int.name}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-3 transition-colors hover:border-slate-700"
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${int.iconBg}`}>
                    <ToolIcon tool={int.name} size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-slate-200">{int.name}</div>
                    <div className="text-[10px] text-slate-500">{int.detail}</div>
                  </div>
                  {isDisabled ? (
                    <span className="flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-500 dark:text-rose-400">
                      <AlertTriangle className="h-2.5 w-2.5" />
                      Expired
                    </span>
                  ) : showConnected ? (
                    <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                      <Check className="h-2.5 w-2.5" />
                      Connected
                    </span>
                  ) : (
                    <button
                      onClick={() => toggleConnected(int.name)}
                      className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-[10px] font-medium text-slate-400 transition-colors hover:border-brand/40 hover:bg-brand/10 hover:text-brand-light"
                    >
                      Connect
                    </button>
                  )}
                  {showConnected && !isDisabled && (
                    <button
                      onClick={() => toggleConnected(int.name)}
                      className="ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded text-slate-500 transition-colors hover:text-slate-300"
                      title="Disconnect"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Filters */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              <Filter className="h-3 w-3" /> Quick Filters
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Urgent', 'Blocked', 'Verified', 'Stale PRs', 'Sprint 24'].map((f) => (
                <button
                  key={f}
                  className="rounded-lg border border-slate-800 bg-slate-900/50 px-2.5 py-1 text-[11px] font-medium text-slate-400 transition-colors hover:border-brand/40 hover:bg-brand/10 hover:text-brand-light"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Sync status */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Last Sync</span>
              <span className="text-[10px] font-mono text-slate-500">2 min ago</span>
            </div>
            <div className="mt-2.5 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-500">
                  <ToolIcon tool="GitHub" size={14} /> GitHub events
                </span>
                <span className="font-mono text-slate-300">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-500">
                  <ToolIcon tool="Jira" size={14} /> Jira updates
                </span>
                <span className="font-mono text-slate-300">9</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-500">
                  <ToolIcon tool="Slack" size={14} /> Slack messages
                </span>
                <span className="font-mono text-slate-300">48</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
