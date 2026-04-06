// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Создание нового заказа
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, clientData, userId } = body;

    if (!productId || !clientData) {
      return NextResponse.json(
        { error: 'productId и clientData обязательны' },
        { status: 400 }
      );
    }

    // Получаем товар
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { psychic: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Товар не найден' }, { status: 404 });
    }

    // Рассчитываем задержку доставки
    const delayMinutes = Math.floor(
      Math.random() * (product.generationTimeMax - product.generationTimeMin) + product.generationTimeMin
    );
    const scheduledDelivery = new Date(Date.now() + delayMinutes * 60 * 1000);

    // Создаём заказ
    const order = await prisma.order.create({
      data: {
        amount: product.price,
        status: 'PENDING_PAYMENT',
        paymentStatus: 'PENDING',
        clientData,
        scheduledDelivery,
        productId: product.id,
        userId: userId || 'anonymous', // TODO: настоящая авторизация
      },
      include: {
        product: {
          include: { psychic: true },
        },
      },
    });

    // Создаём системное сообщение в чате
    await prisma.chatMessage.create({
      data: {
        role: 'SYSTEM',
        content: `Заказ #${order.orderNumber} создан. Ожидание оплаты...`,
        orderId: order.id,
      },
    });

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        amount: order.amount,
        status: order.status,
      },
      // TODO: URL для оплаты через ЮKassa
      paymentUrl: null,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Получение заказов пользователя
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId обязателен' }, { status: 400 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          include: {
            psychic: {
              select: { id: true, name: true, avatarUrl: true },
            },
          },
        },
        chatMessages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
