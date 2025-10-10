'use client';

import { ProtectedRoute } from '@/components/auth';
import { ROLES } from '@/lib/constants';

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.DOSEN]}>{children}</ProtectedRoute>
  );
}
