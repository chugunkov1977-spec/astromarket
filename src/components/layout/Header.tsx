'use client';

import { useState, useEffect, useRef, useMemo, Suspense, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { Search, Heart, User, Menu, X, ShoppingCart } from 'lucide-react';
import { useAuthStore } from '@/hooks/useAuth';
import { useFavoritesStore } from '@/hooks/useFavorites';
import { cn, formatPrice } from '@/lib/utils';
import { products, psychics } from '@/data/seed-data';

// ── Navigation links ───────────────────────────────────

const navLinks = [
  { href: '/catalog', label: 'Каталог', icon: null },
  { href: '/subscription', label: 'Подписка', icon: null },
  { href: '/orders', label: 'Мои заказы', icon: null },
  { href: '/cart', label: 'Корзина', icon: 'cart' as const },
];

// ── Search data (pre-built at module level) ────────────

const categoryIcon: Record<string, string> = {
  TAROT: '🃏',
  ASTROLOGY: '⭐',
  NUMEROLOGY: '🔢',
  RUNES: 'ᚱ',
  MEDITATION: '🧘',
  COURSE: '📚',
};

interface SearchProduct {
  type: 'product';
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  price: number;
  psychicName: string;
}

interface SearchPsychic {
  type: 'psychic';
  slug: string;
  name: string;
  shortBio: string;
}

type SearchItem = SearchProduct | SearchPsychic;

const searchProducts: SearchProduct[] = products.map((p) => {
  const ps = psychics.find((x) => x.slug === p.psychicSlug);
  return {
    type: 'product',
    slug: p.slug,
    title: p.title,
    shortDescription: p.shortDescription,
    category: p.category,
    price: p.price,
    psychicName: ps?.name || '',
  };
});

const searchPsychics: SearchPsychic[] = psychics.map((p) => ({
  type: 'psychic',
  slug: p.slug,
  name: p.name,
  shortBio: p.shortBio,
}));

// ── NavLink with active state (needs Suspense) ────────

function NavLinkInner({ href, label, icon, onClick }: { href: string; label: string; icon: string | null; onClick?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = useMemo(() => {
    if (href.startsWith('/#')) return false;
    if (href.includes('?')) {
      const [path, query] = href.split('?');
      if (pathname !== path) return false;
      const params = new URLSearchParams(query);
      let match = true;
      params.forEach((value, key) => {
        if (searchParams.get(key) !== value) match = false;
      });
      return match;
    }
    return pathname === href;
  }, [href, pathname, searchParams]);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'relative text-sm font-medium transition-all duration-200 hover:text-white hover:-translate-y-[1px] flex items-center gap-1.5',
        isActive ? 'text-white' : 'text-mystic-300',
      )}
    >
      {icon === 'cart' && <ShoppingCart className="w-3.5 h-3.5" />}
      {label}
      {isActive && (
        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-400" />
      )}
    </Link>
  );
}

function NavLinkStatic({ href, label, icon }: { href: string; label: string; icon: string | null }) {
  return (
    <Link href={href} className="relative text-sm font-medium text-mystic-300 transition-all duration-200 hover:text-white hover:-translate-y-[1px] flex items-center gap-1.5">
      {icon === 'cart' && <ShoppingCart className="w-3.5 h-3.5" />}
      {label}
    </Link>
  );
}

// ── Mobile nav link ────────────────────────────────────

function MobileNavLink({ href, label, icon, isLast, onClick }: { href: string; label: string; icon: string | null; isLast: boolean; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 py-3 px-4 text-base text-mystic-300 hover:text-white transition-colors',
        !isLast && 'border-b border-mystic-900/30',
      )}
    >
      {icon === 'cart' && <ShoppingCart className="w-4 h-4" />}
      {label}
    </Link>
  );
}

