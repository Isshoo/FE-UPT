'use client';

import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store';
import { useNotificationStore } from '@/store';

export default function AuthProvider({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const initialize = useAuthStore((state) => state.initialize);

  const { fetchUnreadCount, reset: resetNotifications } =
    useNotificationStore();

  // Memoize initialize to prevent unnecessary re-renders
  const handleInitialize = useCallback(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  // Effect 1: Initialize auth (hanya sekali)
  useEffect(() => {
    handleInitialize();
  }, [handleInitialize]);

  // Effect 2: Handle notifications berdasarkan auth status
  useEffect(() => {
    if (!isInitialized) return; // Tunggu sampai init selesai

    if (isAuthenticated) {
      // Fetch pertama kali
      fetchUnreadCount();

      // Setup polling setiap 2 menit
      const interval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          fetchUnreadCount();
        }
      }, 120000);

      return () => clearInterval(interval);
    } else {
      // Reset notifications jika tidak authenticated
      resetNotifications();
    }
  }, [isInitialized, isAuthenticated, fetchUnreadCount, resetNotifications]);

  return <>{children}</>;
}
