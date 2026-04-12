'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, Heart, ShoppingCart, Check } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { useFavoritesStore } from '@/hooks/useFavorites';
import { useCartStore } from '@/hooks/useCart';
import { useToastStore } from '@/hooks/useToast';

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    title: string;
    shortDescription: string;
    imageUrl?: string | null;
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

const categoryGradient: Record<string, string> = {
  TAROT: 'from-violet-900/40 via-purple-800/30 to-indigo-900/40',
  ASTROLOGY: 'from-blue-900/40 via-indigo-800/30 to-purple-900/40',
  NUMEROLOGY: 'from-amber-900/40 via-orange-800/30 to-yellow-900/40',
  RUNES: 'from-emerald-900/40 via-teal-800/30 to-green-900/40',
  MEDITATION: 'from-pink-900/40 via-rose-800/30 to-purple-900/40',
  COURSE: 'from-cyan-900/40 via-blue-800/30 to-indigo-900/40',
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

  const cartItems = useCartStore((s) => s.items);
  const addToCart = useCartStore((s) => s.addItem);
  const cartLoaded = useCartStore((s) => s.loaded);
  const loadCart = useCartStore((s) => s.loadFromStorage);

  useEffect(() => {
    if (!cartLoaded) loadCart();
  }, [cartLoaded, loadCart]);

  const inCart = cartItems.some((i) => i.productId === product.id);

  const showToast = useToastStore((s) => s.showToast);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) {
      showToast('Товар уже в корзине', 'info');
      return;
    }
    addToCart({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      oldPrice: product.oldPrice,
      imageUrl: product.imageUrl || null,
      psychicName: product.psychic?.name || '',
      category: product.category,
    });
    showToast('Добавлено в корзину', 'success');
  };

  const hasImage = !!product.imageUrl;
  const gradient = categoryGradient[product.category] || 'from-mystic-900/40 via-cosmic-800/30 to-mystic-900/40';

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative rounded-2xl overflow-hidden border border-mystic-800/20 bg-night-950/60 backdrop-blur-sm card-hover animate-card-appear"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {hasImage ? (
          <>
            <Image
              src={product.imageUrl!}
              alt={product.title}
              fill
              sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />
            {/* Gradient blend into card content */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night-950/80 via-night-950/20 to-transparent" />
          </>
        ) : (
          <div className={cn('absolute inset-0 bg-gradient-to-br', gradient)}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.05)_0%,_transparent_60%)]" />
            <div className="absolute top-[20%] left-[25%] w-1 h-1 rounded-full bg-white/10" />
            <div className="absolute top-[35%] right-[20%] w-0.5 h-0.5 rounded-full bg-white/15" />
            <div className="absolute bottom-[30%] left-[40%] w-0.5 h-0.5 rounded-full bg-white/10" />
            <span className="absolute inset-0 flex items-center justify-center text-5xl opacity-40 group-hover:scale-110 group-hover:opacity-50 transition-all duration-500">
              {categoryIcon[product.category] || '✧'}
            </span>
          </div>
        )}

        {/* Бейджи */}
        {product.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-1.5 z-10">
            {product.badges.map((badge) => (
              <span
                key={badge}
                className={cn(
                  'px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm',
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
              isFav ? 'fill-rose-500 text-rose-500' : 'text-mystic-400 hover:text-rose-400',
            )}
          />
        </button>
      </div>

      {/* Контент */}
      <div className="p-4">
        {product.psychic && (
          <p className="text-xs text-mystic-500 mb-1.5 truncate">{product.psychic.name}</p>
        )}

        <h3 className="font-display text-sm font-semibold text-white mb-1.5 line-clamp-2 group-hover:text-mystic-200 transition-colors">
          {product.title}
        </h3>

        <p className="text-xs text-mystic-500 line-clamp-2 mb-3">{product.shortDescription}</p>

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

        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-white">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-mystic-600 line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className={cn(
            'w-full py-2 mt-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200',
            inCart
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
              : 'bg-mystic-600/20 text-mystic-200 border border-mystic-600/20 hover:bg-gold-500 hover:text-night-950 hover:border-gold-500 hover:shadow-md hover:shadow-gold-500/20',
          )}
        >
          {inCart ? (
            <><Check className="w-3.5 h-3.5" /> В корзине</>
          ) : (
            <><ShoppingCart className="w-3.5 h-3.5" /> В корзину</>
          )}
        </button>
      </div>
    </Link>
  );
}
