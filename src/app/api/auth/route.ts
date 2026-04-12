import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

function generateReferralCode(): string {
  return 'REF' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    if (action === 'register') {
      if (!email || !password || !name) {
        return NextResponse.json({ error: 'Имя, email и пароль обязательны' }, { status: 400 });
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 409 });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name,
          referralCode: generateReferralCode(),
        },
        select: { id: true, email: true, name: true, loyaltyTier: true, referralCode: true },
      });

      const token = signToken({ userId: user.id, email: user.email });

      return NextResponse.json({ user, token });
    }

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });
      }

      const token = signToken({ userId: user.id, email: user.email });

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          loyaltyTier: user.loyaltyTier,
          referralCode: user.referralCode,
        },
        token,
      });
    }

    return NextResponse.json({ error: 'Неизвестное действие' }, { status: 400 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
