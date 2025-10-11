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

  // Initialize auth only once
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Handle notification fetching based on auth state
  useEffect(() => {
    // Wait for auth to be initialized
    if (!isInitialized) return;

    if (isAuthenticated) {
      // Fetch notifications only once when authenticated
      // NotificationBell component will handle polling
      fetchUnreadCount(false); // Don't skip, force initial fetch
    } else {
      // Reset notifications when logged out
      resetNotifications();
    }
  }, [isAuthenticated, isInitialized, fetchUnreadCount, resetNotifications]);

  return <>{children}</>;
}
