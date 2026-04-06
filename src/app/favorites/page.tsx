'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/catalog/ProductCard';
import { useFavoritesStore } from '@/hooks/useFavorites';
import { products, psychics } from '@/data/seed-data';

// Pre-build product list in the format ProductCard expects
const psychicsList = psychics.map((p) => ({
  slug: p.slug,
  name: p.name,
}));

const allProducts = products.map((p) => {
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

export default function FavoritesPage() {
  const favorites = useFavoritesStore((s) => s.favorites);
  const loaded = useFavoritesStore((s) => s.loaded);
  const loadFromStorage = useFavoritesStore((s) => s.loadFromStorage);

  useEffect(() => {
    if (!loaded) loadFromStorage();
  }, [loaded, loadFromStorage]);

  const favProducts = allProducts.filter((p) => favorites.includes(p.slug));

  return (
    <div className="min-h-screen relative">
      <Header />

      <main className="relative z-10">
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-mystic-400" />
              <h1 className="font-display text-3xl font-bold text-white">Избранное</h1>
            </div>

            {loaded && favProducts.length === 0 ? (
              <div className="text-center py-20">
                <Heart className="w-12 h-12 text-mystic-700 mx-auto mb-4" />
                <p className="text-mystic-400 mb-4">У вас пока нет избранных услуг</p>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-mystic-500/40 text-sm font-medium text-mystic-300 hover:bg-mystic-500/10 transition-colors"
                >
                  Перейти в каталог
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {favProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
