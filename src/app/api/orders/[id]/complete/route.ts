import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST — complete an order with generated result
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const { result } = body;

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: 'COMPLETED',
        generatedResult: result,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Order complete error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 });
  }
}