// ── Search overlay ─────────────────────────────────────

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Auto-focus
  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Click outside
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Delay so the opening click doesn't immediately close
    const timer = setTimeout(() => document.addEventListener('click', onClick), 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', onClick);
    };
  }, [open, onClose]);

  const results = useMemo<SearchItem[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const matchedProducts = searchProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.psychicName.toLowerCase().includes(q),
    );

    const matchedPsychics = searchPsychics.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortBio.toLowerCase().includes(q),
    );

    const combined: SearchItem[] = [
      ...matchedPsychics.slice(0, 2),
      ...matchedProducts.slice(0, 4),
    ];
    return combined.slice(0, 6);
  }, [query]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="absolute top-full left-0 right-0 z-50 border-b border-mystic-800/30 animate-fade-in"
      style={{
        backgroundColor: 'rgba(10, 6, 20, 0.96)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск услуг и мастеров..."
          className="w-full bg-night-950/80 border border-mystic-700/30 rounded-xl px-4 py-3 text-white text-sm placeholder-mystic-600 focus:outline-none focus:border-mystic-500/50 transition-colors"
        />

        {/* Results */}
        {query.trim().length >= 2 && (
          <div className="mt-3 space-y-1">
            {results.length === 0 ? (
              <p className="text-sm text-mystic-500 py-3 text-center">Ничего не найдено</p>
            ) : (
              results.map((item) =>
                item.type === 'product' ? (
                  <Link
                    key={`p-${item.slug}`}
                    href={`/product/${item.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-mystic-900/30 transition-colors"
                  >
                    <span className="text-lg w-7 text-center shrink-0">
                      {categoryIcon[item.category] || '✧'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.title}</p>
                      <p className="text-xs text-mystic-500 truncate">{item.psychicName}</p>
                    </div>
                    <span className="text-sm font-semibold text-mystic-300 shrink-0">
                      {formatPrice(item.price)}
                    </span>
                  </Link>
                ) : (
                  <Link
                    key={`m-${item.slug}`}
                    href={`/psychic/${item.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-mystic-900/30 transition-colors"
                  >
                    <span className="text-lg w-7 text-center shrink-0">✧</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.name}</p>
                      <p className="text-xs text-mystic-500 truncate">{item.shortBio}</p>
                    </div>
                    <span className="text-xs text-mystic-500 shrink-0">Мастер</span>
                  </Link>
                ),
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Favorites badge (reads store) ──────────────────────

function FavoritesBadge() {
  const favorites = useFavoritesStore((s) => s.favorites);
  const loadFromStorage = useFavoritesStore((s) => s.loadFromStorage);
  const loaded = useFavoritesStore((s) => s.loaded);

  useEffect(() => {
    if (!loaded) loadFromStorage();
  }, [loaded, loadFromStorage]);

  const count = favorites.length;

  return (
    <Link
      href="/favorites"
      className="hidden md:flex w-9 h-9 rounded-full border border-mystic-700/40 hover:border-mystic-500/40 hover:bg-mystic-900/40 items-center justify-center transition-all duration-200 relative"
      aria-label="Избранное"
    >
      <Heart className="w-4 h-4 text-mystic-400" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-500 text-[10px] font-bold text-night-950 flex items-center justify-center leading-none">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  );
}

// ===================== HEADER =====================

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <header className="sticky top-0 z-50">
      {/* ====== Top promotional bar ====== */}
      <div
        className="hidden md:flex items-center justify-center h-8"
        style={{ background: 'linear-gradient(90deg, #1a0533, #2d1052, #1a0533)' }}
      >
        <p className="text-xs text-gold-400/80 tracking-wide">
          ✧ Бесплатная карта дня для новых пользователей ✧
        </p>
      </div>

      {/* ====== Main header bar ====== */}
      <div
        className={cn('transition-all duration-300 relative', scrolled ? 'shadow-lg shadow-night-950/60' : '')}
        style={{ backgroundColor: 'rgba(10, 6, 20, 0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* ---- Logo ---- */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <Image
                src="/images/logo.png"
                alt="AstroMarket"
                width={40}
                height={40}
                className="w-10 h-10 rounded-lg group-hover:scale-105 transition-transform duration-200"
              />
              <span className="font-display text-xl font-bold leading-none tracking-tight">
                <span className="text-white">Astro</span>
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)' }}
                >
                  Market
                </span>
              </span>
            </Link>

            {/* ---- Desktop navigation ---- */}
            <Suspense
              fallback={
                <nav className="hidden md:flex items-center gap-8">
                  {navLinks.map((link) => (
                    <NavLinkStatic key={link.href} {...link} />
                  ))}
                </nav>
              }
            >
              <nav className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <NavLinkInner key={link.href} {...link} />
                ))}
              </nav>
            </Suspense>

            {/* ---- Right side actions ---- */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen((v) => !v)}
                className={cn(
                  'w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200',
                  searchOpen
                    ? 'border-mystic-500/50 bg-mystic-900/40 text-white'
                    : 'border-mystic-700/40 hover:border-mystic-500/40 hover:bg-mystic-900/40',
                )}
                aria-label="Поиск"
              >
                <Search className={cn('w-4 h-4', searchOpen ? 'text-white' : 'text-mystic-400')} />
              </button>

              {/* Favorites */}
              <FavoritesBadge />

              {/* Auth — desktop */}
              <Link
                href={user ? '/profile' : '/auth'}
                className={cn(
                  'hidden sm:flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  user
                    ? 'text-mystic-300 hover:text-white border border-mystic-700/40 hover:border-mystic-500/40 hover:bg-mystic-900/40'
                    : 'text-gold-400 border border-gold-500/30 bg-gradient-to-r from-gold-500/10 to-gold-600/10 hover:border-gold-500/50 hover:from-gold-500/15 hover:to-gold-600/15 hover:shadow-[0_0_15px_rgba(251,191,36,0.15)]',
                )}
              >
                <User className="w-4 h-4" />
                {user ? user.name || 'Профиль' : 'Войти'}
              </Link>

              {/* Auth — mobile */}
              <Link
                href={user ? '/profile' : '/auth'}
                className="sm:hidden w-9 h-9 rounded-full border border-mystic-700/40 hover:border-mystic-500/40 flex items-center justify-center text-mystic-400 hover:text-white transition-all duration-200"
              >
                <User className="w-4 h-4" />
              </Link>

              {/* Burger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 rounded-full border border-mystic-700/40 hover:border-mystic-500/40 flex items-center justify-center text-mystic-400 hover:text-white transition-all duration-200"
                aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
              >
                {mobileOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Glowing bottom line */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-mystic-500/40 to-transparent" />

        {/* Search overlay */}
        <SearchOverlay open={searchOpen} onClose={closeSearch} />
      </div>

      {/* ====== Mobile menu ====== */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
        style={{ backgroundColor: 'rgba(10, 6, 20, 0.98)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        <nav className="max-w-7xl mx-auto">
          {navLinks.map((link, i) => (
            <MobileNavLink key={link.href} href={link.href} label={link.label} icon={link.icon} isLast={i === navLinks.length - 1} onClick={closeMobile} />
          ))}
        </nav>
        <div className="h-[1px] bg-gradient-to-r from-transparent via-mystic-800/30 to-transparent" />
      </div>
    </header>
  );
}
