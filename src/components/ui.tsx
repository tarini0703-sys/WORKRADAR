import type { ReactNode } from 'react';
import { CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

const STATUS_STYLES: Record<string, { text: string; bg: string; border: string }> = {
  blocked: {
    text: 'text-rose-500 dark:text-rose-400',
    bg: 'bg-rose-500/12',
    border: 'border-rose-500/25',
  },
  'at-risk': {
    text: 'text-amber-500 dark:text-amber-400',
    bg: 'bg-amber-500/12',
    border: 'border-amber-500/25',
  },
  'on-track': {
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/12',
    border: 'border-emerald-500/25',
  },
  done: {
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/12',
    border: 'border-emerald-500/25',
  },
};

export function StatusBadge({ status, label }: { status: string; label: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES['on-track'];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${s.bg} ${s.border} ${s.text}`}>
      {status === 'blocked' && <AlertCircle className="h-3 w-3" />}
      {status === 'done' && <CheckCircle2 className="h-3 w-3" />}
      {label}
    </span>
  );
}

export function TrustTag({ verified, label }: { verified: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-medium ${
        verified ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'
      }`}
    >
      {verified ? <CheckCircle2 className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
      {label}
    </span>
  );
}

export function ScorePill({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-rose-500/12 text-rose-500 dark:text-rose-400 border-rose-500/25'
    : score >= 70 ? 'bg-amber-500/12 text-amber-500 dark:text-amber-400 border-amber-500/25'
    : 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border-emerald-500/25';
  return (
    <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-[11px] font-semibold ${color}`}>
      {score}
    </span>
  );
}

const AVATAR_COLORS: Record<string, string> = {
  'Devin K.': 'bg-rose-500/20 text-rose-600 dark:text-rose-300',
  'Elena R.': 'bg-amber-500/20 text-amber-600 dark:text-amber-300',
  'Marcus V.': 'bg-blue-500/20 text-blue-600 dark:text-blue-300',
  'Sarah L.': 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300',
  'Liam T.': 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300',
};

export function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function Avatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' }) {
  const cls = AVATAR_COLORS[name] ?? 'bg-slate-500/15 text-slate-600 dark:text-slate-300';
  const dim = size === 'md' ? 'h-9 w-9 text-xs' : 'h-7 w-7 text-[11px]';
  return (
    <span className={`inline-flex items-center justify-center rounded-full font-semibold ${dim} ${cls}`}>
      {initials(name)}
    </span>
  );
}

export function Card({ children, className = '', glow = false }: { children: ReactNode; className?: string; glow?: boolean }) {
  return (
    <div
      className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-surface shadow-sm dark:shadow-xs transition-colors duration-200 ${glow ? 'shadow-glow' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 pt-4 pb-3">
      <h2 className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">{children}</h2>
      {right}
    </div>
  );
}
