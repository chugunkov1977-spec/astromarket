'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/catalog/ProductCard';
import PsychicCard from '@/components/psychic/PsychicCard';
import { psychics, products } from '@/data/seed-data';
import { ArrowRight, ArrowLeft, Search, UserCheck, Wand2, Gift } from 'lucide-react';

// Преобразуем seed-данные в формат компонентов
const psychicsList = psychics.map((p) => ({
  id: p.slug,
  slug: p.slug,
  name: p.name,
  avatarUrl: p.avatarUrl,
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
    imageUrl: p.imageUrl,
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
  { key: 'TAROT', label: 'Таро', image: '/images/categories/tarot.jpeg' },
  { key: 'ASTROLOGY', label: 'Астрология', image: '/images/categories/astrology.jpeg' },
  { key: 'NUMEROLOGY', label: 'Нумерология', image: '/images/categories/numerology.jpeg' },
  { key: 'RUNES', label: 'Руны', image: '/images/categories/runes.png' },
  { key: 'MEDITATION', label: 'Медитации', image: '/images/categories/meditation.png' },
  { key: 'COURSE', label: 'Курсы', image: '/images/categories/cources.jpeg' },
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

// Карусель мастеров с навигацией
function PsychicsCarousel({ psychics: list }: { psychics: typeof psychicsList }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex flex-row gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth py-2 px-1"
      >
        {list.map((psychic, i) => (
          <PsychicCard key={psychic.id} psychic={psychic} index={i} />
        ))}
      </div>

      {/* Left fade */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0a0614] to-transparent pointer-events-none z-[5]" />
      )}

      {/* Right fade */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0a0614] to-transparent pointer-events-none z-[5]" />
      )}

      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-night-950/80 backdrop-blur-sm border border-mystic-700/30 hover:border-mystic-500/40 hover:bg-mystic-900/80 flex items-center justify-center transition-all shadow-lg"
          aria-label="Прокрутить влево"
        >
          <ArrowLeft className="w-4 h-4 text-mystic-300" />
        </button>
      )}

      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-night-950/80 backdrop-blur-sm border border-mystic-700/30 hover:border-mystic-500/40 hover:bg-mystic-900/80 flex items-center justify-center transition-all shadow-lg"
          aria-label="Прокрутить вправо"
        >
          <ArrowRight className="w-4 h-4 text-mystic-300" />
        </button>
      )}
    </div>
  );
}

const banners = [
  { text: 'Скидка 20% на первый заказ', sub: 'Для новых пользователей — используйте промокод WELCOME20', btn: 'Активировать скидку', href: '/catalog', gradient: 'from-mystic-900 via-purple-900 to-mystic-900' },
  { text: 'Бесплатная карта дня', sub: 'Узнайте, что приготовили звёзды на сегодня', btn: 'Получить карту', href: '/catalog?category=TAROT', gradient: 'from-cosmic-900 via-indigo-900 to-cosmic-900' },
  { text: 'Подписка от 499 ₽/мес', sub: 'Ежедневные прогнозы и персональные расклады', btn: 'Выбрать тариф', href: '/subscription', gradient: 'from-amber-950 via-yellow-950 to-amber-950' },
];

function RotatingBanner() {
  const idx = Math.floor(Date.now() / (3 * 60 * 60 * 1000)) % 3;
  const b = banners[idx];

  return (
    <div className="max-w-7xl mx-auto px-4 my-3">
      <div className={`flex items-center justify-between rounded-2xl bg-gradient-to-r ${b.gradient} px-6 py-5 md:py-6 min-h-[100px] relative`}>
        <div>
          <p className="font-display text-base md:text-xl font-bold text-white mb-1">{b.text}</p>
          <p className="text-xs md:text-sm text-mystic-400">{b.sub}</p>
        </div>
        <Link href={b.href} className="btn-gold shrink-0 text-xs md:text-sm px-4 py-2 md:px-6 md:py-2.5">
          {b.btn}
        </Link>
        {/* Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === idx ? 'bg-gold-400' : 'bg-white/20'}`} />
          ))}
        </div>
      </div>
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
        <section className="border-y border-mystic-800/15 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-row gap-3 justify-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((cat) => (
                <Link
                  key={cat.key}
                  href={`/catalog?category=${cat.key}`}
                  className="relative shrink-0 w-[160px] h-[105px] lg:w-[190px] lg:h-[120px] rounded-xl overflow-hidden border border-mystic-700/20 hover:border-mystic-500/30 hover:shadow-lg hover:shadow-mystic-500/10 group transition-all duration-300"
                >
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    sizes="(min-width: 1024px) 190px, 160px"
                    className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <span
                    className="absolute bottom-0 left-0 right-0 px-3 pb-2 text-sm font-semibold text-white"
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
                  >
                    {cat.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== ПРОМО-БАННЕР (ротация) ===== */}
        <RotatingBanner />

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
          <div className="max-w-7xl mx-auto px-4">
            <SectionHeader title="Лучшие мастера" href="/catalog" linkText="Все мастера" />
            <PsychicsCarousel psychics={psychicsList} />
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
                { num: '3', icon: <Wand2 className="w-5 h-5" />, title: 'Мастер готовит ответ', desc: 'Настраивается на вашу энергию' },
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
