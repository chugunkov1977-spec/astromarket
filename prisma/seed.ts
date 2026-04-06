import { PrismaClient } from '@prisma/client';
import { psychics, products, reviewTexts } from '../src/data/seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌙 Начинаем заполнение базы данных AstroMarket...\n');

  // Очистка
  console.log('🗑️  Очистка существующих данных...');
  await prisma.chatMessage.deleteMany();
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.psychic.deleteMany();
  await prisma.promoCode.deleteMany();

  // Создаём персонажей
  console.log('✧ Создаём AI-персонажей...');
  const createdPsychics: Record<string, string> = {};

  for (const p of psychics) {
    const psychic = await prisma.psychic.create({
      data: {
        slug: p.slug,
        name: p.name,
        avatarUrl: p.avatarUrl,
        coverImageUrl: p.coverImageUrl,
        bio: p.bio,
        shortBio: p.shortBio,
        legend: p.legend,
        specialization: p.specialization,
        style: p.style,
        systemPrompt: p.systemPrompt,
        rating: p.rating,
        totalOrders: p.totalOrders,
      },
    });
    createdPsychics[p.slug] = psychic.id;
    console.log(`  ✓ ${psychic.name} (${psychic.slug})`);
  }

  // Создаём товары
  console.log('\n🃏 Создаём товары...');
  const createdProducts: Array<{ id: string; category: string; slug: string }> = [];

  for (const p of products) {
    const psychicId = createdPsychics[p.psychicSlug];
    if (!psychicId) {
      console.log(`  ✗ Персонаж не найден: ${p.psychicSlug}`);
      continue;
    }

    const product = await prisma.product.create({
      data: {
        slug: p.slug,
        title: p.title,
        shortDescription: p.shortDescription,
        description: p.description,
        imageUrl: p.imageUrl,
        galleryUrls: p.galleryUrls,
        category: p.category,
        theme: p.theme,
        priceSegment: p.priceSegment,
        price: p.price,
        oldPrice: p.oldPrice,
        productPrompt: p.productPrompt,
        inputFields: JSON.parse(JSON.stringify(p.inputFields)),
        deliveryFormat: p.deliveryFormat,
        generationTimeMin: p.generationTimeMin,
        generationTimeMax: p.generationTimeMax,
        maxFollowUps: p.maxFollowUps,
        rating: p.rating,
        reviewCount: p.reviewCount,
        orderCount: p.orderCount,
        badges: p.badges,
        psychicId,
      },
    });
    createdProducts.push({ id: product.id, category: product.category, slug: product.slug });
    console.log(`  ✓ ${product.title} (${product.slug})`);
  }

  // Сидинг отзывов
  console.log('\n⭐ Генерируем отзывы...');
  const names = [
    'Анна М.', 'Мария К.', 'Елена В.', 'Наталья С.', 'Ольга Д.',
    'Ирина П.', 'Светлана Л.', 'Дарья Т.', 'Алексей Р.', 'Дмитрий Н.',
    'Юлия А.', 'Виктория Б.', 'Полина Г.', 'Кристина Е.', 'Екатерина Ж.',
    'Анастасия И.', 'Маргарита О.', 'Татьяна У.', 'Ксения Ф.', 'Валерия Х.',
  ];

  let totalReviews = 0;
  for (const product of createdProducts) {
    const categoryKey = product.category.toLowerCase();
    const texts = reviewTexts[categoryKey] || reviewTexts.tarot;
    const reviewCount = Math.min(15, texts.length + 5);

    for (let i = 0; i < reviewCount; i++) {
      const rating = i < reviewCount * 0.6 ? 5 : i < reviewCount * 0.85 ? 4 : 3;
      const text = texts[i % texts.length];
      const daysAgo = Math.floor(Math.random() * 90) + 1;

      await prisma.review.create({
        data: {
          rating,
          text,
          status: 'APPROVED',
          isSeeded: true,
          authorName: names[i % names.length],
          productId: product.id,
          createdAt: new Date(Date.now() - daysAgo * 86400000),
        },
      });
      totalReviews++;
    }
  }
  console.log(`  ✓ Создано ${totalReviews} отзывов`);

  // Промокоды
  console.log('\n🎟️  Создаём промокоды...');
  await prisma.promoCode.createMany({
    data: [
      { code: 'WELCOME20', discountPercent: 20, maxUses: 1000, isActive: true },
      { code: 'STAR10', discountPercent: 10, isActive: true },
      { code: 'FIRST500', discountAmount: 50000, minOrderAmount: 50000, maxUses: 500, isActive: true },
    ],
  });
  console.log('  ✓ 3 промокода созданы');

  console.log('\n✨ Готово! База данных заполнена.');
  console.log(`   Персонажей: ${psychics.length}`);
  console.log(`   Товаров: ${createdProducts.length}`);
  console.log(`   Отзывов: ${totalReviews}`);
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
