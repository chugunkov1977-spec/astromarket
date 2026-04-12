'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/catalog/ProductCard';
import { useFavoritesStore } from '@/hooks/useFavorites';
import { useAuthStore } from '@/hooks/useAuth';
import { useCartStore } from '@/hooks/useCart';
import { useOrdersStore } from '@/hooks/useOrders';
import { useToastStore } from '@/hooks/useToast';
import { psychics, products, reviewTexts } from '@/data/seed-data';
import { Star, Clock, MessageCircle, Shield, Heart, ArrowLeft, ShoppingBag, ShoppingCart, User, Check, ChevronDown, ChevronUp, X } from 'lucide-react';
import { cn, formatPrice, categoryLabels, themeLabels } from '@/lib/utils';

// Трансформация данных (то же что на главной)
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

// Генерация фейковых отзывов для товара
function generateReviews(productCategory: string, count: number) {
  const categoryKey = productCategory.toLowerCase();
  const texts = reviewTexts[categoryKey] || reviewTexts.tarot;
  const names = ['Анна М.', 'Мария К.', 'Елена В.', 'Наталья С.', 'Ольга Д.', 'Ирина П.', 'Светлана Л.', 'Дарья Т.', 'Алексей Р.', 'Дмитрий Н.', 'Юлия А.', 'Виктория Б.', 'Полина Г.', 'Кристина Е.', 'Екатерина Ж.'];

  return Array.from({ length: Math.min(count, texts.length) }, (_, i) => ({
    id: `review-${i}`,
    rating: i < texts.length * 0.7 ? 5 : 4,
    text: texts[i % texts.length],
    authorName: names[i % names.length],
    createdAt: new Date(Date.now() - (i + 1) * 86400000 * (3 + Math.random() * 30)).toISOString(),
  }));
}

// ── Client data modal ──

const fieldLabels: Record<string, { label: string; placeholder: string; type: string }> = {
  name: { label: 'Ваше имя', placeholder: 'Как к вам обращаться', type: 'text' },
  birthDate: { label: 'Дата рождения', placeholder: '', type: 'date' },
  birthTime: { label: 'Время рождения', placeholder: 'Например: 14:30', type: 'time' },
  birthPlace: { label: 'Место рождения', placeholder: 'Город, страна', type: 'text' },
  question: { label: 'Ваш вопрос', placeholder: 'Опишите ситуацию или задайте вопрос...', type: 'textarea' },
  partnerName: { label: 'Имя партнёра', placeholder: 'Как зовут вашего партнёра', type: 'text' },
  partnerBirthDate: { label: 'Дата рождения партнёра', placeholder: '', type: 'date' },
  zodiacSign: { label: 'Знак зодиака', placeholder: 'Например: Овен', type: 'text' },
};

function ClientDataModal({ inputFields, onSubmit, onClose }: { inputFields: string[]; onSubmit: (data: Record<string, string>) => void; onClose: () => void }) {
  const [data, setData] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl glass border border-mystic-700/20 p-6 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-mystic-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-display text-lg font-bold text-white mb-1">Расскажите о себе</h3>
        <p className="text-xs text-mystic-500 mb-5">Заполните данные для персонального расклада</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {inputFields.map((field) => {
            const meta = fieldLabels[field] || { label: field, placeholder: '', type: 'text' };
            return (
              <div key={field}>
                <label className="block text-sm text-mystic-300 mb-1.5">{meta.label}</label>
                {meta.type === 'textarea' ? (
                  <textarea
                    value={data[field] || ''}
                    onChange={(e) => setData((d) => ({ ...d, [field]: e.target.value }))}
                    placeholder={meta.placeholder}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-night-950/60 border border-mystic-800/30 text-sm text-white placeholder-mystic-600 focus:outline-none focus:border-mystic-500/50 transition-all resize-none"
                  />
                ) : (
                  <input
                    type={meta.type}
                    value={data[field] || ''}
                    onChange={(e) => setData((d) => ({ ...d, [field]: e.target.value }))}
                    placeholder={meta.placeholder}
                    className="w-full px-4 py-3 rounded-xl bg-night-950/60 border border-mystic-800/30 text-sm text-white placeholder-mystic-600 focus:outline-none focus:border-mystic-500/50 transition-all"
                  />
                )}
              </div>
            );
          })}

          <button type="submit" className="w-full btn-gold flex items-center justify-center gap-2 py-3.5 mt-2">
            <ShoppingBag className="w-4 h-4" />
            Отправить заказ
          </button>
        </form>
      </div>
    </div>
  );
}

