'use client';

import { Sidebar } from '@/components/common/layout';
import { ProtectedRoute } from '@/components/features/auth';
import { ROLES } from '@/lib/constants/labels';

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <main className="mt-12 mb-13 ml-0 w-full flex-1 p-8 sm:mt-0 md:ml-20 lg:ml-64">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
