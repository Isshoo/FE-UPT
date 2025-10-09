'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store';

export default function AuthProvider({ children }) {
  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Check authentication on mount
    getCurrentUser();
  }, [getCurrentUser]);

  return <>{children}</>;
}
