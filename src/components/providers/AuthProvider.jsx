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

  useEffect(() => {
    if (isInitialized) {
      return;
    }
    const initAuth = async () => {
      await initialize();

      // Fetch notifications only once after successful auth
      if (isInitialized && isAuthenticated) {
        fetchUnreadCount();
      } else if (isInitialized && !isAuthenticated) {
        resetNotifications();
      }
    };

    initAuth();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialize, isInitialized, isAuthenticated]);

  return <>{children}</>;
}
