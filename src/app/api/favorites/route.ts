import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';

// GET — get user's favorites
export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      select: { productSlug: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ favorites: favorites.map((f) => f.productSlug) });
  } catch (error) {
    console.error('Favorites GET error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 });
  }
}

// POST — add, remove, or toggle favorite
// body: { productSlug, action?: 'add' | 'remove' | 'toggle' }
export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { productSlug, action = 'toggle' } = body;
    if (!productSlug) {
      return NextResponse.json({ error: 'productSlug обязателен' }, { status: 400 });
    }

    const existing = await prisma.favorite.findUnique({
      where: { userId_productSlug: { userId, productSlug } },
    });

    if (action === 'add') {
      if (!existing) {
        await prisma.favorite.create({ data: { userId, productSlug } });
      }
      return NextResponse.json({ action: 'added', productSlug });
    }

    if (action === 'remove') {
      if (existing) {
        await prisma.favorite.delete({ where: { id: existing.id } });
      }
      return NextResponse.json({ action: 'removed', productSlug });
    }

    // toggle (default)
    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ action: 'removed', productSlug });
    } else {
      await prisma.favorite.create({ data: { userId, productSlug } });
      return NextResponse.json({ action: 'added', productSlug });
    }
  } catch (error) {
    console.error('Favorites POST error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 });
  }
}
