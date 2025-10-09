'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { ROUTES, ROLES } from '@/lib/constants';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(ROUTES.LOGIN);
        return;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        // Redirect based on role
        if (user?.role === ROLES.ADMIN) {
          router.push(ROUTES.ADMIN_DASHBOARD);
        } else {
          router.push(ROUTES.HOME);
        }
      }
    }
  }, [isAuthenticated, user, isLoading, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fba635]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return null;
  }

  return <>{children}</>;
}