'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store';
import { ROUTES } from '@/lib/constants/routes';
import { ROLES } from '@/lib/constants/labels';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils/tailwind';

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
      } else {
        router.push(ROUTES.HOME);
      }
    } else {
      toast.error(result.error || 'Login gagal');
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="h-full min-h-[460px] items-center p-6 md:p-8"
          >
            <div className="flex h-full flex-col justify-center gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Selamat Datang</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Login ke akun Anda untuk mengakses platform
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

          <div className="bg-muted relative hidden md:block">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#174c4e] to-[#072526] p-8">
              <div className="text-center text-white">
                <h2 className="mb-4 text-2xl font-bold">
                  Kelola Event & UMKM dengan Mudah
                </h2>
                <p className="text-gray-300">
                  Platform terintegrasi untuk manajemen bazaar/marketplace dan
                  pembinaan UMKM
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
