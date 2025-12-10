'use client';

import { Sidebar } from '@/components/common/layout';
import { ProtectedRoute } from '@/components/features/auth';
import { ROLES } from '@/lib/constants/labels';
import { useSidebarStore } from '@/store';
import { cn } from '@/lib/utils/tailwind';

export default function AdminLayout({ children }) {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);

  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <main
          className={cn(
            'mt-14 mb-8 ml-0 w-full flex-1 p-4 transition-all duration-300 sm:p-6 lg:mt-0 lg:p-8',
            isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
          )}
        >
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
