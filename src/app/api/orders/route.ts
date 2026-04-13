import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';

// GET — fetch all orders for authenticated user
export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 });
  }
}

// POST — create new orders from cart items
export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { items, clientData } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Нет товаров для заказа' }, { status: 400 });
    }

    const createdOrders = [];
    for (const item of items) {
      const order = await prisma.order.create({
        data: {
          userId,
          productSlug: item.slug || item.productSlug || '',
          productTitle: item.title || item.productTitle || '',
          productImageUrl: item.imageUrl || item.productImageUrl || null,
          psychicName: item.psychicName || '',
          psychicSlug: item.psychicSlug || '',
          psychicAvatarUrl: item.psychicAvatarUrl || null,
          category: item.category || '',
          amount: item.price || 0,
          oldPrice: item.oldPrice || null,
          clientData: clientData || {},
          status: 'PROCESSING',
        },
      });
      createdOrders.push(order);
    }

    return NextResponse.json({ orders: createdOrders });
  } catch (error) {
    console.error('Orders POST error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 });
  }
}
