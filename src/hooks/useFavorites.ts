'use client';

import { create } from 'zustand';

interface FavoritesState {
  favorites: string[];
  loaded: boolean;
  addFavorite: (slug: string) => void;
  removeFavorite: (slug: string) => void;
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  loadFromStorage: () => void;
}

function persist(favorites: string[]) {
  try {
    localStorage.setItem('astro_favorites', JSON.stringify(favorites));
  } catch {}
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  loaded: false,

  addFavorite: (slug) => {
    const current = get().favorites;
    const next = current.includes(slug) ? current : [...current, slug];
    set({ favorites: next });
    persist(next);
  },

  removeFavorite: (slug) => {
    const next = get().favorites.filter((s) => s !== slug);
    set({ favorites: next });
    persist(next);
  },

  toggleFavorite: (slug) => {
    if (get().favorites.includes(slug)) {
      get().removeFavorite(slug);
    } else {
      get().addFavorite(slug);
    }
  },

  isFavorite: (slug) => get().favorites.includes(slug),

  loadFromStorage: () => {
    try {
      const raw = localStorage.getItem('astro_favorites');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          set({ favorites: parsed, loaded: true });
          return;
        }
      }
    } catch {}
    set({ loaded: true });
  },
}));
