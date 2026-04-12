'use client';

import { useEffect, useState } from 'react';
import { Check, X, Info } from 'lucide-react';
import { useToastStore } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

const icons = {
  success: Check,
  error: X,
  info: Info,
};

const colors = {
  success: 'border-emerald-500/30 text-emerald-400',
  error: 'border-rose-500/30 text-rose-400',
  info: 'border-mystic-500/30 text-mystic-300',
};

const iconColors = {
  success: 'bg-emerald-500/20 text-emerald-400',
  error: 'bg-rose-500/20 text-rose-400',
  info: 'bg-mystic-500/20 text-mystic-400',
};

function ToastItem({ id, message, type }: { id: string; message: string; type: 'success' | 'error' | 'info' }) {
  const [visible, setVisible] = useState(false);
  const removeToast = useToastStore((s) => s.removeToast);
  const Icon = icons[type];

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => setVisible(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl bg-night-950/90 shadow-xl shadow-black/30 transition-all duration-300',
        colors[type],
        visible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0',
      )}
    >
      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', iconColors[type])}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={() => removeToast(id)} className="ml-auto text-mystic-600 hover:text-mystic-400 transition-colors shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>
  );
}
