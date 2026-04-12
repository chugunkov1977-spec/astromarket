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
  loadFromStorage: () => void;
  syncWithServer: (token: string) => Promise<void>;
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
        // Sync to API
        if (token) {
          fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ productSlug: slug }),
          }).catch(() => {});
        }
      },

      removeFavorite: (slug, token) => {
        set({ favorites: get().favorites.filter((s) => s !== slug) });
        if (token) {
          fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ productSlug: slug }),
          }).catch(() => {});
        }
      },

      toggleFavorite: (slug, token) => {
        if (get().favorites.includes(slug)) {
          get().removeFavorite(slug, token);
        } else {
          get().addFavorite(slug, token);
        }
      },

      isFavorite: (slug) => get().favorites.includes(slug),

      loadFromStorage: () => {
        set({ loaded: true });
      },

      syncWithServer: async (token) => {
        try {
          const res = await fetch('/api/favorites', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) return;
          const data = await res.json();
          if (data.favorites && Array.isArray(data.favorites)) {
            // Merge server + local
            const merged = Array.from(new Set([...data.favorites, ...get().favorites]));
            set({ favorites: merged });
          }
        } catch { /* use local */ }
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
