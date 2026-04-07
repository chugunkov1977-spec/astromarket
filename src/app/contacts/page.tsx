'use client';

import { useState } from 'react';
import { Mail, MessageCircle, Clock, ChevronDown } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

const contacts = [
  { icon: Mail, label: 'Email', value: 'support@astromarket.shop', href: 'mailto:support@astromarket.shop' },
  { icon: MessageCircle, label: 'Telegram', value: '@astromarket_support', href: 'https://t.me/astromarket_support' },
  { icon: Clock, label: 'Время работы', value: 'Ежедневно с 9:00 до 21:00 (МСК)', href: null },
];

const faq = [
  { q: 'Как быстро я получу результат?', a: 'Время зависит от типа услуги: базовые — 1-10 минут, стандартные — 5-30 минут, премиум — до 2 часов.' },
  { q: 'Можно ли получить возврат?', a: 'Да, если результат не был доставлен, мы вернём средства в полном объёме в течение 24 часов.' },
  { q: 'Как работают AI-мастера?', a: 'Каждый мастер — уникальный AI-персонаж с собственным стилем и специализацией. Они генерируют персонализированные расклады на основе ваших данных.' },
  { q: 'Безопасны ли платежи?', a: 'Все платежи проходят через защищённую систему ЮKassa с поддержкой всех популярных способов оплаты.' },
  { q: 'Как связаться с поддержкой?', a: 'Напишите нам на support@astromarket.shop или в Telegram @astromarket_support. Мы отвечаем в течение 1 часа.' },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-mystic-800/20 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left gap-4">
        <span className="text-sm font-medium text-white">{q}</span>
        <ChevronDown className={cn('w-4 h-4 text-mystic-500 shrink-0 transition-transform duration-200', open && 'rotate-180')} />
      </button>
      <div className={cn('overflow-hidden transition-all duration-300', open ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0')}>
        <p className="text-sm text-mystic-400 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function ContactsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="font-display text-3xl font-bold text-white mb-8">Контакты</h1>

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {contacts.map((c) => (
            <div key={c.label} className="p-5 rounded-2xl glass-light text-center">
              <c.icon className="w-6 h-6 text-mystic-400 mx-auto mb-3" />
              <p className="text-xs text-mystic-500 mb-1">{c.label}</p>
              {c.href ? (
                <a href={c.href} className="text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors">{c.value}</a>
              ) : (
                <p className="text-sm font-medium text-white">{c.value}</p>
              )}
            </div>
          ))}
        </div>

        <section className="p-6 rounded-2xl glass-light">
          <h2 className="font-display text-xl font-bold text-white mb-4">Частые вопросы</h2>
          {faq.map((item) => (
            <FaqItem key={item.q} {...item} />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
