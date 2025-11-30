'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { ROUTES } from '@/lib/constants/routes';
import { ROLES } from '@/lib/constants/labels';

export default function GuestRoute({ children }) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized || isLoading) return; // tunggu sampai siap

    if (isAuthenticated) {
      if (user?.role === ROLES.ADMIN) {
        router.replace(ROUTES.ADMIN_DASHBOARD);
      } else {
        router.replace(ROUTES.HOME);
      }
    }
  }, [isAuthenticated, user, isInitialized, isLoading, router]);

  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#fba635]"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
