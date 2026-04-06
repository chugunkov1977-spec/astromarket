'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, RefreshCw, Sparkles, Clock } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

// ── Plan data ──────────────────────────────────────────

interface PlanFeature {
  text: string;
}

interface Plan {
  name: string;
  price: string;
  period: string;
  subtitle: string;
  featured: boolean;
  features: PlanFeature[];
  delay: number;
}

const plans: Plan[] = [
  {
    name: 'Звёздный',
    price: '499',
    period: 'мес',
    subtitle: 'Для начинающих',
    featured: false,
    delay: 0.1,
    features: [
      { text: 'Ежедневный персональный гороскоп' },
      { text: '1 мини-расклад в месяц' },
      { text: 'Скидка 10% на все товары' },
      { text: 'Доступ к лунному календарю' },
    ],
  },
  {
    name: 'Лунный',
    price: '999',
    period: 'мес',
    subtitle: 'Оптимальный выбор',
    featured: true,
    delay: 0.2,
    features: [
      { text: 'Всё из тарифа «Звёздный»' },
      { text: '3 полных расклада в месяц' },
      { text: 'Доступ к медитациям' },
      { text: 'Приоритетная очередь' },
      { text: 'Расширенные прогнозы' },
    ],
  },
  {
    name: 'Солнечный',
    price: '2 499',
    period: 'мес',
    subtitle: 'Максимальные возможности',
    featured: false,
    delay: 0.3,
    features: [
      { text: 'Всё из тарифа «Лунный»' },
      { text: 'Безлимитные мини-расклады' },
      { text: '1 премиум-консультация' },
      { text: 'Персональный AI-наставник' },
      { text: 'Эксклюзивные мастера' },
    ],
  },
];

const perks = [
  { icon: Shield, label: 'Безопасная оплата' },
  { icon: RefreshCw, label: 'Отмена в любой момент' },
  { icon: Sparkles, label: 'Персонализация AI' },
  { icon: Clock, label: 'Мгновенный доступ' },
];

// ── Card spring config ─────────────────────────────────

const springBase = { type: 'spring' as const, stiffness: 260, damping: 20 };

// ── Component ──────────────────────────────────────────

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen relative">
      <Header />

      <main className="relative z-10">
        {/* ====== Title ====== */}
        <section className="py-8 text-center">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="font-display text-3xl font-bold text-white mb-3">
              Подписка
            </h1>
            <p className="text-mystic-400 max-w-lg mx-auto">
              Выберите тариф и получайте персональные прогнозы каждый день
            </p>
          </div>
        </section>

        {/* ====== Pricing cards ====== */}
        <section className="pb-12">
          <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center lg:items-end justify-center gap-6 lg:gap-5">
            {plans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>
        </section>

        {/* ====== Perks ====== */}
        <section className="pb-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-display text-lg font-bold text-white text-center mb-6">
              Все тарифы включают
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {perks.map((perk) => (
                <div
                  key={perk.label}
                  className="glass-light rounded-xl p-4 flex flex-col items-center gap-2 text-center"
                >
                  <perk.icon className="w-5 h-5 text-mystic-400" />
                  <span className="text-sm text-mystic-300">{perk.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Pricing card ───────────────────────────────────────

function PricingCard({ plan }: { plan: Plan }) {
  const isFeatured = plan.featured;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springBase, delay: plan.delay }}
      whileHover={{ scale: isFeatured ? 1.08 : 1.05 }}
      className={cn(
        'relative flex flex-col rounded-2xl backdrop-blur-md transition-all duration-300',
        isFeatured
          ? 'w-full lg:w-80 border-2 border-mystic-500/50 bg-gradient-to-b from-mystic-950/80 to-night-950/90 p-10 shadow-xl shadow-mystic-500/10 lg:scale-105'
          : 'w-full lg:w-72 border border-mystic-700/30 bg-night-950/60 p-8 hover:border-mystic-500/40',
      )}
    >
      {/* Featured badge */}
      {isFeatured && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-mystic-500 to-cosmic-600 text-white text-xs font-bold px-4 py-1">
          Популярный
        </span>
      )}

      {/* Plan name */}
      <h3 className="font-display text-xl font-bold text-white mb-1 text-center">
        {plan.name}
      </h3>
      <p className="text-xs text-mystic-500 text-center mb-6">{plan.subtitle}</p>

      {/* Price */}
      <div className="flex items-baseline justify-center gap-1 mb-8">
        <span className={cn('font-display text-4xl font-bold', isFeatured ? 'text-gold-400' : 'text-white')}>
          {plan.price}
        </span>
        <span className="text-sm text-mystic-500">₽/{plan.period}</span>
      </div>

      {/* Features */}
      <ul className="flex-1 space-y-3 mb-8">
        {plan.features.map((f) => (
          <li key={f.text} className="flex items-start gap-2.5">
            <span className={cn('text-sm leading-none mt-0.5', isFeatured ? 'text-gold-400' : 'text-mystic-400')}>
              ✧
            </span>
            <span className="text-sm text-mystic-300">{f.text}</span>
          </li>
        ))}
      </ul>

      {/* CTA button */}
      <Link
        href="/auth"
        className={cn(
          'block w-full text-center py-3 rounded-xl text-sm font-bold transition-all duration-200',
          isFeatured
            ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-night-950 hover:from-gold-400 hover:to-gold-500 shadow-lg shadow-gold-500/20'
            : 'border border-mystic-500/40 text-mystic-300 hover:bg-mystic-500/10',
        )}
      >
        Выбрать тариф
      </Link>
    </motion.div>
  );
}
