import type { Metadata } from 'next';
import { Sparkles, Users, Zap, Shield } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = { title: 'О нас | AstroMarket', description: 'AstroMarket — первый AI-маркетплейс эзотерических услуг в России' };

const features = [
  { icon: Sparkles, title: 'AI-точность', desc: 'Предсказания на основе продвинутых алгоритмов искусственного интеллекта' },
  { icon: Users, title: '5 уникальных мастеров', desc: 'Каждый мастер обладает собственным стилем и специализацией' },
  { icon: Zap, title: 'Мгновенный результат', desc: 'Получайте персональные расклады за считанные минуты' },
  { icon: Shield, title: 'Конфиденциальность', desc: 'Ваши данные надёжно защищены и никогда не передаются третьим лицам' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="font-display text-3xl font-bold text-white mb-3">О нас</h1>
        <p className="text-mystic-400 mb-10 text-lg leading-relaxed">
          AstroMarket — первый AI-маркетплейс эзотерических услуг в России
        </p>

        {/* Миссия */}
        <section className="mb-10 p-6 rounded-2xl glass-light">
          <h2 className="font-display text-xl font-bold text-white mb-3">Наша миссия</h2>
          <p className="text-sm text-mystic-300 leading-relaxed">
            Мы создали платформу, где искусственный интеллект и древние эзотерические практики объединяются, чтобы дать вам персонализированные и точные предсказания. Наши AI-мастера сочетают глубокое знание традиций Таро, астрологии, нумерологии и рунологии с передовыми технологиями для создания уникального опыта.
          </p>
        </section>

        {/* Почему мы */}
        <section className="mb-10">
          <h2 className="font-display text-xl font-bold text-white mb-5">Почему мы</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f.title} className="p-5 rounded-2xl glass-light">
                <f.icon className="w-6 h-6 text-mystic-400 mb-3" />
                <h3 className="font-display text-base font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-xs text-mystic-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Команда */}
        <section className="mb-10 p-6 rounded-2xl glass-light">
          <h2 className="font-display text-xl font-bold text-white mb-3">Наша команда</h2>
          <p className="text-sm text-mystic-300 leading-relaxed">
            За AstroMarket стоит команда энтузиастов, объединяющих экспертизу в области AI, UX-дизайна и эзотерических практик. Мы верим, что технологии могут сделать древнюю мудрость доступной каждому.
          </p>
        </section>

        {/* Контакты */}
        <section className="p-6 rounded-2xl glass-light">
          <h2 className="font-display text-xl font-bold text-white mb-3">Связаться с нами</h2>
          <div className="space-y-2 text-sm text-mystic-300">
            <p>Email: <a href="mailto:support@astromarket.shop" className="text-gold-400 hover:text-gold-300 transition-colors">support@astromarket.shop</a></p>
            <p>Telegram: <a href="https://t.me/astromarket_support" className="text-gold-400 hover:text-gold-300 transition-colors">@astromarket_support</a></p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
