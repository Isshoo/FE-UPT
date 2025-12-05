'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store';
import { ROUTES } from '@/lib/constants/routes';
import { APP_NAME } from '@/config/environment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils/tailwind';
import { ArrowLeft } from 'lucide-react';

export function RegisterForm({ className, ...props }) {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Password tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    const result = await register({
      nama: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      toast.success('Registrasi berhasil!');
      router.push(ROUTES.HOME);
    } else {
      toast.error(result.error || 'Registrasi gagal');
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
                  Daftar sekarang dan akses berbagai event bazaar menarik
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
                  Bergabunglah dengan Kami
                </h2>
                <p className="text-gray-200 drop-shadow-md">
                  Daftarkan bisnis anda dan ikuti berbagai event marketplace
                  menarik
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-6 md:min-h-[460px] md:p-8">
            <div className="flex flex-col gap-6">
              <div className="hidden flex-col items-center gap-2 text-center md:flex">
                <h1 className="text-2xl font-bold">Buat Akun Baru</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Daftar untuk mengakses platform
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

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

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Min. 6 karakter"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Ulangi password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#fba635] hover:bg-[#fdac58]"
                  disabled={isLoading}
                >
                  {isLoading ? 'Memproses...' : 'Daftar'}
                </Button>
              </div>

              <p className="text-muted-foreground text-center text-sm">
                Sudah punya akun?{' '}
                <Link
                  href={ROUTES.LOGIN}
                  className="font-medium text-[#fba635] hover:underline"
                >
                  Login di sini
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
