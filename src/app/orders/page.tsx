'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, Package, LogIn, ChevronDown, ShoppingCart } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/hooks/useAuth';
import { useOrdersStore } from '@/hooks/useOrders';
import { cn, formatPrice } from '@/lib/utils';

const categoryIcon: Record<string, string> = {
  TAROT: '🃏', ASTROLOGY: '⭐', NUMEROLOGY: '🔢', RUNES: 'ᚱ', MEDITATION: '🧘', COURSE: '📚',
};

const categoryTime: Record<string, string> = {
  TAROT: '3-10 мин', ASTROLOGY: '5-15 мин', NUMEROLOGY: '3-7 мин', RUNES: '3-8 мин',
};

export default function OrdersPage() {
  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const [mounted, setMounted] = useState(false);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const orders = useOrdersStore((s) => s.orders);
  const [, forceUpdate] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  // Poll for order status changes (setTimeout fires outside React)
  useEffect(() => {
    const hasProcessing = orders.some((o) => o.status === 'processing');
    if (!hasProcessing) return;
    const interval = setInterval(() => forceUpdate((n) => n + 1), 1000);
    return () => clearInterval(interval);
  }, [orders]);

  const activeOrders = orders.filter((o) => o.status === 'processing');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  if (mounted && !isAuthenticated) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <LogIn className="w-12 h-12 text-mystic-700 mx-auto mb-4" />
            <p className="text-mystic-400 text-lg mb-2">Войдите, чтобы увидеть заказы</p>
            <p className="text-mystic-600 text-sm mb-6">Авторизуйтесь, чтобы управлять своими заказами</p>
            <Link href="/auth" className="btn-gold inline-flex items-center gap-2">
              Войти <LogIn className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const hasOrders = orders.length > 0;

  return (
    <div className="min-h-screen relative">
      <Header />
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="font-display text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Package className="w-7 h-7 text-mystic-400" />
            Мои заказы
          </h1>

          {mounted && !hasOrders ? (
            <div className="text-center py-20">
              <Package className="w-14 h-14 text-mystic-700 mx-auto mb-4" />
              <p className="text-mystic-400 text-lg mb-2">У вас пока нет заказов</p>
              <p className="text-mystic-600 text-sm mb-6">Выберите услугу в каталоге и оформите заказ</p>
              <Link href="/catalog" className="btn-gold inline-flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Перейти в каталог
              </Link>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="inline-flex rounded-xl bg-mystic-900/20 border border-mystic-800/20 p-1 mb-6">
                <button
                  onClick={() => setTab('active')}
                  className={cn(
                    'px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    tab === 'active'
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-night-950 shadow-md'
                      : 'text-mystic-400 hover:text-mystic-200',
                  )}
                >
                  Активные
                  {activeOrders.length > 0 && (
                    <span className={cn('ml-1.5 text-xs', tab === 'active' ? 'text-night-950/60' : 'text-mystic-600')}>
                      ({activeOrders.length})
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setTab('completed')}
                  className={cn(
                    'px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    tab === 'completed'
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-night-950 shadow-md'
                      : 'text-mystic-400 hover:text-mystic-200',
                  )}
                >
                  Завершённые
                  {completedOrders.length > 0 && (
                    <span className={cn('ml-1.5 text-xs', tab === 'completed' ? 'text-night-950/60' : 'text-mystic-600')}>
                      ({completedOrders.length})
                    </span>
                  )}
                </button>
              </div>

              {/* Active orders */}
              {tab === 'active' && (
                <div className="space-y-4">
                  {activeOrders.length === 0 && (
                    <p className="text-mystic-500 text-sm py-8 text-center">Нет активных заказов</p>
                  )}
                  {activeOrders.map((order, i) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="glass-light rounded-2xl p-5"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-white">Заказ #{order.orderNumber}</span>
                        <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
                          В работе
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        {order.psychicAvatarUrl ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0">
                            <Image src={order.psychicAvatarUrl} alt={order.psychicName} fill sizes="40px" className="object-cover" unoptimized />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-mystic-500/30 to-cosmic-600/30 flex items-center justify-center text-lg shrink-0">
                            {categoryIcon[order.category] || '✧'}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-white">{order.productTitle}</p>
                          <p className="text-xs text-mystic-400">{order.psychicName}</p>
                        </div>
                        <span className="ml-auto text-sm font-bold text-white">{formatPrice(order.price)}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
                        <div className="flex gap-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse [animation-delay:0.4s]" />
                        </div>
                        <span className="text-xs text-amber-400">Мастер готовит ваш расклад...</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-mystic-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs">Ожидаемое время: {categoryTime[order.category] || '5-15 мин'}</span>
                        </div>
                        <span className="text-xs text-mystic-600">
                          {new Date(order.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Completed orders */}
              {tab === 'completed' && (
                <div className="space-y-4">
                  {completedOrders.length === 0 && (
                    <p className="text-mystic-500 text-sm py-8 text-center">Нет завершённых заказов</p>
                  )}
                  {completedOrders.map((order, i) => {
                    const isExpanded = expandedResult === order.id;
                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="glass-light rounded-2xl p-5"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-white">Заказ #{order.orderNumber}</span>
                          <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                            Завершён
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                          {order.psychicAvatarUrl ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0">
                              <Image src={order.psychicAvatarUrl} alt={order.psychicName} fill sizes="40px" className="object-cover" unoptimized />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-mystic-500/30 to-cosmic-600/30 flex items-center justify-center text-lg shrink-0">
                              {categoryIcon[order.category] || '✧'}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-white">{order.productTitle}</p>
                            <p className="text-xs text-mystic-400">{order.psychicName}</p>
                          </div>
                          <span className="ml-auto text-sm font-bold text-white">{formatPrice(order.price)}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-mystic-600">
                            {new Date(order.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                          <button
                            onClick={() => setExpandedResult(isExpanded ? null : order.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-mystic-600/15 text-sm font-medium text-mystic-300 hover:bg-mystic-600/25 hover:text-white transition-all"
                          >
                            Посмотреть результат
                            <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', isExpanded && 'rotate-180')} />
                          </button>
                        </div>

                        {/* Expanded result */}
                        <div className={cn(
                          'overflow-hidden transition-all duration-500',
                          isExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0',
                        )}>
                          <div className="p-5 rounded-xl glass-light border border-mystic-700/20">
                            <div className="flex items-center gap-2 mb-4">
                              <span className="text-lg">{categoryIcon[order.category] || '✧'}</span>
                              <span className="font-display text-sm font-semibold text-gold-400">Результат от {order.psychicName}</span>
                            </div>
                            <div className="font-mystical text-sm text-mystic-300 leading-relaxed whitespace-pre-line">
                              {order.result}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
