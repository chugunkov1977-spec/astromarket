'use client';

import { useState, useMemo, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/catalog/ProductCard';
import CatalogFiltersComponent from '@/components/catalog/CatalogFilters';
import { psychics, products } from '@/data/seed-data';
import type { CatalogFilters } from '@/types';

// Трансформация данных
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

function filtersFromParams(params: URLSearchParams): CatalogFilters {
  return {
    category: params.get('category') || undefined,
    theme: params.get('theme') || undefined,
    priceSegment: params.get('priceSegment') || undefined,
    sort: params.get('sort') || 'popular',
  };
}

function paramsFromFilters(filters: CatalogFilters): string {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.theme) params.set('theme', filters.theme);
  if (filters.priceSegment) params.set('priceSegment', filters.priceSegment);
  if (filters.sort && filters.sort !== 'popular') params.set('sort', filters.sort);
  const qs = params.toString();
  return qs ? `/catalog?${qs}` : '/catalog';
}

export default function CatalogPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CatalogPage />
    </Suspense>
  );
}

function CatalogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<CatalogFilters>(() => filtersFromParams(searchParams));

  // Синхронизируем фильтры при изменении URL (навигация через хедер, кнопку назад и т.д.)
  useEffect(() => {
    setFilters(filtersFromParams(searchParams));
  }, [searchParams]);

  const handleFiltersChange = useCallback((next: CatalogFilters) => {
    setFilters(next);
    router.push(paramsFromFilters(next), { scroll: false });
  }, [router]);

  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.theme) {
      result = result.filter((p) => p.theme === filters.theme);
    }
    if (filters.priceSegment) {
      result = result.filter((p) => p.priceSegment === filters.priceSegment);
    }
    if (filters.minRating) {
      result = result.filter((p) => p.rating >= filters.minRating!);
    }

    switch (filters.sort) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'new':
        result.sort((a, b) => (b.badges.includes('new') ? 1 : 0) - (a.badges.includes('new') ? 1 : 0));
        break;
      default:
        result.sort((a, b) => b.orderCount - a.orderCount);
    }

    return result;
  }, [filters]);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            Каталог услуг
          </h1>
          <p className="text-mystic-400">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'услуга' : filteredProducts.length < 5 ? 'услуги' : 'услуг'}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Фильтры (сайдбар) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28">
              <CatalogFiltersComponent filters={filters} onChange={handleFiltersChange} />
            </div>
          </aside>

          {/* Сетка товаров */}
          <div className="flex-1">
            {/* Мобильные фильтры */}
            <div className="lg:hidden mb-6">
              <CatalogFiltersComponent filters={filters} onChange={handleFiltersChange} />
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product as any} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <span className="text-5xl mb-4 block">🔮</span>
                <h3 className="font-display text-xl font-semibold text-white mb-2">
                  Ничего не найдено
                </h3>
                <p className="text-sm text-mystic-400 mb-6">
                  Попробуйте изменить фильтры или сбросить их
                </p>
                <button
                  onClick={() => handleFiltersChange({ sort: 'popular' })}
                  className="btn-primary"
                >
                  Сбросить фильтры
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
