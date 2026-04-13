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
import { useOrdersStore } from '@/hooks/useOrders';
import { useToastStore } from '@/hooks/useToast';
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
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const createOrder = useOrdersStore((s) => s.createOrder);
  const showToast = useToastStore((s) => s.showToast);
  const [authMounted, setAuthMounted] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState<{ code: string; type: 'percent' | 'fixed'; value: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  useEffect(() => { setAuthMounted(true); }, []);

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'WELCOME20') {
      setPromoApplied({ code, type: 'percent', value: 20 });
      showToast('Промокод применён: скидка 20%', 'success');
    } else if (code === 'STAR10') {
      setPromoApplied({ code, type: 'percent', value: 10 });
      showToast('Промокод применён: скидка 10%', 'success');
    } else if (code === 'FIRST500') {
      const t = getTotal();
      if (t > 50000) { // 500₽ in kopecks
        setPromoApplied({ code, type: 'fixed', value: 50000 });
        showToast('Промокод применён: скидка 500 ₽', 'success');
      } else {
        setPromoError('Промокод действует при заказе от 500 ₽');
      }
    } else {
      setPromoError('Промокод не найден');
    }
  };

  const handleCheckout = async () => {
    if (!authMounted) return;
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }
    await createOrder(items, {});
    clearCart();
    setCheckoutSuccess(true);
    setPromoApplied(null);
    showToast('Заказ оформлен!', 'success');
    setTimeout(() => router.push('/orders'), 1000);
  };

  const total = getTotal();
  const discount = getDiscount();
  const subtotal = total + discount;
  const promoDiscount = promoApplied
    ? promoApplied.type === 'percent'
      ? Math.round(total * promoApplied.value / 100)
      : Math.min(promoApplied.value, total)
    : 0;
  const finalTotal = total - promoDiscount;

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

          {checkoutSuccess && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-4">
              <span className="text-lg">✨</span>
              <span className="text-sm font-medium">Заказ оформлен! Перенаправляем на страницу заказов...</span>
            </motion.div>
          )}

          {items.length === 0 && !checkoutSuccess ? (
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
                        onClick={() => { removeItem(item.productId); showToast('Удалено из корзины', 'info'); }}
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
                    {promoDiscount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-mystic-300">Промокод {promoApplied?.code}</span>
                        <span className="text-sm text-emerald-400">−{formatPrice(promoDiscount)}</span>
                      </div>
                    )}
                  </div>

                  {/* Promo code */}
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); }}
                        placeholder="Промокод"
                        disabled={!!promoApplied}
                        className="flex-1 px-3 py-2.5 rounded-xl bg-night-950/80 border border-mystic-700/30 text-sm text-white placeholder-mystic-600 focus:outline-none focus:border-mystic-500/50 transition-colors disabled:opacity-50"
                      />
                      {promoApplied ? (
                        <button
                          onClick={() => { setPromoApplied(null); setPromoCode(''); }}
                          className="px-3 py-2.5 rounded-xl text-xs text-rose-400 border border-rose-500/20 hover:bg-rose-500/10 transition-colors shrink-0"
                        >
                          Отменить
                        </button>
                      ) : (
                        <button
                          onClick={handleApplyPromo}
                          className="px-4 py-2.5 rounded-xl border border-mystic-500/40 text-sm text-mystic-300 hover:bg-mystic-500/10 transition-colors shrink-0"
                        >
                          Применить
                        </button>
                      )}
                    </div>
                    {promoError && <p className="text-xs text-rose-400 mt-1.5">{promoError}</p>}
                    {promoApplied && <p className="text-xs text-emerald-400 mt-1.5">Промокод применён!</p>}
                  </div>

                  <div className="border-t border-mystic-800/30 pt-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-white">К оплате</span>
                      <span className="text-2xl font-bold text-white">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>

                  <button onClick={handleCheckout} className="w-full btn-gold flex items-center justify-center gap-2 text-base py-4 mb-3">
                    {authMounted && !isAuthenticated ? 'Войти для оплаты' : 'Перейти к оплате'}
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => clearCart()}
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
