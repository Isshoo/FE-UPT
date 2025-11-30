'use client';

import { ProtectedRoute } from '@/components/features/auth';
import { ROLES } from '@/lib/constants/labels';

export default function DosenLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.DOSEN]}>{children}</ProtectedRoute>
  );
}
