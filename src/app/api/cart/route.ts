import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';
import { getProductsBySlugs } from '@/lib/product-data';

// GET — return cart items with full product data
export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const slugs = cartItems.map((c) => c.productSlug);
    const products = getProductsBySlugs(slugs);

    return NextResponse.json({ items: products });
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 });
  }
}

// POST — add item to cart
export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
  }

  try {
    const { productSlug } = await request.json();
    if (!productSlug) {
      return NextResponse.json({ error: 'productSlug обязателен' }, { status: 400 });
    }

    await prisma.cartItem.upsert({
      where: { userId_productSlug: { userId, productSlug } },
      create: { userId, productSlug },
      update: {},
    });

    return NextResponse.json({ ok: true, productSlug });
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 });
  }
}

// DELETE — remove item or clear cart
export async function DELETE(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (body.clearAll) {
      await prisma.cartItem.deleteMany({ where: { userId } });
      return NextResponse.json({ ok: true, cleared: true });
    }

    const { productSlug } = body;
    if (!productSlug) {
      return NextResponse.json({ error: 'productSlug обязателен' }, { status: 400 });
    }

    await prisma.cartItem.deleteMany({
      where: { userId, productSlug },
    });

    return NextResponse.json({ ok: true, removed: productSlug });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 });
  }
}
