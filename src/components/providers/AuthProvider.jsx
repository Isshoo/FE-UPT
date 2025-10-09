'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store';

export default function AuthProvider({ children }) {
  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);

  useEffect(() => {
    // Check authentication on mount
    getCurrentUser();
  }, [getCurrentUser]);

  return <>{children}</>;
}
