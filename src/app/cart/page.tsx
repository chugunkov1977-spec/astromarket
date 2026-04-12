'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, X, Shield, ArrowRight, Trash2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCartStore } from '@/hooks/useCart';
import { useAuthStore } from '@/hooks/useAuth';
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

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotal = useCartStore((s) => s.getTotal);
  const getDiscount = useCartStore((s) => s.getDiscount);
  const loaded = useCartStore((s) => s.loaded);
  const loadFromStorage = useCartStore((s) => s.loadFromStorage);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [authMounted, setAuthMounted] = useState(false);

  useEffect(() => { setAuthMounted(true); }, []);
  useEffect(() => {
    if (!loaded) loadFromStorage();
  }, [loaded, loadFromStorage]);

  const handleCheckout = () => {
    if (!authMounted) return;
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }
    // placeholder for checkout
  };

  const total = getTotal();
  const discount = getDiscount();
  const subtotal = total + discount;

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

          {loaded && items.length === 0 ? (
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
              {/* Items */}
              <div className="space-y-3">
                {items.map((item, i) => (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="glass-light rounded-2xl p-4 flex items-center gap-4"
                  >
                    {/* Image */}
                    <div className={cn(
                      'w-16 h-16 shrink-0 rounded-xl overflow-hidden relative',
                      !item.imageUrl && 'bg-gradient-to-br flex items-center justify-center text-2xl',
                      !item.imageUrl && (categoryColor[item.category] || 'from-mystic-600/30 to-cosmic-600/30'),
                    )}>
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.title} fill sizes="64px" className="object-cover" unoptimized />
                      ) : (
                        <span>{categoryIcon[item.category] || '✧'}</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.slug}`} className="font-display font-semibold text-white text-sm hover:text-mystic-200 transition-colors line-clamp-1">
                        {item.title}
                      </Link>
                      <p className="text-xs text-mystic-400 mt-0.5">{item.psychicName}</p>
                    </div>

                    {/* Price + remove */}
                    <div className="text-right shrink-0 flex flex-col items-end gap-1">
                      <span className="text-sm font-bold text-white">{formatPrice(item.price)}</span>
                      {item.oldPrice && (
                        <span className="text-xs text-mystic-600 line-through">{formatPrice(item.oldPrice)}</span>
                      )}
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="mt-1 w-7 h-7 rounded-full flex items-center justify-center text-mystic-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        aria-label="Удалить"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
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

                  <button onClick={handleCheckout} className="w-full btn-gold flex items-center justify-center gap-2 text-base py-4 mb-3">
                    {authMounted && !isAuthenticated ? 'Войти для оплаты' : 'Перейти к оплате'}
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={clearCart}
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-mystic-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Очистить корзину
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
