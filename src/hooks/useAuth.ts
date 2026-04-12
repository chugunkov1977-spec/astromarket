'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  loyaltyTier: string;
  referralCode: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'register', email, password, name }),
          });
          const data = await res.json();
          if (!res.ok) {
            set({ error: data.error || 'Ошибка регистрации', isLoading: false });
            return false;
          }
          set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false, error: null });
          return true;
        } catch {
          set({ error: 'Ошибка сети. Попробуйте позже.', isLoading: false });
          return false;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'login', email, password }),
          });
          const data = await res.json();
          if (!res.ok) {
            set({ error: data.error || 'Ошибка входа', isLoading: false });
            return false;
          }
          set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false, error: null });
          return true;
        } catch {
          set({ error: 'Ошибка сети. Попробуйте позже.', isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },
    }),
    {
      name: 'astro_auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
