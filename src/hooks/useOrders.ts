'use client';

import { create } from 'zustand';
import type { CartItem } from './useCart';

export interface Order {
  id: string;
  orderNumber: number;
  status: 'processing' | 'completed';
  productSlug: string;
  productTitle: string;
  productImageUrl: string | null;
  psychicName: string;
  psychicSlug: string;
  psychicAvatarUrl: string | null;
  price: number;
  oldPrice: number | null;
  category: string;
  clientData: Record<string, string>;
  result: string | null;
  createdAt: string;
  completedAt: string | null;
}

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  syncOrders: () => Promise<void>;
  createOrder: (items: CartItem[], clientData: Record<string, string>) => Promise<void>;
  getActiveOrders: () => Order[];
  getCompletedOrders: () => Order[];
}

// ── Psychic avatars ──

const psychicAvatars: Record<string, string> = {
  cassandra: '/images/psychics/cassandra.png',
  orion: '/images/psychics/orion.png',
  selena: '/images/psychics/selena.png',
  aurora: '/images/psychics/aurora.png',
  magnus: '/images/psychics/magnus.png',
};

const psychicSlugs: Record<string, string> = {
  'Кассандра': 'cassandra', 'Орион': 'orion', 'Селена': 'selena',
  'Аврора': 'aurora', 'Магнус': 'magnus',
};

// ── Template results ──

const resultTemplates: Record<string, string> = {
  TAROT: '🃏 ✨ Расклад на трёх картах\n\n🌙 Первая карта — Верховная Жрица (перевёрнутая)\nЭта карта указывает на скрытые знания, которые вы пока не готовы принять. Интуиция подсказывает вам верный путь, но разум сопротивляется. Доверьтесь внутреннему голосу — он ведёт вас к истине.\n\n⭐ Вторая карта — Колесо Фортуны\nПеремены уже начались. Цикл вашей жизни вступает в новую фазу. То, что казалось застоем, на самом деле было подготовкой к важному повороту.\n\n🔮 Третья карта — Звезда\nНадежда и исцеление. Эта карта обещает светлое будущее после периода испытаний. Ваши мечты реалистичны.\n\n✧ Общий совет: Доверьтесь потоку жизни. Ваша интуиция — ваш лучший компас.',
  ASTROLOGY: '⭐ ✨ Астрологический прогноз\n\n🌙 Положение планет\nСолнце в Овне формирует трин с Юпитером, открывая период возможностей. Марс даёт энергию и решительность.\n\n💫 Любовь\nВенера в благоприятном аспекте приносит гармонию. Одиноким стоит обратить внимание на ближайшее окружение.\n\n💼 Карьера\nМеркурий усиливает деловую хватку. Идеальное время для переговоров.\n\n🌿 Здоровье\nЛуна стабилизирует эмоциональный фон. Уделите внимание отдыху.\n\n✧ Совет звёзд: Используйте эту энергию для смелых шагов.',
  NUMEROLOGY: '🔢 ✨ Нумерологический анализ\n\n🌙 Число Жизненного Пути — 7\nВы — искатель истины. Ваш путь связан с духовным развитием и постижением скрытых законов мироздания.\n\n⭐ Число Судьбы — 3\nТворческая энергия пронизывает вашу жизнь. Вам предназначено вдохновлять других.\n\n💫 Число Души — 9\nВы стремитесь к служению миру. Девятка даёт сострадание и мудрость.\n\n✧ Рекомендация: Ваши числа указывают на период духовного пробуждения.',
  RUNES: 'ᚱ ✨ Рунический расклад\n\n🌙 Ансуз (ᚨ) — Руна мудрости Одина\nВажное знание приходит через сны и знаки. Будьте внимательны к сигналам Вселенной.\n\n⚔️ Тейваз (ᛏ) — Руна воина\nТюр призывает к мужеству. Встретьте вызов лицом к лицу.\n\n🌿 Беркана (ᛒ) — Руна роста\nЧто-то новое зарождается. Питайте этот росток терпением.\n\n✧ Послание рун: Боги благоволят смелым — примите свой путь с открытым сердцем воина.',
};

// ── Helpers ──

function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem('astro_auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token || null;
  } catch { return null; }
}

function mapDbOrder(o: any): Order {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status === 'COMPLETED' ? 'completed' : 'processing',
    productSlug: o.productSlug,
    productTitle: o.productTitle,
    productImageUrl: o.productImageUrl || null,
    psychicName: o.psychicName,
    psychicSlug: o.psychicSlug,
    psychicAvatarUrl: o.psychicAvatarUrl || psychicAvatars[o.psychicSlug] || null,
    price: o.amount,
    oldPrice: o.oldPrice || null,
    category: o.category,
    clientData: o.clientData || {},
    result: o.generatedResult || null,
    createdAt: o.createdAt,
    completedAt: o.completedAt || null,
  };
}

// ── Store ──

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  isLoading: false,

  syncOrders: async () => {
    const token = getAuthToken();
    if (!token) return;
    set({ isLoading: true });
    try {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { set({ isLoading: false }); return; }
      const data = await res.json();
      if (data.orders && Array.isArray(data.orders)) {
        set({ orders: data.orders.map(mapDbOrder), isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      console.error('syncOrders error:', e);
      set({ isLoading: false });
    }
  },

  createOrder: async (items, clientData) => {
    const token = getAuthToken();
    if (!token) {
      console.error('createOrder: no auth token');
      return;
    }

    // Build items with psychic data
    const orderItems = items.map((item) => {
      const psSlug = psychicSlugs[item.psychicName] || '';
      return {
        slug: item.slug,
        title: item.title,
        imageUrl: item.imageUrl,
        psychicName: item.psychicName,
        psychicSlug: psSlug,
        psychicAvatarUrl: psychicAvatars[psSlug] || null,
        price: item.price,
        oldPrice: item.oldPrice,
        category: item.category,
      };
    });

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items: orderItems, clientData }),
      });

      if (!res.ok) {
        console.error('createOrder API error:', await res.text());
        return;
      }

      const data = await res.json();
      if (data.orders && Array.isArray(data.orders)) {
        const newOrders = data.orders.map(mapDbOrder);
        set((state) => ({ orders: [...newOrders, ...state.orders] }));

        // Auto-complete each order after random delay
        newOrders.forEach((order: Order) => {
          const delay = 5000 + Math.random() * 5000;
          setTimeout(async () => {
            const result = resultTemplates[order.category] || resultTemplates.TAROT;
            try {
              await fetch(`/api/orders/${order.id}/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ result }),
              });
              // Update local state
              set((state) => ({
                orders: state.orders.map((o) =>
                  o.id === order.id
                    ? { ...o, status: 'completed' as const, result, completedAt: new Date().toISOString() }
                    : o,
                ),
              }));
            } catch (e) {
              console.error('completeOrder error:', e);
            }
          }, delay);
        });
      }
    } catch (e) {
      console.error('createOrder error:', e);
    }
  },

  getActiveOrders: () => get().orders.filter((o) => o.status === 'processing'),
  getCompletedOrders: () => get().orders.filter((o) => o.status === 'completed'),
}));
