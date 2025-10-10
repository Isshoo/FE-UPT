'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { authAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, History, Briefcase, Lock } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profil');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu');
      router.push(`${ROUTES.LOGIN}?redirect=/`);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Password baru tidak cocok');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    try {
      setChangingPassword(true);
      await authAPI.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success('Password berhasil diubah');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengubah password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#fba635]"></div>
      </div>
    );
  }

  // Only show profil tab for dosen and admin
  const isDosen = user.role === 'DOSEN';
  const isAdmin = user.role === 'ADMIN';
  const showOnlyProfile = isDosen || isAdmin;

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold">Profil Saya</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Kelola informasi profil dan akun Anda
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
          className={showOnlyProfile ? 'w-full' : 'grid w-full grid-cols-3'}
        >
          <TabsTrigger value="profil">
            <User className="mr-2 h-4 w-4" />
            Profil
          </TabsTrigger>
          {!showOnlyProfile && (
            <>
              <TabsTrigger value="riwayat">
                <History className="mr-2 h-4 w-4" />
                Riwayat Marketplace
              </TabsTrigger>
              <TabsTrigger value="umkm">
                <Briefcase className="mr-2 h-4 w-4" />
                UMKM Anda
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Profil Tab */}
        <TabsContent value="profil" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pribadi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">
                    Nama Lengkap
                  </Label>
                  <p className="font-semibold">{user.nama}</p>
                </div>

                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">
                    Email
                  </Label>
                  <p className="font-semibold">{user.email}</p>
                </div>

                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">
                    Role
                  </Label>
                  <Badge className="capitalize">{user.role}</Badge>
                </div>

                {user.fakultas && (
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">
                      Fakultas
                    </Label>
                    <p className="font-semibold">{user.fakultas}</p>
                  </div>
                )}

                {user.prodi && (
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">
                      Program Studi
                    </Label>
                    <p className="font-semibold">{user.prodi}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Ubah Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="oldPassword">Password Lama</Label>
                  <Input
                    id="oldPassword"
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        oldPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Password Baru</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Konfirmasi Password Baru
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={changingPassword}
                  className="bg-[#fba635] hover:bg-[#fdac58]"
                >
                  {changingPassword ? 'Memproses...' : 'Ubah Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Riwayat Marketplace Tab */}
        {!showOnlyProfile && (
          <TabsContent value="riwayat">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <History className="mb-4 h-16 w-16 text-gray-400" />
                <p className="mb-2 text-gray-500">
                  Belum ada riwayat marketplace
                </p>
                <p className="text-sm text-gray-400">
                  Riwayat event yang Anda ikuti akan muncul di sini
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* UMKM Anda Tab */}
        {!showOnlyProfile && (
          <TabsContent value="umkm">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Briefcase className="mb-4 h-16 w-16 text-gray-400" />
                <p className="mb-2 text-gray-500">Belum ada UMKM terdaftar</p>
                <p className="mb-4 text-sm text-gray-400">
                  Daftarkan UMKM Anda untuk mendapatkan pembinaan
                </p>
                <Button className="bg-[#fba635] hover:bg-[#fdac58]">
                  Daftarkan UMKM
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
