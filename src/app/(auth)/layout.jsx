'use client';

import { GuestRoute } from '@/components/features/auth';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';
import { APP_NAME } from '@/config/environment';

export default function AuthLayout({ children }) {
  return (
    <GuestRoute>
      <div className="flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden flex-col justify-between bg-gradient-to-br from-[#174c4e] to-[#072526] p-12 lg:flex lg:w-1/2">
          <Link href={ROUTES.HOME}>
            <span className="text-3xl font-bold text-[#fba635]">
              {APP_NAME}
            </span>
          </Link>

          <div className="text-white">
            <h2 className="mb-4 text-4xl font-bold">
              Kelola Event & UMKM dengan Mudah
            </h2>
            <p className="text-lg text-gray-300">
              Platform terintegrasi untuk manajemen bazaar/marketplace dan
              pembinaan UMKM
            </p>
          </div>

          <p className="text-sm text-gray-400">
            © 2025 UPT-PIK. All rights reserved.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-1 items-center justify-center bg-white p-8 dark:bg-gray-900">
          {children}
        </div>
      </div>
    </GuestRoute>
  );
}
