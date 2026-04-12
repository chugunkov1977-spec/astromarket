import { products } from '@/data/seed-data';
import ProductPageClient from './ProductPageClient';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);
  return {
    title: product ? `${product.title} | AstroMarket` : 'Товар | AstroMarket',
    description: product?.shortDescription || '',
    openGraph: { title: product?.title, description: product?.shortDescription },
  };
}

export default function ProductPage() {
  return <ProductPageClient />;
}
