import { Search, Sun, Moon, RotateCcw, PanelRightOpen, PanelRightClose } from 'lucide-react';
import { useTheme } from '@/theme';
import type { DataState } from '@/data';

interface HeaderProps {
  onOpenSearch: () => void;
  dataState: DataState;
  setDataState: (s: DataState) => void;
  onReset: () => void;
  drawerOpen: boolean;
  onToggleDrawer: () => void;
}

const STATES: { id: DataState; label: string }[] = [
  { id: 'live', label: 'Live' },
  { id: 'empty', label: 'Empty' },
  { id: 'error', label: 'Error' },
];

export default function Header({ onOpenSearch, dataState, setDataState, onReset, drawerOpen, onToggleDrawer }: HeaderProps) {
  const { theme, toggle } = useTheme();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-surface/80 px-5 backdrop-blur-sm transition-colors duration-200">
      <div>
        <h1 className="text-sm font-semibold text-slate-100">Good morning, Priya</h1>
        <p className="text-[11px] text-slate-500">Overnight synthesis complete · 24 GitHub · 9 Jira · 48 Slack events</p>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-xs text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search or ask…</span>
          <kbd className="rounded border border-slate-700 bg-slate-800 px-1 font-mono text-[10px] text-slate-500">
            {'\u2318'}K
          </kbd>
        </button>

        {/* State switcher */}
        <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900/50 p-0.5 text-[11px]">
          {STATES.map((s) => (
            <button
              key={s.id}
              onClick={() => setDataState(s.id)}
              className={`rounded-md px-2 py-1 font-medium transition-all duration-200 ${
                dataState === s.id
                  ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Reset */}
        <button
          onClick={onReset}
          title="Reset demo data"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          title="Toggle theme"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Drawer toggle */}
        <button
          onClick={onToggleDrawer}
          title="Toggle integrations panel"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
        >
          {drawerOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
