'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, X, Clock, Shield, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { products, psychics } from '@/data/seed-data';
import { cn, formatPrice } from '@/lib/utils';

const categoryIcon: Record<string, string> = {
  TAROT: '🃏', ASTROLOGY: '⭐', NUMEROLOGY: '🔢', RUNES: 'ᚱ', MEDITATION: '🧘', COURSE: '📚',
};

const categoryColor: Record<string, string> = {
  TAROT: 'from-violet-600/30 to-purple-800/30',
  ASTROLOGY: 'from-blue-600/30 to-indigo-800/30',
  NUMEROLOGY: 'from-amber-600/30 to-orange-800/30',
  RUNES: 'from-emerald-600/30 to-teal-800/30',
};

// Mock cart: pick 3 products from seed-data
const initialCart = [
  products[0], // Классический расклад Таро
  products[1], // Натальная карта (has oldPrice)
  products[6], // Таро на отношения (has oldPrice)
].map((p) => {
  const ps = psychics.find((x) => x.slug === p.psychicSlug);
  return {
    slug: p.slug,
    title: p.title,
    category: p.category,
    price: p.price,
    oldPrice: p.oldPrice,
    psychicName: ps?.name || '',
    generationTimeMin: p.generationTimeMin,
    generationTimeMax: p.generationTimeMax,
  };
});

export default function CartPage() {
  const [items, setItems] = useState(initialCart);
  const [promoCode, setPromoCode] = useState('');

  const removeItem = (slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  };

  const subtotal = items.reduce((sum, i) => sum + (i.oldPrice || i.price), 0);
  const total = items.reduce((sum, i) => sum + i.price, 0);
  const discount = subtotal - total;

  return (
    <div className="min-h-screen relative">
      <Header />
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="font-display text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-mystic-400" />
            Корзина
            {items.length > 0 && (
              <span className="text-lg font-normal text-mystic-500">({items.length})</span>
            )}
          </h1>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <ShoppingCart className="w-14 h-14 text-mystic-700 mx-auto mb-4" />
              <p className="text-mystic-400 text-lg mb-2">Ваша корзина пуста</p>
              <p className="text-mystic-600 text-sm mb-6">Добавьте услуги из каталога</p>
              <Link href="/catalog" className="btn-gold inline-flex items-center gap-2">
                Перейти в каталог <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_380px] gap-6 mt-6">
              {/* Items list */}
              <div className="space-y-3">
                {items.map((item, i) => (
                  <motion.div
                    key={item.slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    exit={{ opacity: 0, x: -40 }}
                    className="glass-light rounded-2xl p-4 flex items-center gap-4"
                  >
                    {/* Category icon */}
                    <div className={cn(
                      'w-16 h-16 shrink-0 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl',
                      categoryColor[item.category] || 'from-mystic-600/30 to-cosmic-600/30',
                    )}>
                      {categoryIcon[item.category] || '✧'}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.slug}`} className="font-display font-semibold text-white text-sm hover:text-mystic-200 transition-colors line-clamp-1">
                        {item.title}
                      </Link>
                      <p className="text-xs text-mystic-400 mt-0.5">{item.psychicName}</p>
                      <div className="flex items-center gap-1 mt-1.5 text-mystic-500">
                        <Clock className="w-3 h-3" />
                        <span className="text-[11px]">{item.generationTimeMin}–{item.generationTimeMax} мин</span>
                      </div>
                    </div>

                    {/* Price + remove */}
                    <div className="text-right shrink-0 flex flex-col items-end gap-1">
                      <span className="text-sm font-bold text-white">{formatPrice(item.price)}</span>
                      {item.oldPrice && (
                        <span className="text-xs text-mystic-600 line-through">{formatPrice(item.oldPrice)}</span>
                      )}
                      <button
                        onClick={() => removeItem(item.slug)}
                        className="mt-1 w-7 h-7 rounded-full flex items-center justify-center text-mystic-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        aria-label="Удалить"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order summary */}
              <div className="lg:sticky lg:top-28 lg:self-start">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass rounded-2xl p-6 border border-mystic-700/20"
                >
                  <h2 className="font-display text-lg font-bold text-white mb-5">Итого</h2>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-mystic-300">Товары ({items.length} шт)</span>
                      <span className="text-sm text-mystic-300">{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-mystic-300">Скидка</span>
                        <span className="text-sm text-emerald-400">−{formatPrice(discount)}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-mystic-800/30 pt-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-white">К оплате</span>
                      <span className="text-2xl font-bold text-white">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Promo code */}
                  <div className="flex gap-2 mb-5">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Промокод"
                      className="flex-1 bg-night-950/80 border border-mystic-700/30 rounded-xl px-3 py-2.5 text-sm text-white placeholder-mystic-600 focus:outline-none focus:border-mystic-500/50 transition-colors"
                    />
                    <button className="px-4 py-2.5 rounded-xl border border-mystic-500/40 text-sm text-mystic-300 hover:bg-mystic-500/10 transition-colors shrink-0">
                      Применить
                    </button>
                  </div>

                  {/* Checkout */}
                  <button className="w-full btn-gold flex items-center justify-center gap-2 text-base py-4">
                    Перейти к оплате
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 mt-4">
                    <Shield className="w-3.5 h-3.5 text-mystic-500" />
                    <span className="text-xs text-mystic-500">Безопасная оплата через ЮKassa</span>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
