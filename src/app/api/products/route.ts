import { NextRequest, NextResponse } from 'next/server';
import { products, psychics } from '@/data/seed-data';

// GET — products from seed data (no DB needed)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const slug = searchParams.get('slug');

  let result = products.map((p) => {
    const psychic = psychics.find((ps) => ps.slug === p.psychicSlug);
    return { ...p, psychicName: psychic?.name || '' };
  });

  if (category) result = result.filter((p) => p.category === category);
  if (slug) result = result.filter((p) => p.slug === slug);

  return NextResponse.json({ products: result });
}
