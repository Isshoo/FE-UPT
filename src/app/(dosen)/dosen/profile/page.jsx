'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store';
import { authAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Lock, GraduationCap, Mail, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DosenProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [changingPassword, setChangingPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Kata sandi baru tidak cocok');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Kata sandi minimal 6 karakter');
      return;
    }

    try {
      setChangingPassword(true);
      await authAPI.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success('Kata sandi berhasil diubah');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengubah kata sandi');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#174c4e]">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Profil Dosen</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola informasi profil dan akun Anda
          </p>
        </div>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informasi Pribadi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <User className="mt-0.5 h-5 w-5 text-[#fba635]" />
              <div>
                <Label className="text-sm text-gray-600 dark:text-gray-400">
                  Nama Lengkap
                </Label>
                <p className="font-semibold">{user.nama}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <Mail className="mt-0.5 h-5 w-5 text-[#fba635]" />
              <div>
                <Label className="text-sm text-gray-600 dark:text-gray-400">
                  Email
                </Label>
                <p className="font-semibold">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <Shield className="mt-0.5 h-5 w-5 text-[#fba635]" />
              <div>
                <Label className="text-sm text-gray-600 dark:text-gray-400">
                  Role
                </Label>
                <Badge className="mt-1 bg-[#174c4e] capitalize">
                  {user.role}
                </Badge>
              </div>
            </div>

            {user.fakultas && (
              <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <GraduationCap className="mt-0.5 h-5 w-5 text-[#fba635]" />
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">
                    Fakultas
                  </Label>
                  <p className="font-semibold">
                    {user.fakultas.nama || user.fakultas}
                  </p>
                </div>
              </div>
            )}

            {user.prodi && (
              <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <GraduationCap className="mt-0.5 h-5 w-5 text-[#fba635]" />
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">
                    Program Studi
                  </Label>
                  <p className="font-semibold">
                    {user.prodi.nama || user.prodi}
                  </p>
                </div>
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
            Ubah Kata Sandi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Kata Sandi Lama</Label>
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
              <Label htmlFor="newPassword">Kata Sandi Baru</Label>
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
                Konfirmasi Kata Sandi Baru
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
              {changingPassword ? 'Memproses...' : 'Ubah Kata Sandi'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
