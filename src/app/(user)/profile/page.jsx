'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store';
import { authAPI, umkmAPI, marketplaceAPI } from '@/lib/api';
import { UMKM_STAGE_NAMES } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  User,
  History,
  Briefcase,
  Lock,
  Plus,
  Edit2,
  Trash2,
  ShoppingBag,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDateTime } from '@/lib/utils';

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profil';

  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [changingPassword, setChangingPassword] = useState(false);
  const [myUmkms, setMyUmkms] = useState([]);
  const [marketplaceHistory, setMarketplaceHistory] = useState([]);
  const [loadingUmkms, setLoadingUmkms] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const isDosen = user?.role === 'dosen';
    const isAdmin = user?.role === 'admin';
    if (activeTab === 'umkm' && !isDosen && !isAdmin) {
      fetchMyUmkms();
    }
    if (activeTab === 'riwayat' && !isDosen && !isAdmin) {
      fetchMarketplaceHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchMyUmkms = async () => {
    try {
      setLoadingUmkms(true);
      const response = await umkmAPI.getMyUmkms();
      setMyUmkms(response.data.umkms || response.data);
    } catch (error) {
      console.error('Failed to fetch UMKM:', error);
    } finally {
      setLoadingUmkms(false);
    }
  };

  const fetchMarketplaceHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await marketplaceAPI.getMyHistory();
      setMarketplaceHistory(response.data || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      toast.error('Gagal memuat riwayat marketplace');
    } finally {
      setLoadingHistory(false);
    }
  };

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

  const getStatusBadge = (status) => {
    const statusConfig = {
      TERBUKA: { label: 'Terbuka', className: 'bg-green-500' },
      BERLANGSUNG: { label: 'Berlangsung', className: 'bg-blue-500' },
      SELESAI: { label: 'Selesai', className: 'bg-gray-500' },
    };

    const config = statusConfig[status] || statusConfig.TERBUKA;

    return (
      <Badge className={`${config.className} text-white`}>{config.label}</Badge>
    );
  };

  const handleDeleteUmkm = async (umkmId, namaUmkm) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus UMKM "${namaUmkm}"?`)) {
      return;
    }

    try {
      await umkmAPI.deleteUmkm(umkmId);
      toast.success('UMKM berhasil dihapus');
      fetchMyUmkms();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus UMKM');
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#fba635]"></div>
      </div>
    );
  }

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
          className={showOnlyProfile ? 'w-full' : 'grid w-full grid-cols-2'}
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
              {/* <TabsTrigger value="umkm">
                <Briefcase className="mr-2 h-4 w-4" />
                UMKM Anda
              </TabsTrigger> */}
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
          <TabsContent value="riwayat" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Riwayat Marketplace ({marketplaceHistory.length})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {loadingHistory ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#fba635]"></div>
                  </div>
                ) : marketplaceHistory.length === 0 ? (
                  <div className="py-12 text-center">
                    <History className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                    <p className="mb-2 text-gray-500">
                      Belum ada riwayat marketplace
                    </p>
                    <p className="mb-4 text-sm text-gray-400">
                      Riwayat event yang Anda ikuti akan muncul di sini
                    </p>
                    <Button asChild className="bg-[#fba635] hover:bg-[#fdac58]">
                      <Link href="/marketplace">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Lihat Event Tersedia
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {marketplaceHistory.map((history) => (
                      <Card
                        key={history.id}
                        className="border-l-4 border-l-[#fba635]"
                      >
                        <CardContent className="pt-0">
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            {/* Event Info */}
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start gap-3">
                                <Calendar className="mt-1 h-5 w-5 text-[#fba635]" />
                                <div>
                                  <h3 className="text-lg font-semibold">
                                    {history.event.nama}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {history.event.semester} -{' '}
                                    {history.event.tahunAjaran}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4" />
                                <span>{history.event.lokasi}</span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="h-4 w-4" />
                                <span>
                                  Pelaksanaan:{' '}
                                  {formatDateTime(
                                    history.event.tanggalPelaksanaan
                                  )}
                                </span>
                              </div>

                              {/* Business Info */}
                              {history.usaha && (
                                <div className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <p className="text-sm font-semibold">
                                        {history.usaha.namaProduk}
                                      </p>
                                      <div className="mt-1 flex flex-wrap gap-2">
                                        <Badge variant="outline">
                                          {history.usaha.kategori}
                                        </Badge>
                                        <Badge variant="outline">
                                          {history.usaha.tipeUsaha ===
                                          'MAHASISWA'
                                            ? 'Mahasiswa'
                                            : 'UMKM Luar'}
                                        </Badge>
                                        {history.usaha.nomorBooth && (
                                          <Badge className="bg-[#174c4e] text-white">
                                            Booth {history.usaha.nomorBooth}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    {history.usaha.disetujui ? (
                                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <Clock className="h-5 w-5 text-yellow-500" />
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Status & Actions */}
                            <div className="flex flex-col items-end gap-3">
                              {getStatusBadge(history.event.status)}

                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="w-full md:w-auto"
                              >
                                <Link href={`/marketplace/${history.event.id}`}>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Lihat Detail
                                </Link>
                              </Button>

                              <p className="text-xs text-gray-500">
                                Terdaftar: {formatDateTime(history.createdAt)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* UMKM Anda Tab */}
        {!showOnlyProfile && (
          <TabsContent value="umkm" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>UMKM Anda ({myUmkms.length})</CardTitle>
                  <Button asChild className="bg-[#fba635] hover:bg-[#fdac58]">
                    <Link href="/profile/umkm/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Daftarkan UMKM
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingUmkms ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#fba635]"></div>
                  </div>
                ) : myUmkms.length === 0 ? (
                  <div className="py-12 text-center">
                    <Briefcase className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                    <p className="mb-2 text-gray-500">
                      Belum ada UMKM terdaftar
                    </p>
                    <p className="mb-4 text-sm text-gray-400">
                      Daftarkan UMKM Anda untuk mendapatkan pembinaan
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myUmkms.map((umkm) => (
                      <Card key={umkm.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                  {umkm.nama}
                                </h3>
                                <Badge variant="outline">{umkm.kategori}</Badge>
                                <Badge>Tahap {umkm.tahapSaatIni}</Badge>
                              </div>
                              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                                {umkm.deskripsi}
                              </p>
                              <div className="mb-2 flex gap-1">
                                {[1, 2, 3, 4].map((tahap) => {
                                  const stage = umkm.tahap?.find(
                                    (t) => t.tahap === tahap
                                  );
                                  const status =
                                    stage?.status || 'BELUM_DIMULAI';

                                  return (
                                    <div
                                      key={tahap}
                                      className={`h-2 flex-1 rounded ${
                                        status === 'SELESAI'
                                          ? 'bg-green-500'
                                          : status === 'MENUNGGU_VALIDASI'
                                            ? 'bg-yellow-500'
                                            : status === 'SEDANG_PROSES'
                                              ? 'bg-blue-500'
                                              : 'bg-gray-200 dark:bg-gray-700'
                                      }`}
                                      title={`Tahap ${tahap}: ${UMKM_STAGE_NAMES[tahap]}`}
                                    />
                                  );
                                })}
                              </div>
                            </div>

                            <div className="ml-4 flex gap-2">
                              <Button asChild size="sm" variant="outline">
                                <Link href={`/profile/umkm/${umkm.id}`}>
                                  <Edit2 className="mr-1 h-3 w-3" />
                                  Kelola
                                </Link>
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleDeleteUmkm(umkm.id, umkm.nama)
                                }
                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
