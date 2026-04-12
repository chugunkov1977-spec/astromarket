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
  createOrder: (items: CartItem[], clientData: Record<string, string>) => Order[];
  completeOrder: (orderId: string, result: string) => void;
  getActiveOrders: () => Order[];
  getCompletedOrders: () => Order[];
  getOrderById: (id: string) => Order | undefined;
}

// ── Psychic slug-to-avatar map (from seed-data known paths) ──

const psychicAvatars: Record<string, string> = {
  cassandra: '/images/psychics/cassandra.png',
  orion: '/images/psychics/orion.png',
  selena: '/images/psychics/selena.png',
  aurora: '/images/psychics/aurora.png',
  magnus: '/images/psychics/magnus.png',
};

const psychicSlugs: Record<string, string> = {
  'Кассандра': 'cassandra',
  'Орион': 'orion',
  'Селена': 'selena',
  'Аврора': 'aurora',
  'Магнус': 'magnus',
};

// ── Template results by category ──

const tarotResults = [
  '🃏 ✨ Расклад на трёх картах\n\n🌙 Первая карта — Верховная Жрица (перевёрнутая)\nЭта карта указывает на скрытые знания, которые вы пока не готовы принять. Интуиция подсказывает вам верный путь, но разум сопротивляется. Доверьтесь внутреннему голосу — он ведёт вас к истине.\n\n⭐ Вторая карта — Колесо Фортуны\nПеремены уже начались. Цикл вашей жизни вступает в новую фазу. То, что казалось застоем, на самом деле было подготовкой к важному повороту. Будьте открыты к неожиданным возможностям.\n\n🔮 Третья карта — Звезда\nНадежда и исцеление. Эта карта обещает светлое будущее после периода испытаний. Ваши мечты реалистичны, и Вселенная поддерживает ваш путь. Продолжайте верить в себя.\n\n✧ Общий совет: Сейчас время довериться потоку жизни. Не пытайтесь контролировать каждый шаг — позвольте событиям развиваться естественно. Ваша интуиция — ваш лучший компас.',
];

const astrologyResults = [
  '⭐ ✨ Астрологический прогноз\n\n🌙 Положение планет\nСолнце в Овне формирует трин с Юпитером в Стрельце, открывая период невероятных возможностей для роста. Марс в вашем знаке даёт энергию и решительность.\n\n💫 Любовь и отношения\nВенера в благоприятном аспекте приносит гармонию в личную жизнь. Одиноким стоит обратить внимание на людей из ближайшего окружения — искра может вспыхнуть неожиданно.\n\n💼 Карьера и финансы\nМеркурий в десятом доме усиливает деловую хватку. Сейчас идеальное время для переговоров, презентаций и новых проектов. Финансовые перспективы благоприятны.\n\n🌿 Здоровье и энергия\nЛуна в Тельце стабилизирует эмоциональный фон. Уделите внимание отдыху и восстановлению — ваше тело нуждается в заботе после интенсивного периода.\n\n✧ Совет звёзд: Используйте эту энергию для смелых шагов. Вселенная благоволит тем, кто действует решительно.',
];

const numerologyResults = [
  '🔢 ✨ Нумерологический анализ\n\n🌙 Число Жизненного Пути — 7\nВы — искатель истины, философ и мыслитель. Ваш путь связан с духовным развитием, глубоким анализом и постижением скрытых законов мироздания. Семёрка наделяет вас интуицией и аналитическим умом.\n\n⭐ Число Судьбы — 3\nТворческая энергия пронизывает вашу жизнь. Вам предназначено вдохновлять других, выражать себя через слова, образы и идеи. Не подавляйте свой творческий потенциал.\n\n💫 Число Души — 9\nГлубоко внутри вы стремитесь к служению миру. Девятка даёт сострадание, мудрость и понимание человеческой природы. Ваша щедрость — ваша сила.\n\n🔮 Персональный год — 5\nГод перемен и свободы! Ожидайте путешествия, новые знакомства и неожиданные повороты. Будьте гибкими и открытыми.\n\n✧ Рекомендация: Ваши числа указывают на период духовного пробуждения. Медитация и самопознание принесут ответы на главные вопросы.',
];

const runesResults = [
  'ᚱ ✨ Рунический расклад\n\n🌙 Первая руна — Ансуз (ᚨ)\nРуна божественного послания и мудрости Одина. Она говорит о важном знании, которое приходит к вам через слова, сны или знаки. Будьте внимательны к сигналам Вселенной — ответ уже рядом.\n\n⚔️ Вторая руна — Тейваз (ᛏ)\nРуна воина и справедливости. Тюр призывает вас к мужеству и честности. Встретьте вызов лицом к лицу — ваша внутренняя сила превосходит любые препятствия. Победа за теми, кто действует с честью.\n\n🌿 Третья руна — Беркана (ᛒ)\nРуна берёзы, роста и новых начинаний. Что-то новое зарождается в вашей жизни — проект, отношения или внутренняя трансформация. Питайте этот росток терпением и заботой.\n\n✧ Послание рун: Древняя мудрость Севера указывает на время действия. Боги благоволят смелым — примите свой путь с открытым сердцем воина.',
];

function getTemplateResult(category: string): string {
  switch (category) {
    case 'TAROT': return tarotResults[0];
    case 'ASTROLOGY': return astrologyResults[0];
    case 'NUMEROLOGY': return numerologyResults[0];
    case 'RUNES': return runesResults[0];
    default: return tarotResults[0];
  }
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      nextNumber: 1001,

      createOrder: (items, clientData) => {
        let num = get().nextNumber;
        const newOrders: Order[] = items.map((item) => {
          const psSlug = psychicSlugs[item.psychicName] || '';
          const order: Order = {
            id: generateId(),
            orderNumber: num++,
            status: 'processing',
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
          return order;
        });

        set((state) => ({
          orders: [...newOrders, ...state.orders],
          nextNumber: num,
        }));

        // Auto-complete after random delay (3-10 seconds)
        newOrders.forEach((order) => {
          const delay = 3000 + Math.random() * 7000;
          setTimeout(() => {
            get().completeOrder(order.id, getTemplateResult(order.category));
          }, delay);
        });

        return newOrders;
      },

      completeOrder: (orderId, result) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? { ...o, status: 'completed' as const, result, completedAt: new Date().toISOString() }
              : o,
          ),
        }));
      },

      getActiveOrders: () => get().orders.filter((o) => o.status === 'processing'),
      getCompletedOrders: () => get().orders.filter((o) => o.status === 'completed'),
      getOrderById: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: 'astro_orders' },
  ),
);
