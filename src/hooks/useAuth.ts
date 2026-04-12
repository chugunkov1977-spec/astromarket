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

interface RegisteredUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const USERS_KEY = 'registered_users';

function hashPassword(pw: string): string {
  return btoa(pw);
}

function checkPassword(pw: string, hash: string): boolean {
  return btoa(pw) === hash;
}

function getRegisteredUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users: RegisteredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function generateReferral(): string {
  return 'REF' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      register: async (email, password, name) => {
        set({ isLoading: true, error: null });

        const users = getRegisteredUsers();
        if (users.some((u) => u.email === email)) {
          set({ error: 'Пользователь с таким email уже существует', isLoading: false });
          return false;
        }

        const id = generateId();
        const newUser: RegisteredUser = {
          id,
          email,
          passwordHash: hashPassword(password),
          name,
        };
        users.push(newUser);
        saveRegisteredUsers(users);

        const user: User = {
          id,
          email,
          name,
          loyaltyTier: 'BASIC',
          referralCode: generateReferral(),
        };

        set({ user, isAuthenticated: true, isLoading: false, error: null });
        return true;
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });

        const users = getRegisteredUsers();
        const found = users.find(
          (u) => u.email === email && checkPassword(password, u.passwordHash),
        );

        if (!found) {
          set({ error: 'Неверный email или пароль', isLoading: false });
          return false;
        }

        const user: User = {
          id: found.id,
          email: found.email,
          name: found.name,
          loyaltyTier: 'BASIC',
          referralCode: generateReferral(),
        };

        set({ user, isAuthenticated: true, isLoading: false, error: null });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },
    }),
    {
      name: 'astro_auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
