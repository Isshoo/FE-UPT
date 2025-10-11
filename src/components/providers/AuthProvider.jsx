'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store';
import { useNotificationStore } from '@/store';

export default function AuthProvider({ children }) {
  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);
  const initialize = useAuthStore((state) => state.initialize);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { fetchUnreadCount, reset: resetNotifications } =
    useNotificationStore();

  useEffect(() => {
    const initAuth = async () => {
      await initialize();

      // Fetch notifications if authenticated
      if (isAuthenticated) {
        fetchUnreadCount();
      } else {
        resetNotifications();
      }
    };

    initAuth();
  }, [initialize, isAuthenticated, fetchUnreadCount, resetNotifications]);

  useEffect(() => {
    // Check authentication on mount
    getCurrentUser();
  }, [getCurrentUser]);

  return <>{children}</>;
}
