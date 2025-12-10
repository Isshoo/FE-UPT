'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { ROUTES } from '@/lib/constants/routes';
import { ROLES } from '@/lib/constants/labels';

export default function GuestRoute({ children }) {
  const router = useRouter();
  // Use specific selectors to prevent unnecessary re-renders
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isInitialized || isLoading) return; // tunggu sampai siap

    if (isAuthenticated) {
      setIsRedirecting(true);
      if (user?.role === ROLES.ADMIN) {
        router.replace(ROUTES.ADMIN_DASHBOARD);
      } else if (user?.role === ROLES.DOSEN) {
        router.replace(ROUTES.DOSEN_DASHBOARD);
      } else {
        router.replace(ROUTES.HOME);
      }
    }
  }, [isAuthenticated, user, isInitialized, isLoading, router]);

  // Show loading while initializing or redirecting
  if (!isInitialized || isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#fba635]"></div>
      </div>
    );
  }

  // Don't render if authenticated (show loading instead)
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#fba635]"></div>
      </div>
    );
  }

  return <>{children}</>;
}
