'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[];
  loaded: boolean;
  addFavorite: (slug: string, token?: string | null) => void;
  removeFavorite: (slug: string, token?: string | null) => void;
  toggleFavorite: (slug: string, token?: string | null) => void;
  isFavorite: (slug: string) => boolean;
  syncFavorites: (token: string) => Promise<void>;
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

function apiFav(slug: string, action: 'add' | 'remove', token: string) {
  fetch('/api/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ productSlug: slug, action }),
  }).catch((e) => console.error('apiFav error:', e));
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      loaded: false,

      addFavorite: (slug, token) => {
        const current = get().favorites;
        if (current.includes(slug)) return;
        set({ favorites: [...current, slug] });
        const t = token || getAuthToken();
        if (t) apiFav(slug, 'add', t);
      },

      removeFavorite: (slug, token) => {
        set({ favorites: get().favorites.filter((s) => s !== slug) });
        const t = token || getAuthToken();
        if (t) apiFav(slug, 'remove', t);
      },

      toggleFavorite: (slug, token) => {
        if (get().favorites.includes(slug)) {
          get().removeFavorite(slug, token);
        } else {
          get().addFavorite(slug, token);
        }
      },

      isFavorite: (slug) => get().favorites.includes(slug),

      syncFavorites: async (token) => {
        try {
          const res = await fetch('/api/favorites', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) { set({ loaded: true }); return; }
          const data = await res.json();
          if (data.favorites && Array.isArray(data.favorites)) {
            // Server is source of truth — replace local state entirely
            set({ favorites: data.favorites, loaded: true });
          } else {
            set({ loaded: true });
          }
        } catch (e) {
          console.error('syncFavorites error:', e);
          set({ loaded: true });
        }
      },
    }),
    {
      name: 'astro_favorites',
      partialize: (state) => ({ favorites: state.favorites }),
      onRehydrateStorage: () => (state) => {
        if (state) state.loaded = true;
      },
    },
  ),
);
