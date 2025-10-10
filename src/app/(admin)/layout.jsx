'use client';

import { Sidebar } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { ROLES } from '@/lib/constants';

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <main className="mt-12 mb-13 ml-0 flex-1 p-8 sm:mt-0 sm:ml-20 lg:ml-64">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
