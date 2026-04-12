'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  nextNumber: number;
  createOrder: (items: CartItem[], clientData: Record<string, string>, token?: string | null) => Promise<Order[]>;
  completeOrder: (orderId: string, result: string, token?: string | null) => void;
  fetchOrders: (token: string) => Promise<void>;
  getActiveOrders: () => Order[];
  getCompletedOrders: () => Order[];
  getOrderById: (id: string) => Order | undefined;
}

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

// Template results
const resultTemplates: Record<string, string> = {
  TAROT: '🃏 ✨ Расклад на трёх картах\n\n🌙 Первая карта — Верховная Жрица (перевёрнутая)\nЭта карта указывает на скрытые знания, которые вы пока не готовы принять. Интуиция подсказывает вам верный путь, но разум сопротивляется. Доверьтесь внутреннему голосу — он ведёт вас к истине.\n\n⭐ Вторая карта — Колесо Фортуны\nПеремены уже начались. Цикл вашей жизни вступает в новую фазу. То, что казалось застоем, на самом деле было подготовкой к важному повороту. Будьте открыты к неожиданным возможностям.\n\n🔮 Третья карта — Звезда\nНадежда и исцеление. Эта карта обещает светлое будущее после периода испытаний. Ваши мечты реалистичны, и Вселенная поддерживает ваш путь.\n\n✧ Общий совет: Доверьтесь потоку жизни. Ваша интуиция — ваш лучший компас.',
  ASTROLOGY: '⭐ ✨ Астрологический прогноз\n\n🌙 Положение планет\nСолнце в Овне формирует трин с Юпитером, открывая период возможностей. Марс даёт энергию и решительность.\n\n💫 Любовь\nВенера в благоприятном аспекте приносит гармонию. Одиноким стоит обратить внимание на ближайшее окружение.\n\n💼 Карьера\nМеркурий усиливает деловую хватку. Идеальное время для переговоров.\n\n🌿 Здоровье\nЛуна стабилизирует эмоциональный фон. Уделите внимание отдыху.\n\n✧ Совет звёзд: Используйте эту энергию для смелых шагов.',
  NUMEROLOGY: '🔢 ✨ Нумерологический анализ\n\n🌙 Число Жизненного Пути — 7\nВы — искатель истины. Ваш путь связан с духовным развитием и постижением скрытых законов мироздания.\n\n⭐ Число Судьбы — 3\nТворческая энергия пронизывает вашу жизнь. Вам предназначено вдохновлять других.\n\n💫 Число Души — 9\nГлубоко внутри вы стремитесь к служению миру. Девятка даёт сострадание и мудрость.\n\n✧ Рекомендация: Ваши числа указывают на период духовного пробуждения.',
  RUNES: 'ᚱ ✨ Рунический расклад\n\n🌙 Ансуз (ᚨ) — Руна мудрости Одина\nВажное знание приходит через сны и знаки. Будьте внимательны к сигналам Вселенной.\n\n⚔️ Тейваз (ᛏ) — Руна воина\nТюр призывает к мужеству. Встретьте вызов лицом к лицу — ваша сила превосходит препятствия.\n\n🌿 Беркана (ᛒ) — Руна роста\nЧто-то новое зарождается. Питайте этот росток терпением и заботой.\n\n✧ Послание рун: Боги благоволят смелым — примите свой путь с открытым сердцем воина.',
};

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      nextNumber: 1001,

      createOrder: async (items, clientData, token) => {
        let num = get().nextNumber;
        const newOrders: Order[] = items.map((item) => {
          const psSlug = psychicSlugs[item.psychicName] || '';
          return {
            id: generateId(),
            orderNumber: num++,
            status: 'processing' as const,
            productSlug: item.slug,
            productTitle: item.title,
            productImageUrl: item.imageUrl,
            psychicName: item.psychicName,
            psychicSlug: psSlug,
            psychicAvatarUrl: psychicAvatars[psSlug] || null,
            price: item.price,
            oldPrice: item.oldPrice,
            category: item.category,
            clientData,
            result: null,
            createdAt: new Date().toISOString(),
            completedAt: null,
          };
        });

        set((state) => ({
          orders: [...newOrders, ...state.orders],
          nextNumber: num,
        }));

        // Try to save to API if token available
        if (token) {
          try {
            const res = await fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ items, clientData }),
            });
            if (res.ok) {
              const data = await res.json();
              // Update local orders with server IDs
              if (data.orders && Array.isArray(data.orders)) {
                set((state) => ({
                  orders: state.orders.map((o, idx) => {
                    const serverOrder = data.orders[idx];
                    if (serverOrder && o.status === 'processing' && o.productSlug === (serverOrder.productSlug)) {
                      return { ...o, id: serverOrder.id, orderNumber: serverOrder.orderNumber };
                    }
                    return o;
                  }),
                }));
              }
            }
          } catch { /* fallback to local */ }
        }

        // Auto-complete after delay
        newOrders.forEach((order) => {
          const delay = 3000 + Math.random() * 7000;
          setTimeout(() => {
            const result = resultTemplates[order.category] || resultTemplates.TAROT;
            get().completeOrder(order.id, result, token);
          }, delay);
        });

        return newOrders;
      },

      completeOrder: async (orderId, result, token) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? { ...o, status: 'completed' as const, result, completedAt: new Date().toISOString() }
              : o,
          ),
        }));

        // Try to update on server
        if (token) {
          try {
            await fetch(`/api/orders/${orderId}/complete`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ result }),
            });
          } catch { /* ignore */ }
        }
      },

      fetchOrders: async (token) => {
        try {
          const res = await fetch('/api/orders', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) return;
          const data = await res.json();
          if (data.orders && Array.isArray(data.orders)) {
            const mapped: Order[] = data.orders.map((o: any) => ({
              id: o.id,
              orderNumber: o.orderNumber,
              status: o.status === 'COMPLETED' ? 'completed' : 'processing',
              productSlug: o.productSlug,
              productTitle: o.productTitle,
              productImageUrl: o.productImageUrl,
              psychicName: o.psychicName,
              psychicSlug: o.psychicSlug,
              psychicAvatarUrl: psychicAvatars[o.psychicSlug] || null,
              price: o.amount,
              oldPrice: null,
              category: o.category,
              clientData: o.clientData || {},
              result: o.generatedResult,
              createdAt: o.createdAt,
              completedAt: o.completedAt,
            }));
            // Merge: keep local orders not yet on server
            const serverIds = new Set(mapped.map((o: Order) => o.id));
            const localOnly = get().orders.filter((o) => !serverIds.has(o.id));
            set({ orders: [...mapped, ...localOnly] });
          }
        } catch { /* use local data */ }
      },

      getActiveOrders: () => get().orders.filter((o) => o.status === 'processing'),
      getCompletedOrders: () => get().orders.filter((o) => o.status === 'completed'),
      getOrderById: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: 'astro_orders' },
  ),
);
