// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get('category');
  const theme = searchParams.get('theme');
  const priceSegment = searchParams.get('priceSegment');
  const sort = searchParams.get('sort') || 'popular';
  const psychicId = searchParams.get('psychicId');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const where: any = { isActive: true };
    if (category) where.category = category;
    if (theme) where.theme = theme;
    if (priceSegment) where.priceSegment = priceSegment;
    if (psychicId) where.psychicId = psychicId;

    let orderBy: any = {};
    switch (sort) {
      case 'price_asc': orderBy = { price: 'asc' }; break;
      case 'price_desc': orderBy = { price: 'desc' }; break;
      case 'rating': orderBy = { rating: 'desc' }; break;
      case 'new': orderBy = { createdAt: 'desc' }; break;
      default: orderBy = { orderCount: 'desc' };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        include: {
          psychic: {
            select: {
              id: true, slug: true, name: true, avatarUrl: true,
              rating: true, totalOrders: true, shortBio: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, limit, offset });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
