import { products, psychics } from '@/data/seed-data';

export interface ProductInfo {
  slug: string;
  title: string;
  shortDescription: string;
  imageUrl: string;
  category: string;
  price: number;
  oldPrice: number | null;
  rating: number;
  reviewCount: number;
  orderCount: number;
  badges: string[];
  generationTimeMin: number;
  generationTimeMax: number;
  psychicName: string;
  psychicSlug: string;
}

const productMap = new Map<string, ProductInfo>();

products.forEach((p) => {
  const ps = psychics.find((x) => x.slug === p.psychicSlug);
  productMap.set(p.slug, {
    slug: p.slug,
    title: p.title,
    shortDescription: p.shortDescription,
    imageUrl: p.imageUrl,
    category: p.category,
    price: p.price,
    oldPrice: p.oldPrice,
    rating: p.rating,
    reviewCount: p.reviewCount,
    orderCount: p.orderCount,
    badges: p.badges,
    generationTimeMin: p.generationTimeMin,
    generationTimeMax: p.generationTimeMax,
    psychicName: ps?.name || '',
    psychicSlug: p.psychicSlug,
  });
});

export function getProductBySlug(slug: string): ProductInfo | undefined {
  return productMap.get(slug);
}

export function getProductsBySlugs(slugs: string[]): ProductInfo[] {
  return slugs.map((s) => productMap.get(s)).filter(Boolean) as ProductInfo[];
}
