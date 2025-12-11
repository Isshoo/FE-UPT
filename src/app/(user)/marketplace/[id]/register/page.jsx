'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { marketplaceAPI } from '@/lib/api';
import { useAuthStore, useMarketplaceStore } from '@/store';
import { ROLES } from '@/lib/constants/labels';
import { ROUTES } from '@/lib/constants/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Users, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import MahasiswaForm from '@/components/features/user/marketplace/MahasiswaForm';
import UmkmLuarForm from '@/components/features/user/marketplace/UmkmLuarForm';

export default function RegisterBusinessPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;
  // Use specific selectors to prevent unnecessary re-renders
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const eventDetail = useMarketplaceStore((state) => state.eventDetail);
  const isLoading = useMarketplaceStore((state) => state.isLoading);
  const fetchEventDetail = useMarketplaceStore(
    (state) => state.fetchEventDetail
  );

  const [submitting, setSubmitting] = useState(false);
  const [businessType, setBusinessType] = useState('MAHASISWA');

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu');
      router.push(`${ROUTES.LOGIN}?redirect=/marketplace/${eventId}/register`);
      return;
    }
    // Fix role comparison - use ROLES.USER directly, not string template
    if (user?.role !== ROLES.USER) {
      router.push(ROUTES.USER_MARKETPLACE);
      return;
    }

    fetchEventDetail(eventId).then((result) => {
      if (result.success && result.data) {
        if (result.data.status !== 'TERBUKA') {
          toast.error('Pendaftaran sudah ditutup');
          router.push(`/marketplace/${eventId}`);
        }
      } else {
        toast.error('Gagal memuat detail event');
        router.push('/marketplace');
      }
    });
  }, [eventId, isAuthenticated, user, router, fetchEventDetail]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);

      const data = {
        ...formData,
        tipeUsaha: businessType,
      };

      await marketplaceAPI.registerBusiness(eventId, data);

      toast.success(
        businessType === 'MAHASISWA'
          ? 'Pendaftaran berhasil! Menunggu persetujuan dosen pembimbing.'
          : 'Pendaftaran berhasil! Menunggu persetujuan admin.'
      );

      router.push('/profile?tab=riwayat');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Pendaftaran gagal');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-20 flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#fba635]"></div>
      </div>
    );
  }

  const event = eventDetail;
  if (!event) {
    return null;
  }

  return (
    <div className="container mx-auto mt-20 max-w-4xl space-y-6 px-4 py-8 pb-20">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push(`/marketplace/${eventId}`)}
          className="mb-4 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>

        <div>
          <h1 className="mb-2 text-3xl font-bold">Mendaftar Peserta</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {event.nama} - {event.semester} {event.tahunAjaran}
          </p>
        </div>
      </div>

      {/* Info Card */}
      {/* <Card className="border-l-4 border-l-[#fba635]">
        <CardContent className="pt-0">
          <div className="space-y-2 text-sm">
            <p>
              <strong>📅 Tanggal Pelaksanaan:</strong>{' '}
              {new Date(event.tanggalPelaksanaan).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <p>
              <strong>📍 Lokasi:</strong> {event.lokasi}
            </p>
            <p>
              <strong>👥 Kuota Tersisa:</strong>{' '}
              {event.kuotaPeserta - (event._count?.usaha || 0)} dari{' '}
              {event.kuotaPeserta} peserta
            </p>
          </div>
        </CardContent>
      </Card> */}

      {/* Registration Form */}
      <Card className="gap-3">
        <CardHeader>
          <CardTitle>Pilih Tipe Usaha</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={businessType} onValueChange={setBusinessType}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="MAHASISWA">
                <Users className="mr-2 h-4 w-4" />
                Mahasiswa
              </TabsTrigger>
              <TabsTrigger value="UMKM_LUAR">
                <Building2 className="mr-2 h-4 w-4" />
                Usaha Luar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="MAHASISWA" className="mt-6 space-y-6">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm dark:border-blue-800 dark:bg-blue-950">
                <p className="mb-2 font-semibold">
                  ℹ️ Informasi Usaha Mahasiswa:
                </p>
                <ul className="list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Khusus untuk mahasiswa</li>
                  <li>Dapat berupa kelompok atau individu</li>
                  <li>Memerlukan persetujuan dosen pembimbing</li>
                  <li>Akan dinilai untuk kompetisi</li>
                </ul>
              </div>

              <MahasiswaForm
                onSubmit={handleSubmit}
                isSubmitting={submitting}
              />
            </TabsContent>

            <TabsContent value="UMKM_LUAR" className="mt-6 space-y-6">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm dark:border-green-800 dark:bg-green-950">
                <p className="mb-2 font-semibold">ℹ️ Informasi UMKM Luar:</p>
                <ul className="list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Untuk UMKM di luar kampus</li>
                  <li>Memerlukan persetujuan admin</li>
                  <li>Tidak mengikuti kompetisi penilaian</li>
                  <li>Fokus pada promosi dan penjualan produk</li>
                </ul>
              </div>

              <UmkmLuarForm onSubmit={handleSubmit} isSubmitting={submitting} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
