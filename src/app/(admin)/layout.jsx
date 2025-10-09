'use client';

import { Sidebar } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { ROLES } from '@/lib/constants';

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}