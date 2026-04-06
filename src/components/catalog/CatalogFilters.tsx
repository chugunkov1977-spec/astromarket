'use client';

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
  { key: 'rating', label: 'По рейтингу' },
  { key: 'price_asc', label: 'Сначала дешёвые' },
  { key: 'price_desc', label: 'Сначала дорогие' },
  { key: 'new', label: 'Новинки' },
];

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
        <select
          value={filters.sort || 'popular'}
          onChange={(e) => update({ sort: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-night-950/60 border border-mystic-800/30 text-sm text-mystic-300 focus:outline-none focus:border-mystic-500/50 transition-all"
        >
          {sortOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
