'use client';

import { ProtectedRoute } from '@/components/auth';
import { ROLES } from '@/lib/constants';

export default function UserLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.DOSEN, ROLES.USER, ROLES.ADMIN]}>
      {children}
    </ProtectedRoute>
  );
}
