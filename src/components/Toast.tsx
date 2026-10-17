import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { Check } from 'lucide-react';

interface ToastCtx {
  showToast: (msg: string) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useToast must be inside ToastProvider');
  return c;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const showToast = useCallback((m: string) => {
    setMsg(m);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMsg(null), 3000);
  }, []);

  return (
    <Ctx.Provider value={{ showToast }}>
      {children}
      {msg && (
        <div className="fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-800 px-4 py-2.5 text-xs font-medium text-slate-100 shadow-xl animate-slide-up">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}
    </Ctx.Provider>
  );
}