function CartButtons({ product }: { product: { id: string; slug: string; title: string; price: number; oldPrice: number | null; imageUrl: string; category: string; psychic?: { name: string } | null; inputFields?: string[] } }) {
  const router = useRouter();
  const cartItems = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authToken = useAuthStore((s) => s.token);
  const createOrder = useOrdersStore((s) => s.createOrder);
  const showToast = useToastStore((s) => s.showToast);
  const [showModal, setShowModal] = useState(false);

  const inCart = cartItems.some((i) => i.productId === product.id);

  const cartData = {
    productId: product.id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    oldPrice: product.oldPrice,
    imageUrl: product.imageUrl || null,
    psychicName: product.psychic?.name || '',
    category: product.category,
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }
    setShowModal(true);
  };

  const handleOrderSubmit = (clientData: Record<string, string>) => {
    createOrder([{ ...cartData, quantity: 1 }], clientData, authToken);
    showToast('Заказ оформлен!', 'success');
    setShowModal(false);
    router.push('/orders');
  };

  const handleAddToCart = () => {
    if (inCart) {
      showToast('Товар уже в корзине', 'info');
      return;
    }
    addItem(cartData);
    showToast('Добавлено в корзину', 'success');
  };

  return (
    <>
      {showModal && (
        <ClientDataModal
          inputFields={product.inputFields || ['name', 'question']}
          onSubmit={handleOrderSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
      <button
        onClick={handleBuyNow}
        className="w-full btn-gold flex items-center justify-center gap-2 text-base py-4 mb-2"
      >
        <ShoppingBag className="w-5 h-5" />
        Купить сейчас
      </button>
      <button
        onClick={handleAddToCart}
        className={cn(
          'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 mb-3',
          inCart
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'border border-mystic-700/30 text-mystic-300 hover:text-white hover:border-mystic-500/50 hover:bg-mystic-500/10',
        )}
      >
        {inCart ? (
          <><Check className="w-4 h-4" /> В корзине</>
        ) : (
          <><ShoppingCart className="w-4 h-4" /> В корзину</>
        )}
      </button>
    </>
  );
}

function FavoriteButton({ slug }: { slug: string }) {
  const favorites = useFavoritesStore((s) => s.favorites);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFav = favorites.includes(slug);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(slug);
      }}
      className={cn(
        'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm transition-all',
        isFav
          ? 'border-rose-400/30 text-rose-400 hover:bg-rose-500/10'
          : 'border-mystic-700/30 text-mystic-300 hover:text-white hover:border-mystic-500/50',
      )}
    >
      <Heart className={cn('w-4 h-4', isFav && 'fill-rose-400 text-rose-400')} />
      {isFav ? 'В избранном' : 'В избранное'}
    </button>
  );
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const product = productsList.find((p) => p.slug === slug);
  const [showAllDescription, setShowAllDescription] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl block mb-4">🔮</span>
          <h2 className="font-display text-2xl text-white mb-4">Товар не найден</h2>
          <Link href="/catalog" className="btn-primary">Вернуться в каталог</Link>
        </div>
      </div>
    );
  }

  const reviews = generateReviews(product.category, product.reviewCount > 10 ? 10 : product.reviewCount);
  const psychic = product.psychic;

  // Похожие товары
  const similarProducts = productsList
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Другие товары мастера
  const psychicProducts = productsList
    .filter((p) => p.psychicId === product.psychicId && p.id !== product.id)
    .slice(0, 4);

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  const categoryIcon: Record<string, string> = {
    TAROT: '🃏', ASTROLOGY: '⭐', NUMEROLOGY: '🔢', RUNES: 'ᚱ', MEDITATION: '🧘', COURSE: '📚',
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Хлебные крошки */}
        <nav className="flex items-center gap-2 text-sm text-mystic-500 mb-6">
          <Link href="/" className="hover:text-mystic-300 transition-colors">Главная</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-mystic-300 transition-colors">Каталог</Link>
          <span>/</span>
          <Link href={`/catalog?category=${product.category}`} className="hover:text-mystic-300 transition-colors">
            {categoryLabels[product.category]}
          </Link>
          <span>/</span>
          <span className="text-mystic-300 truncate max-w-[200px]">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Левая колонка — контент */}
          <div>
            {/* Изображение товара */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-mystic-900/40 to-cosmic-900/40 border border-mystic-800/20 mb-8">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-8xl opacity-30">{categoryIcon[product.category] || '✧'}</span>
                </div>
              )}
              {/* Бейджи */}
              <div className="absolute top-4 left-4 flex gap-2">
                {product.badges.map((badge) => (
                  <span key={badge} className={cn(
                    'px-3 py-1 rounded-lg text-xs font-semibold shadow-lg',
                    badge === 'hit' && 'bg-amber-500/90 text-white',
                    badge === 'new' && 'bg-emerald-500/90 text-white',
                    badge === 'sale' && 'bg-rose-500/90 text-white',
                  )}>
                    {badge === 'hit' && 'Хит продаж'}
                    {badge === 'new' && 'Новинка'}
                    {badge === 'sale' && 'Скидка'}
                  </span>
                ))}
              </div>
            </div>

            {/* Название и основная инфа */}
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
              {product.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                <span className="text-sm font-semibold text-gold-400">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-mystic-700">·</span>
              <span className="text-sm text-mystic-400">{product.reviewCount} отзывов</span>
              <span className="text-mystic-700">·</span>
              <span className="text-sm text-mystic-400">{product.orderCount} заказов</span>
              <span className="text-mystic-700">·</span>
              <span className="text-sm text-mystic-400">{categoryLabels[product.category]}</span>
              <span className="text-mystic-700">·</span>
              <span className="text-sm text-mystic-400">{themeLabels[product.theme]}</span>
            </div>

            {/* Описание */}
            <div className="mb-8">
              <h2 className="font-display text-lg font-semibold text-white mb-3">Описание</h2>
              <div className={cn('text-sm text-mystic-300 leading-relaxed', !showAllDescription && 'line-clamp-4')}>
                {product.description}
              </div>
              {product.description.length > 200 && (
                <button
                  onClick={() => setShowAllDescription(!showAllDescription)}
                  className="mt-2 text-sm text-mystic-400 hover:text-mystic-200 flex items-center gap-1 transition-colors"
                >
                  {showAllDescription ? (
                    <>Свернуть <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Читать полностью <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              )}
            </div>

            {/* Что входит */}
            <div className="mb-8 p-5 rounded-2xl glass-light">
              <h3 className="font-display text-base font-semibold text-white mb-4">Что вы получите</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Персональный расклад по вашему вопросу',
                  'Детальная интерпретация каждого элемента',
                  'Практические советы и рекомендации',
                  `Возможность задать ${product.maxFollowUps} уточняющих вопросов`,
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-mystic-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* О мастере */}
            {psychic && (
              <div className="mb-8 p-5 rounded-2xl glass-light">
                <h3 className="font-display text-base font-semibold text-white mb-4">О мастере</h3>
                <Link href={`/psychic/${psychic.slug}`} className="flex items-start gap-4 group">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative">
                    {psychic.avatarUrl ? (
                      <Image
                        src={psychic.avatarUrl}
                        alt={psychic.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-mystic-500/30 to-cosmic-600/30 border border-mystic-500/20 flex items-center justify-center text-2xl">
                        ✧
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-display text-base font-semibold text-white group-hover:text-mystic-200 transition-colors">
                      {psychic.name}
                    </h4>
                    <p className="text-xs text-mystic-400 mb-2">{psychic.style}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                        <span className="text-xs font-semibold text-gold-400">{psychic.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-xs text-mystic-500">{psychic.totalOrders} заказов</span>
                    </div>
                    <p className="text-sm text-mystic-300 mt-2 line-clamp-2">{psychic.shortBio}</p>
                  </div>
                </Link>
              </div>
            )}

            {/* Отзывы */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg font-semibold text-white">
                  Отзывы ({product.reviewCount})
                </h2>
              </div>

              <div className="space-y-4">
                {(showAllReviews ? reviews : reviews.slice(0, 4)).map((review) => (
                  <div key={review.id} className="p-4 rounded-xl glass-light">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mystic-500/20 to-cosmic-600/20 border border-mystic-500/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-mystic-400" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-white">{review.authorName}</span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: review.rating }, (_, i) => (
                              <Star key={i} className="w-3 h-3 text-gold-400 fill-gold-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-mystic-600">
                        {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <p className="text-sm text-mystic-300 leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>

              {reviews.length > 4 && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="mt-4 w-full py-3 rounded-xl border border-mystic-700/30 text-sm text-mystic-300 hover:text-white hover:border-mystic-500/50 transition-all"
                >
                  {showAllReviews ? 'Свернуть' : `Показать все ${reviews.length} отзывов`}
                </button>
              )}
            </div>
          </div>

          {/* Правая колонка — заказ (sticky) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="p-6 rounded-2xl glass border border-mystic-700/20">
              {/* Цена */}
              <div className="mb-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-white">{formatPrice(product.price)}</span>
                  {product.oldPrice && (
                    <span className="text-lg text-mystic-600 line-through">{formatPrice(product.oldPrice)}</span>
                  )}
                  {discount && (
                    <span className="px-2 py-0.5 rounded bg-rose-500/90 text-white text-xs font-bold">−{discount}%</span>
                  )}
                </div>
              </div>

              {/* Инфо-карточки */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-mystic-400 shrink-0" />
                  <span className="text-mystic-300">Время выполнения: {product.generationTimeMin}–{product.generationTimeMax} мин</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MessageCircle className="w-4 h-4 text-mystic-400 shrink-0" />
                  <span className="text-mystic-300">Уточняющих вопросов: {product.maxFollowUps}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-mystic-400 shrink-0" />
                  <span className="text-mystic-300">Конфиденциально и безопасно</span>
                </div>
              </div>

              {/* Кнопки покупки */}
              <CartButtons product={product} />

              <FavoriteButton slug={product.slug} />

              {/* Гарантия */}
              <p className="text-xs text-mystic-600 text-center mt-4 leading-relaxed">
                Безопасная оплата через ЮKassa. Результат гарантирован или возврат средств.
              </p>
            </div>
          </div>
        </div>

        {/* Другие услуги мастера */}
        {psychicProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-xl font-bold text-white mb-6">
              Другие услуги от {psychic?.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {psychicProducts.map((p, i) => (
                <ProductCard key={p.id} product={p as any} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Похожие товары */}
        {similarProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-xl font-bold text-white mb-6">
              Похожие услуги
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {similarProducts.map((p, i) => (
                <ProductCard key={p.id} product={p as any} index={i} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
