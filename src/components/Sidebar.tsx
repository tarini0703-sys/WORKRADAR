import { Radar, LayoutDashboard, Flame, Ban, Search, ChevronDown, ShieldCheck, Users } from 'lucide-react';
import { ToolIcon } from '@/components/ToolIcon';
import type { ScreenId, DataState } from '@/data';
import { TEAM_MEMBERS } from '@/data';
import { initials } from '@/components/ui';

interface SidebarProps {
  active: ScreenId;
  onSwitch: (s: ScreenId) => void;
  onOpenSearch: () => void;
  dataState: DataState;
  counts: { blocked: number; urgent: number };
}

const NAV: { id: ScreenId; label: string; icon: typeof Radar; badge?: (c: { blocked: number; urgent: number }) => { text: string; cls: string } | null }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    id: 'feed',
    label: 'Priority Feed',
    icon: Flame,
    badge: (c) => c.urgent > 0 ? { text: String(c.urgent), cls: 'bg-rose-500/15 text-rose-500 dark:text-rose-400' } : null,
  },
  {
    id: 'blockers',
    label: 'Blockers',
    icon: Ban,
    badge: (c) => c.blocked > 0 ? { text: String(c.blocked), cls: 'bg-amber-500/15 text-amber-500 dark:text-amber-400' } : null,
  },
  { id: 'states', label: 'Edge States', icon: ShieldCheck },
];

const AVATAR_COLORS: Record<string, string> = {
  'Devin K.': 'bg-rose-500/20 text-rose-300',
  'Elena R.': 'bg-amber-500/20 text-amber-300',
  'Marcus V.': 'bg-blue-500/20 text-blue-300',
  'Sarah L.': 'bg-indigo-500/20 text-indigo-300',
  'Liam T.': 'bg-emerald-500/20 text-emerald-300',
};

export default function Sidebar({ active, onSwitch, onOpenSearch, dataState, counts }: SidebarProps) {
  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-slate-800 bg-rail transition-colors duration-200">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2.5 px-4">
        <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-600 text-white shadow-sm">
          <Radar className="h-4 w-4" />
        </div>
        <div className="leading-none">
          <span className="block text-sm font-bold tracking-tight text-slate-100">WorkRadar</span>
          <span className="text-[10px] font-medium text-slate-500">Manager Copilot</span>
        </div>
      </div>

      {/* Squad selector */}
      <div className="px-3 pt-2">
        <div className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors hover:bg-slate-800/60">
          <div>
            <div className="font-semibold text-slate-200">Core Platform</div>
            <div className="text-[11px] text-slate-500">9 Engineers · Sprint 24</div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-3 space-y-0.5 px-2">
        <div className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">Workspace</div>
        {NAV.map((n) => {
          const Icon = n.icon;
          const isActive = active === n.id;
          const badge = n.badge?.(counts);
          return (
            <button
              key={n.id}
              onClick={() => onSwitch(n.id)}
              className={`group relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand/15 text-brand-light'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              {isActive && <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-brand-light" />}
              <Icon className={`h-4 w-4 ${isActive ? 'text-brand-light' : ''}`} />
              <span className="flex-1 text-left">{n.label}</span>
              {badge && <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${badge.cls}`}>{badge.text}</span>}
            </button>
          );
        })}

        <button
          onClick={onOpenSearch}
          className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-slate-400 transition-all duration-200 hover:bg-slate-800/40 hover:text-slate-200"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search</span>
          <kbd className="rounded border border-slate-700 bg-slate-800 px-1 text-[10px] font-mono text-slate-500">
            {'\u2318'}K
          </kbd>
        </button>
      </nav>

      {/* Team directory */}
      <nav className="mt-5 flex-1 space-y-0.5 px-2">
        <div className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">Team</div>
        {TEAM_MEMBERS.map((m) => {
          const cls = AVATAR_COLORS[m] ?? 'bg-slate-600/20 text-slate-300';
          return (
            <div
              key={m}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-slate-400 transition-colors hover:bg-slate-800/40"
            >
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${cls}`}>
                {initials(m)}
              </span>
              <span className="flex-1 truncate">{m}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Available" />
            </div>
          );
        })}
      </nav>

      {/* Tool status footer */}
      <div className="border-t border-slate-800 px-4 py-3 transition-colors">
        <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          <Users className="h-3 w-3" /> Ingestion
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <BrandDot label="GitHub" ok />
          <BrandDot label="Jira" ok />
          <BrandDot label="Slack" ok={dataState !== 'error'} degraded={dataState === 'error'} />
        </div>
      </div>
    </aside>
  );
}

function BrandDot({ label, ok, degraded }: { label: string; ok: boolean; degraded?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          ok ? 'bg-emerald-500' : degraded ? 'animate-pulse-soft bg-amber-500' : 'bg-slate-500'
        }`}
      />
      <ToolIcon tool={label} size={14} />
      <span className="text-slate-500">{label}</span>
    </div>
  );
}
