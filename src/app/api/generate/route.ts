// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateReading } from '@/lib/ai-generation';

// Запуск генерации для оплаченного заказа
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId обязателен' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: {
          include: { psychic: true },
        },
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }

    if (order.status !== 'PAID') {
      return NextResponse.json({ error: 'Заказ ещё не оплачен' }, { status: 400 });
    }

    // Обновляем статус на "в работе"
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PROCESSING' },
    });

    // Добавляем системное сообщение "мастер работает"
    const statusMessages = [
      'Мастер настраивается на вашу энергию...',
      'Раскладываю карты...',
      'Считываю вибрации...',
      'Анализирую числовые паттерны...',
      'Бросаю руны...',
    ];
    const randomMessage = statusMessages[Math.floor(Math.random() * statusMessages.length)];

    await prisma.chatMessage.create({
      data: {
        role: 'SYSTEM',
        content: randomMessage,
        orderId: order.id,
      },
    });

    // Получаем предыдущие заказы этого пользователя у этого мастера
    const previousOrders = await prisma.order.findMany({
      where: {
        userId: order.userId,
        product: { psychicId: order.product.psychicId },
        status: 'COMPLETED',
        id: { not: orderId },
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: { generatedResult: true },
    });

    // Генерируем расклад
    const result = await generateReading({
      systemPrompt: order.product.psychic.systemPrompt,
      productPrompt: order.product.productPrompt,
      clientData: order.clientData as Record<string, any>,
      previousOrders: previousOrders
        .filter((o) => o.generatedResult)
        .map((o) => o.generatedResult!),
    });

    // Сохраняем результат
    await prisma.order.update({
      where: { id: orderId },
      data: {
        generatedResult: result,
        generatedAt: new Date(),
        status: 'DELIVERED',
      },
    });

    // Отправляем в чат от лица мастера
    await prisma.chatMessage.create({
      data: {
        role: 'PSYCHIC',
        content: result,
        orderId: order.id,
      },
    });

    // Обновляем статистику товара и мастера
    await prisma.product.update({
      where: { id: order.productId },
      data: { orderCount: { increment: 1 } },
    });

    await prisma.psychic.update({
      where: { id: order.product.psychicId },
      data: { totalOrders: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      orderId,
      status: 'DELIVERED',
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'Ошибка генерации' }, { status: 500 });
  }
}
