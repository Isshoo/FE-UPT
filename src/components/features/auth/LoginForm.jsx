'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store';
import { ROUTES } from '@/lib/constants/routes';
import { ROLES } from '@/lib/constants/labels';
import { APP_NAME } from '@/config/environment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils/tailwind';
import { ArrowLeft } from 'lucide-react';

export function LoginForm({ className, ...props }) {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(formData);

    if (result.success) {
      toast.success('Login berhasil!');

      const user = result.user;

      if (user?.role === ROLES.ADMIN) {
        router.push(ROUTES.ADMIN_DASHBOARD);
      } else if (user?.role === ROLES.DOSEN) {
        router.push(ROUTES.DOSEN_DASHBOARD);
      } else {
        router.push(ROUTES.HOME);
      }
    } else {
      toast.error(result.error || 'Login gagal');
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      {/* Back to Home Button - Mobile & Desktop */}
      <Link
        href={ROUTES.HOME}
        className="group flex items-center gap-2 text-sm font-medium text-[#fba635] transition-colors hover:text-[#fdac58]"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Kembali ke Beranda
      </Link>

      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Mobile Hero Section */}
          <div className="relative block md:hidden">
            {/* Background Image */}
            <Image
              src="/images/auth-bg.jpg"
              alt="Auth Background"
              width={600}
              height={200}
              className="h-48 w-full object-cover"
              priority
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#174c4e]/85 via-[#0a3738]/75 to-[#072526]/85 backdrop-blur-[2px]" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <div className="text-center text-white">
                <h2 className="mb-2 text-xl font-bold drop-shadow-lg">
                  {APP_NAME}
                </h2>
                <p className="text-sm text-gray-200 drop-shadow-md">
                  Login dan akses berbagai event bazaar menarik
                </p>
              </div>
            </div>
          </div>
          {/* Desktop Hero Section */}
          <div className="bg-muted relative hidden md:block">
            {/* Background Image */}
            <Image
              src="/images/auth-bg.jpg"
              alt="Auth Background"
              fill
              className="object-cover"
              priority
            />

            {/* Gradient Overlay with blur effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#174c4e]/80 via-[#0a3738]/70 to-[#072526]/80 backdrop-blur-sm" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="relative z-10 text-center text-white">
                <h2 className="mb-4 text-2xl font-bold drop-shadow-lg">
                  Akses Event Marketplace Menarik
                </h2>
                <p className="text-gray-200 drop-shadow-md">
                  Platform terintegrasi untuk mengelola event marketplace dan
                  bisnis
                </p>
              </div>
            </div>
          </div>
          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            className="flex h-full items-center p-6 md:min-h-[460px] md:p-8"
          >
            <div className="flex w-full flex-col justify-center gap-6">
              <div className="hidden flex-col items-center gap-2 text-center md:flex">
                <h1 className="text-2xl font-bold">Selamat Datang</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Login untuk mengakses berbagai event bazaar menarik
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#fba635] hover:bg-[#fdac58]"
                  disabled={isLoading}
                >
                  {isLoading ? 'Memproses...' : 'Login'}
                </Button>
              </div>

              <p className="text-muted-foreground text-center text-sm">
                Belum punya akun?{' '}
                <Link
                  href={ROUTES.REGISTER}
                  className="font-medium text-[#fba635] hover:underline"
                >
                  Daftar di sini
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
