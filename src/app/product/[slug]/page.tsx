import { products } from '@/data/seed-data';
import ProductPageClient from './ProductPageClient';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default function ProductPage() {
  return <ProductPageClient />;
}
