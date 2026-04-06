import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    if (action === 'register') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 409 });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: { email, passwordHash, name: name || null },
        select: { id: true, email: true, name: true },
      });

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

      return NextResponse.json({ user, token });
    }

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.passwordHash) {
        return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      });
    }

    return NextResponse.json({ error: 'Неизвестное действие' }, { status: 400 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
