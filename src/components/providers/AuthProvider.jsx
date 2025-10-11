'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store';
import { useNotificationStore } from '@/store';

export default function AuthProvider({ children }) {
  const initialize = useAuthStore((state) => state.initialize);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  const { fetchUnreadCount, reset: resetNotifications } =
    useNotificationStore();

  // Effect 1: Initialize auth (hanya sekali)
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

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
