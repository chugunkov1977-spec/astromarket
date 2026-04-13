'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  addItem: (item: Omit<CartItem, 'quantity'>, token?: string | null) => void;
  removeItem: (productId: string, token?: string | null) => void;
  clearCart: (token?: string | null) => void;
  getTotal: () => number;
  getDiscount: () => number;
  getItemCount: () => number;
  syncCart: (token: string) => Promise<void>;
}

function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem('astro_auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token || null;
  } catch {
    return null;
  }
}

function cartApiPost(body: Record<string, unknown>, token: string) {
  fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  }).catch((e) => console.error('cartApiPost error:', e));
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      loaded: false,

      addItem: (item, token) => {
        const current = get().items;
        if (current.some((i) => i.productId === item.productId)) return;
        set({ items: [...current, { ...item, quantity: 1 }], loaded: true });
        const t = token || getAuthToken();
        if (t) cartApiPost({ action: 'add', productSlug: item.slug }, t);
      },

      removeItem: (productId, token) => {
        const item = get().items.find((i) => i.productId === productId);
        const next = get().items.filter((i) => i.productId !== productId);
        set({ items: next });
        const t = token || getAuthToken();
        if (t && item) cartApiPost({ action: 'remove', productSlug: item.slug }, t);
      },

      clearCart: (token) => {
        set({ items: [] });
        const t = token || getAuthToken();
        if (t) cartApiPost({ action: 'clear' }, t);
      },

      getTotal: () => get().items.reduce((sum, i) => sum + i.price, 0),
      getDiscount: () => get().items.reduce((sum, i) => (i.oldPrice ? sum + (i.oldPrice - i.price) : sum), 0),
      getItemCount: () => get().items.length,

      syncCart: async (token) => {
        try {
          const res = await fetch('/api/cart', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) { set({ loaded: true }); return; }
          const data = await res.json();
          if (data.items && Array.isArray(data.items)) {
            const serverItems: CartItem[] = data.items.map((p: any) => ({
              productId: p.slug,
              slug: p.slug,
              title: p.title,
              price: p.price,
              oldPrice: p.oldPrice || null,
              imageUrl: p.imageUrl || null,
              psychicName: p.psychicName || '',
              category: p.category,
              quantity: 1,
            }));
            // Server is source of truth — replace local state entirely
            set({ items: serverItems, loaded: true });
          } else {
            set({ loaded: true });
          }
        } catch (e) {
          console.error('syncCart error:', e);
          set({ loaded: true });
        }
      },
    }),
    {
      name: 'astro_cart',
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) state.loaded = true;
      },
    },
  ),
);
