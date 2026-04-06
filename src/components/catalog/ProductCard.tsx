'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Star, Clock, Heart } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { useFavoritesStore } from '@/hooks/useFavorites';

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    title: string;
    shortDescription: string;
    category: string;
    price: number;
    oldPrice: number | null;
    rating: number;
    reviewCount: number;
    orderCount: number;
    badges: string[];
    generationTimeMin: number;
    generationTimeMax: number;
    psychic?: {
      name: string;
      slug: string;
    } | null;
  };
  index?: number;
}

const categoryIcon: Record<string, string> = {
  TAROT: '🃏',
  ASTROLOGY: '⭐',
  NUMEROLOGY: '🔢',
  RUNES: 'ᚱ',
  MEDITATION: '🧘',
  COURSE: '📚',
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  const favorites = useFavoritesStore((s) => s.favorites);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const loadFromStorage = useFavoritesStore((s) => s.loadFromStorage);
  const loaded = useFavoritesStore((s) => s.loaded);

  useEffect(() => {
    if (!loaded) loadFromStorage();
  }, [loaded, loadFromStorage]);

  const isFav = favorites.includes(product.slug);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.slug);
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative rounded-2xl overflow-hidden border border-mystic-800/20 bg-night-950/60 backdrop-blur-sm card-hover animate-card-appear"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Изображение / иконка категории */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-mystic-900/40 to-cosmic-900/40 flex items-center justify-center overflow-hidden">
        <span className="text-5xl opacity-30 group-hover:scale-110 transition-transform duration-500">
          {categoryIcon[product.category] || '✧'}
        </span>

        {/* Бейджи */}
        {product.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-1.5">
            {product.badges.map((badge) => (
              <span
                key={badge}
                className={cn(
                  'px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider',
                  badge === 'hit' && 'bg-gold-500/90 text-night-950',
                  badge === 'new' && 'bg-emerald-500/90 text-white',
                  badge === 'sale' && 'bg-rose-500/90 text-white',
                )}
              >
                {badge === 'hit' && 'Хит'}
                {badge === 'new' && 'New'}
                {badge === 'sale' && `−${discount}%`}
              </span>
            ))}
          </div>
        )}

        {/* Favorite heart */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-night-950/50 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:bg-night-950/70 z-10"
          aria-label={isFav ? 'Убрать из избранного' : 'Добавить в избранное'}
        >
          <Heart
            className={cn(
              'w-4 h-4 transition-colors duration-200',
              isFav
                ? 'fill-rose-500 text-rose-500'
                : 'text-mystic-400 hover:text-rose-400',
            )}
          />
        </button>
      </div>

      {/* Контент */}
      <div className="p-4">
        {/* Мастер */}
        {product.psychic && (
          <p className="text-xs text-mystic-500 mb-1.5 truncate">
            {product.psychic.name}
          </p>
        )}

        {/* Название */}
        <h3 className="font-display text-sm font-semibold text-white mb-1.5 line-clamp-2 group-hover:text-mystic-200 transition-colors">
          {product.title}
        </h3>

        {/* Описание */}
        <p className="text-xs text-mystic-500 line-clamp-2 mb-3">
          {product.shortDescription}
        </p>

        {/* Рейтинг и время */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
            <span className="text-xs font-semibold text-gold-400">{product.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-mystic-600">
            <Clock className="w-3 h-3" />
            <span className="text-[10px]">{product.generationTimeMin}–{product.generationTimeMax} мин</span>
          </div>
          <span className="text-[10px] text-mystic-600">{product.orderCount} заказов</span>
        </div>

        {/* Цена */}
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-white">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-mystic-600 line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
