'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { ROUTES, ROLES } from '@/lib/constants';

export default function GuestRoute({ children }) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirect based on role
      if (user?.role === ROLES.ADMIN) {
        router.push(ROUTES.ADMIN_DASHBOARD);
      } else {
        router.push(ROUTES.HOME);
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fba635]"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}