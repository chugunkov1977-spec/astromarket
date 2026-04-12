'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/hooks/useAuth';
import { useCartStore } from '@/hooks/useCart';
import { useFavoritesStore } from '@/hooks/useFavorites';

/**
 * Syncs cart and favorites from server when user is authenticated.
 * Runs once on mount and again whenever the auth token changes.
 */
export default function SyncProvider({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const syncCart = useCartStore((s) => s.syncCart);
  const syncFavorites = useFavoritesStore((s) => s.syncFavorites);
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    // Don't re-sync if we already synced with this token
    if (syncedRef.current === token) return;
    syncedRef.current = token;

    syncCart(token).catch(() => {});
    syncFavorites(token).catch(() => {});
  }, [isAuthenticated, token, syncCart, syncFavorites]);

  return <>{children}</>;
}
