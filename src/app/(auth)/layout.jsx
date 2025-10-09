'use client';

import { GuestRoute } from '@/components/auth';
import Link from 'next/link';
import { ROUTES, APP_NAME } from '@/lib/constants';

export default function AuthLayout({ children }) {
  return (
    <GuestRoute>
      <div className="flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#174c4e] to-[#072526] p-12 flex-col justify-between">
          <Link href={ROUTES.HOME}>
            <span className="text-3xl font-bold text-[#fba635]">
              {APP_NAME}
            </span>
          </Link>

          <div className="text-white">
            <h2 className="text-4xl font-bold mb-4">
              Kelola Event & UMKM dengan Mudah
            </h2>
            <p className="text-lg text-gray-300">
              Platform terintegrasi untuk manajemen bazaar/marketplace dan
              pembinaan UMKM
            </p>
          </div>

          <p className="text-gray-400 text-sm">
            © 2025 UPT-PIK. All rights reserved.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
          {children}
        </div>
      </div>
    </GuestRoute>
  );
}