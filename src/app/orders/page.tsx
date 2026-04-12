'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Star, MessageCircle, Package, LogIn } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';

// ── Mock data ──────────────────────────────────────────

const activeOrders = [
  {
    id: '1024',
    title: 'Классический расклад Таро',
    psychicName: 'Кассандра',
    price: 49900,
    status: 'in_progress',
    statusLabel: 'В работе',
    timeEstimate: '10-15 мин',
    date: '7 апреля 2026',
    lastMessage: {
      from: 'Кассандра',
      text: 'Настраиваюсь на вашу энергию, расклад будет готов совсем скоро...',
      time: '2 мин назад',
    },
  },
  {
    id: '1023',
    title: 'Гороскоп на месяц',
    psychicName: 'Орион',
    price: 59900,
    status: 'pending',
    statusLabel: 'Ожидание',
    timeEstimate: '5-12 мин',
    date: '7 апреля 2026',
    lastMessage: null,
  },
];

const completedOrders = [
  {
    id: '1018',
    title: 'Таро на отношения',
    psychicName: 'Кассандра',
    price: 44900,
    date: '3 апреля 2026',
    rating: 5,
    hasReview: true,
  },
  {
    id: '1012',
    title: 'Натальная карта',
    psychicName: 'Орион',
    price: 99900,
    date: '28 марта 2026',
    rating: 5,
    hasReview: false,
  },
];

// ── Component ──────────────────────────────────────────

export default function OrdersPage() {
  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => { setMounted(true); }, []);

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

  return (
    <div className="min-h-screen relative">
      <Header />
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="font-display text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Package className="w-7 h-7 text-mystic-400" />
            Мои заказы
          </h1>

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
                <span className={cn(
                  'ml-1.5 text-xs',
                  tab === 'active' ? 'text-night-950/60' : 'text-mystic-600',
                )}>
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
            </button>
          </div>

          {/* Active orders */}
          {tab === 'active' && (
            <div className="space-y-4">
              {activeOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-light rounded-2xl p-5"
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white">Заказ #{order.id}</span>
                    <span className={cn(
                      'px-3 py-0.5 rounded-full text-xs font-medium',
                      order.status === 'in_progress' && 'bg-amber-500/20 text-amber-400',
                      order.status === 'pending' && 'bg-mystic-500/20 text-mystic-400',
                    )}>
                      {order.statusLabel}
                    </span>
                  </div>

                  {/* Product info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-mystic-500/30 to-cosmic-600/30 border border-mystic-500/20 flex items-center justify-center text-lg shrink-0">
                      ✧
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{order.title}</p>
                      <p className="text-xs text-mystic-400">{order.psychicName}</p>
                    </div>
                    <span className="ml-auto text-sm font-bold text-white">{formatPrice(order.price)}</span>
                  </div>

                  {/* Progress */}
                  {order.status === 'in_progress' && (
                    <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
                      <div className="flex gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse [animation-delay:0.4s]" />
                      </div>
                      <span className="text-xs text-amber-400">Мастер готовит ваш расклад...</span>
                    </div>
                  )}

                  {/* Time */}
                  <div className="flex items-center gap-1.5 mb-4 text-mystic-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs">Ожидаемое время: {order.timeEstimate}</span>
                  </div>

                  {/* Chat preview */}
                  {order.lastMessage && (
                    <div className="bg-mystic-900/40 rounded-xl p-3 mb-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-mystic-500/30 to-cosmic-600/30 flex items-center justify-center text-xs">
                          ✧
                        </div>
                        <span className="text-xs font-medium text-white">{order.lastMessage.from}</span>
                        <span className="text-[10px] text-mystic-600 ml-auto">{order.lastMessage.time}</span>
                      </div>
                      <p className="text-xs text-mystic-300 truncate pl-8">{order.lastMessage.text}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-mystic-600">Заказ от {order.date}</span>
                    <Link
                      href={`/order/${order.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-mystic-600/15 text-sm font-medium text-mystic-300 hover:bg-mystic-600/25 hover:text-white transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Открыть чат
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Completed orders */}
          {tab === 'completed' && (
            <div className="space-y-4">
              {completedOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-light rounded-2xl p-5"
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white">Заказ #{order.id}</span>
                    <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                      Завершён
                    </span>
                  </div>

                  {/* Product info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-mystic-500/30 to-cosmic-600/30 border border-mystic-500/20 flex items-center justify-center text-lg shrink-0">
                      ✧
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{order.title}</p>
                      <p className="text-xs text-mystic-400">{order.psychicName}</p>
                    </div>
                    <span className="ml-auto text-sm font-bold text-white">{formatPrice(order.price)}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }, (_, j) => (
                        <Star
                          key={j}
                          className={cn(
                            'w-4 h-4',
                            j < order.rating ? 'text-gold-400 fill-gold-400' : 'text-mystic-700',
                          )}
                        />
                      ))}
                    </div>
                    {!order.hasReview && (
                      <button className="text-xs text-gold-400 hover:text-gold-300 transition-colors">
                        Оставить отзыв
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-mystic-600">Заказ от {order.date}</span>
                    <Link
                      href={`/order/${order.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-mystic-600/15 text-sm font-medium text-mystic-300 hover:bg-mystic-600/25 hover:text-white transition-all"
                    >
                      Посмотреть результат
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
