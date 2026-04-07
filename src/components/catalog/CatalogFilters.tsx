'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CatalogFilters } from '@/types';

interface CatalogFiltersProps {
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
}

const categories = [
  { key: undefined, label: 'Все' },
  { key: 'TAROT', label: 'Таро' },
  { key: 'ASTROLOGY', label: 'Астрология' },
  { key: 'NUMEROLOGY', label: 'Нумерология' },
  { key: 'RUNES', label: 'Руны' },
];

const themes = [
  { key: undefined, label: 'Все темы' },
  { key: 'LOVE', label: 'Любовь' },
  { key: 'CAREER', label: 'Карьера' },
  { key: 'SELF_KNOWLEDGE', label: 'Самопознание' },
  { key: 'GENERAL', label: 'Общее' },
];

const priceSegments = [
  { key: undefined, label: 'Любая цена' },
  { key: 'BASIC', label: 'Базовый' },
  { key: 'STANDARD', label: 'Стандарт' },
  { key: 'PREMIUM', label: 'Премиум' },
];

const sortOptions = [
  { key: 'popular', label: 'По популярности' },
  { key: 'price_asc', label: 'Сначала дешёвые' },
  { key: 'price_desc', label: 'Сначала дорогие' },
  { key: 'rating', label: 'По рейтингу' },
  { key: 'new', label: 'По новизне' },
];

// ── Custom sort dropdown ──

function SortDropdown({ value, onSelect }: { value: string; onSelect: (key: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [open]);

  const currentLabel = sortOptions.find((o) => o.key === value)?.label || 'По популярности';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-3 rounded-xl bg-night-950/60 border border-mystic-700/30 text-sm text-mystic-300 flex items-center justify-between hover:border-mystic-500/40 transition-all cursor-pointer"
      >
        <span>{currentLabel}</span>
        <ChevronDown className={cn('w-4 h-4 text-mystic-500 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {/* Dropdown panel */}
      <div
        className={cn(
          'absolute top-full left-0 right-0 mt-1 z-50 rounded-xl bg-night-950/95 backdrop-blur-xl border border-mystic-700/30 shadow-xl shadow-black/50 overflow-hidden transition-all duration-200 origin-top',
          open ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-1 scale-95 pointer-events-none',
        )}
      >
        {sortOptions.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => { onSelect(opt.key); setOpen(false); }}
            className={cn(
              'w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-all',
              value === opt.key
                ? 'text-gold-400 bg-mystic-800/20 font-medium'
                : 'text-mystic-400 hover:text-white hover:bg-mystic-800/30',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main component ──

export default function CatalogFiltersComponent({ filters, onChange }: CatalogFiltersProps) {
  const update = (patch: Partial<CatalogFilters>) => {
    onChange({ ...filters, ...patch });
  };

  return (
    <div className="space-y-6">
      {/* Категория */}
      <div>
        <h3 className="text-xs font-semibold text-mystic-400 uppercase tracking-wider mb-3">Категория</h3>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.key ?? 'all'}
              onClick={() => update({ category: cat.key })}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                filters.category === cat.key
                  ? 'bg-mystic-600/25 text-mystic-200 border border-mystic-500/30'
                  : 'text-mystic-500 hover:text-mystic-300 border border-transparent hover:border-mystic-700/30',
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Тема */}
      <div>
        <h3 className="text-xs font-semibold text-mystic-400 uppercase tracking-wider mb-3">Тема</h3>
        <div className="flex flex-wrap gap-1.5">
          {themes.map((t) => (
            <button
              key={t.key ?? 'all'}
              onClick={() => update({ theme: t.key })}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                filters.theme === t.key
                  ? 'bg-mystic-600/25 text-mystic-200 border border-mystic-500/30'
                  : 'text-mystic-500 hover:text-mystic-300 border border-transparent hover:border-mystic-700/30',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ценовой сегмент */}
      <div>
        <h3 className="text-xs font-semibold text-mystic-400 uppercase tracking-wider mb-3">Цена</h3>
        <div className="flex flex-wrap gap-1.5">
          {priceSegments.map((ps) => (
            <button
              key={ps.key ?? 'all'}
              onClick={() => update({ priceSegment: ps.key })}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                filters.priceSegment === ps.key
                  ? 'bg-mystic-600/25 text-mystic-200 border border-mystic-500/30'
                  : 'text-mystic-500 hover:text-mystic-300 border border-transparent hover:border-mystic-700/30',
              )}
            >
              {ps.label}
            </button>
          ))}
        </div>
      </div>

      {/* Сортировка */}
      <div>
        <h3 className="text-xs font-semibold text-mystic-400 uppercase tracking-wider mb-3">Сортировка</h3>
        <SortDropdown
          value={filters.sort || 'popular'}
          onSelect={(key) => update({ sort: key })}
        />
      </div>
    </div>
  );
}
