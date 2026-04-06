'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/catalog/ProductCard';
import PsychicCarousel from '@/components/psychic/PsychicCarousel';
import { psychics, products } from '@/data/seed-data';
import { ArrowRight, Search, UserCheck, Wand2, Gift } from 'lucide-react';

// Преобразуем seed-данные в формат компонентов
const psychicsList = psychics.map((p) => ({
  id: p.slug,
  slug: p.slug,
  name: p.name,
  bio: p.bio,
  shortBio: p.shortBio,
  specialization: p.specialization,
  style: p.style,
  rating: p.rating,
  totalOrders: p.totalOrders,
  isActive: true,
}));

const productsList = products.map((p) => {
  const psychic = psychicsList.find((ps) => ps.slug === p.psychicSlug);
  return {
    id: p.slug,
    slug: p.slug,
    title: p.title,
    shortDescription: p.shortDescription,
    category: p.category,
    price: p.price,
    oldPrice: p.oldPrice || null,
    rating: p.rating,
    reviewCount: p.reviewCount,
    orderCount: p.orderCount,
    badges: p.badges,
    psychic: psychic ? { name: psychic.name, slug: psychic.slug } : null,
    generationTimeMin: p.generationTimeMin,
    generationTimeMax: p.generationTimeMax,
  };
});

const categories = [
  { key: 'TAROT', label: 'Таро', icon: '🃏' },
  { key: 'ASTROLOGY', label: 'Астрология', icon: '⭐' },
  { key: 'NUMEROLOGY', label: 'Нумерология', icon: '🔢' },
  { key: 'RUNES', label: 'Руны', icon: 'ᚱ' },
  { key: 'MEDITATION', label: 'Медитации', icon: '🧘' },
  { key: 'COURSE', label: 'Курсы', icon: '📚' },
];

// Топ-10 по заказам
const popularProducts = [...productsList]
  .sort((a, b) => b.orderCount - a.orderCount)
  .slice(0, 10);

// Со скидкой
const saleProducts = productsList.filter((p) => p.oldPrice !== null);

// Новинки
const newProducts = productsList.filter((p) => p.badges.includes('new'));

// Секция-заголовок
function SectionHeader({ title, href, linkText }: { title: string; href?: string; linkText?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-display text-lg font-bold text-white">{title}</h2>
      {href && (
        <Link href={href} className="text-xs text-mystic-400 hover:text-mystic-200 flex items-center gap-1 transition-colors">
          {linkText} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      {/* Фоновое изображение с параллаксом */}
      <div className="bg-mystic-pattern" aria-hidden="true" />
      <div className="bg-mystic-pattern-fade" aria-hidden="true" />

      <Header />

      <main className="relative z-10">
        {/* ===== ПОЛОСА КАТЕГОРИЙ ===== */}
        <section className="border-b border-mystic-800/20 bg-night-950/80">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-6 py-3 overflow-x-auto scrollbar-hide md:justify-center">
              {categories.map((cat) => (
                <Link
                  key={cat.key}
                  href={`/catalog?category=${cat.key}`}
                  className="flex flex-col items-center gap-1.5 shrink-0 group"
                >
                  <div className="w-[60px] h-[60px] rounded-full bg-mystic-800/30 flex items-center justify-center text-2xl group-hover:bg-mystic-500/30 transition-colors duration-200">
                    {cat.icon}
                  </div>
                  <span className="text-xs text-mystic-400 group-hover:text-mystic-200 transition-colors">
                    {cat.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== ПРОМО-БАННЕР ===== */}
        <div className="max-w-7xl mx-auto px-4 my-3">
          <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-mystic-900 via-cosmic-900 to-mystic-900 px-6 py-5 md:py-6 min-h-[100px]">
            <div>
              <p className="font-display text-base md:text-xl font-bold text-white mb-1">
                Персональные AI-расклады
              </p>
              <p className="text-xs md:text-sm text-mystic-400">
                Точность и глубина предсказаний
              </p>
            </div>
            <Link
              href="/catalog"
              className="btn-gold shrink-0 text-xs md:text-sm px-4 py-2 md:px-6 md:py-2.5"
            >
              −20% на первый заказ
            </Link>
          </div>
        </div>

        {/* ===== ПОПУЛЯРНЫЕ УСЛУГИ ===== */}
        <section className="py-4">
          <div className="max-w-7xl mx-auto px-4">
            <SectionHeader title="Популярные услуги" href="/catalog" linkText="Все" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {popularProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ===== ВЫГОДНЫЕ ПРЕДЛОЖЕНИЯ ===== */}
        {saleProducts.length > 0 && (
          <section className="py-4">
            <div className="max-w-7xl mx-auto px-4">
              <SectionHeader title="Выгодные предложения 🔥" href="/catalog" linkText="Все скидки" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {saleProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== ЛУЧШИЕ МАСТЕРА ===== */}
        <section className="py-4">
          <div className="max-w-7xl mx-auto px-4 md:px-4">
            <SectionHeader title="Лучшие мастера" href="/catalog" linkText="Все мастера" />
          </div>
          <div className="max-w-7xl mx-auto">
            <PsychicCarousel psychics={psychicsList} />
          </div>
        </section>

        {/* ===== НОВИНКИ ===== */}
        {newProducts.length > 0 && (
          <section className="py-4">
            <div className="max-w-7xl mx-auto px-4">
              <SectionHeader title="Новинки" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {newProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== КАК ЭТО РАБОТАЕТ ===== */}
        <section className="py-4">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-display text-lg font-bold text-white mb-3">Как это работает</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { num: '1', icon: <Search className="w-5 h-5" />, title: 'Выберите услугу', desc: 'Найдите расклад в каталоге' },
                { num: '2', icon: <UserCheck className="w-5 h-5" />, title: 'Расскажите о себе', desc: 'Имя, дата рождения, вопрос' },
                { num: '3', icon: <Wand2 className="w-5 h-5" />, title: 'Мастер готовит ответ', desc: 'AI настраивается на вашу энергию' },
                { num: '4', icon: <Gift className="w-5 h-5" />, title: 'Получите результат', desc: 'Расклад с интерпретацией' },
              ].map((step) => (
                <div
                  key={step.num}
                  className="rounded-xl bg-mystic-900/10 border border-mystic-800/15 p-4 flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-mystic-600/15 flex items-center justify-center text-mystic-400 shrink-0 relative">
                    {step.icon}
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-mystic-600 text-white text-[9px] font-bold flex items-center justify-center">
                      {step.num}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white leading-tight">{step.title}</p>
                    <p className="text-[11px] text-mystic-500 leading-tight mt-0.5">{step.desc}</p>
                  </div>
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
