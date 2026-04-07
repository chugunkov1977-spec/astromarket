'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/catalog/ProductCard';
import { psychics, products } from '@/data/seed-data';
import { Star, ShoppingBag, MessageCircle, ArrowLeft } from 'lucide-react';
import { categoryLabels } from '@/lib/utils';

const psychicsList = psychics.map((p) => ({
  id: p.slug, slug: p.slug, name: p.name, avatarUrl: p.avatarUrl,
  coverImageUrl: p.coverImageUrl, bio: p.bio, shortBio: p.shortBio,
  legend: p.legend || null, specialization: p.specialization, style: p.style,
  rating: p.rating, totalOrders: p.totalOrders, isActive: true,
}));

const productsList = products.map((p) => {
  const psychic = psychicsList.find((ps) => ps.slug === p.psychicSlug);
  return {
    id: p.slug, slug: p.slug, title: p.title, shortDescription: p.shortDescription,
    description: p.description, imageUrl: p.imageUrl, galleryUrls: p.galleryUrls,
    category: p.category, theme: p.theme, priceSegment: p.priceSegment,
    price: p.price, oldPrice: p.oldPrice || null, rating: p.rating,
    reviewCount: p.reviewCount, orderCount: p.orderCount, badges: p.badges,
    isActive: true, psychicId: psychic?.id || '', psychic,
    inputFields: p.inputFields, deliveryFormat: p.deliveryFormat,
    generationTimeMin: p.generationTimeMin, generationTimeMax: p.generationTimeMax,
    maxFollowUps: p.maxFollowUps,
  };
});

export default function PsychicPage() {
  const params = useParams();
  const slug = params.slug as string;
  const psychic = psychicsList.find((p) => p.slug === slug);

  if (!psychic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl block mb-4">✧</span>
          <h2 className="font-display text-2xl text-white mb-4">Мастер не найден</h2>
          <Link href="/catalog" className="btn-primary">Вернуться в каталог</Link>
        </div>
      </div>
    );
  }

  const psychicProducts = productsList.filter((p) => p.psychicId === psychic.id);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Хлебные крошки */}
        <nav className="flex items-center gap-2 text-sm text-mystic-500 mb-6">
          <Link href="/" className="hover:text-mystic-300 transition-colors">Главная</Link>
          <span>/</span>
          <span className="text-mystic-300">{psychic.name}</span>
        </nav>

        {/* Профиль мастера */}
        <div className="rounded-2xl overflow-hidden glass border border-mystic-700/20 mb-10">
          {/* Обложка */}
          <div className="relative h-48 md:h-64 bg-gradient-to-br from-mystic-900/60 to-cosmic-900/40">
            <div className="absolute inset-0 bg-gradient-to-t from-night-950/90 to-transparent" />
          </div>

          {/* Инфо */}
          <div className="relative px-6 pb-6 -mt-16">
            <div className="flex flex-col md:flex-row md:items-end gap-5">
              {/* Аватар */}
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-mystic-500/30 to-cosmic-600/30 border-4 border-night-950 flex items-center justify-center text-4xl shadow-2xl shrink-0">
                ✧
              </div>

              <div className="flex-1">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                  {psychic.name}
                </h1>
                <p className="text-sm text-mystic-400 mb-3">{psychic.style}</p>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                    <span className="text-sm font-semibold text-gold-400">{psychic.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-mystic-400">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-sm">{psychic.totalOrders} заказов</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-mystic-400">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{psychicProducts.length} услуг</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {psychic.specialization.map((spec) => (
                      <span
                        key={spec}
                        className="px-2.5 py-0.5 rounded text-xs font-medium bg-mystic-500/15 text-mystic-300 border border-mystic-500/20"
                      >
                        {categoryLabels[spec.toUpperCase()] || spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Биография */}
        <div className="mb-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">О мастере</h2>
          <p className="text-sm text-mystic-300 leading-relaxed max-w-3xl">
            {psychic.bio}
          </p>
          {psychic.legend && (
            <div className="mt-4 p-5 rounded-xl glass-light max-w-3xl">
              <h3 className="font-display text-sm font-semibold text-mystic-200 mb-2 uppercase tracking-wider">Легенда</h3>
              <p className="text-sm text-mystic-400 leading-relaxed italic font-mystical text-base">
                «{psychic.legend}»
              </p>
            </div>
          )}
        </div>

        {/* Услуги мастера */}
        <div>
          <h2 className="font-display text-xl font-bold text-white mb-6">
            Услуги ({psychicProducts.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {psychicProducts.map((product, i) => (
              <ProductCard key={product.id} product={product as any} index={i} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
