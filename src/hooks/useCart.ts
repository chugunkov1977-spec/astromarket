'use client';

import { create } from 'zustand';

export interface CartItem {
  productId: string;
  slug: string;
  title: string;
  price: number;
  oldPrice: number | null;
  imageUrl: string | null;
  psychicName: string;
  category: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  loaded: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getDiscount: () => number;
  getItemCount: () => number;
  loadFromStorage: () => void;
}

const STORAGE_KEY = 'astro_cart';

function persist(items: CartItem[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loaded: false,

  addItem: (item) => {
    const current = get().items;
    if (current.some((i) => i.productId === item.productId)) return;
    const next = [...current, { ...item, quantity: 1 }];
    set({ items: next });
    persist(next);
  },

  removeItem: (productId) => {
    const next = get().items.filter((i) => i.productId !== productId);
    set({ items: next });
    persist(next);
  },

  clearCart: () => {
    set({ items: [] });
    persist([]);
  },

  getTotal: () => get().items.reduce((sum, i) => sum + i.price, 0),

  getDiscount: () =>
    get().items.reduce((sum, i) => (i.oldPrice ? sum + (i.oldPrice - i.price) : sum), 0),

  getItemCount: () => get().items.length,

  loadFromStorage: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          set({ items: parsed, loaded: true });
          return;
        }
      }
    } catch {}
    set({ loaded: true });
  },
}));
