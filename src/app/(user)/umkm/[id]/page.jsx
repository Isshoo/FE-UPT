'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { umkmAPI } from '@/lib/api';
import { useAuthStore } from '@/store';
import {
  UMKM_STAGE_NAMES,
  UMKM_STAGE_STATUS_LABELS,
  UMKM_STAGE_STATUS_COLORS,
} from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChevronLeft,
  Building2,
  MapPin,
  Phone,
  User,
  CheckCircle,
  Clock,
  Circle,
  Edit2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function UmkmDetailPage() {
  const router = useRouter();
  const params = useParams();
  const umkmId = params.id;
  const { user, isAuthenticated } = useAuthStore();

  const [umkm, setUmkm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUmkmDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [umkmId]);

  const fetchUmkmDetail = async () => {
    try {
      setLoading(true);
      const response = await umkmAPI.getUmkmById(umkmId);
      setUmkm(response.data);
    } catch (error) {
      toast.error('Gagal memuat detail UMKM');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStageIcon = (status) => {
    switch (status) {
      case 'SELESAI':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'MENUNGGU_VALIDASI':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'SEDANG_PROSES':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#fba635]"></div>
      </div>
    );
  }

  if (!umkm) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <p className="mb-4 text-gray-500">UMKM tidak ditemukan</p>
        <Button asChild>
          <span onClick={() => router.back()}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Kembali
          </span>
        </Button>
      </div>
    );
  }

  const isOwner = isAuthenticated && user?.id === umkm.userId;

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push('/umkm')}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar UMKM
        </Button>

        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold md:text-4xl">{umkm.nama}</h1>
              <Badge variant="outline">{umkm.kategori}</Badge>
              <Badge>Tahap {umkm.tahapSaatIni}</Badge>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {umkm.deskripsi}
            </p>
          </div>

          {isOwner && (
            <Button
              onClick={() => router.push(`/profile/umkm/${umkmId}`)}
              className="bg-[#fba635] hover:bg-[#fdac58]"
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Kelola UMKM
            </Button>
          )}
        </div>
      </div>

      {/* UMKM Info */}
      <Card className="gap-3">
        <CardHeader>
          <CardTitle>Informasi UMKM</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-5 w-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Pemilik
                  </p>
                  <p className="font-semibold">{umkm.namaPemilik}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Telepon
                  </p>
                  <p className="font-semibold">{umkm.telepon}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Alamat
                  </p>
                  <p className="font-semibold">{umkm.alamat}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="mt-0.5 h-5 w-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Kategori Usaha
                  </p>
                  <p className="font-semibold">{umkm.kategori}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stages Progress */}
      <Card className="gap-3">
        <CardHeader>
          <CardTitle>Tahap Pembinaan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {umkm.tahap
              ?.sort((a, b) => a.tahap - b.tahap)
              .map((stage) => (
                <div
                  key={stage.id}
                  className={`rounded-lg border p-4 ${
                    umkm.tahapSaatIni === stage.tahap
                      ? 'border-[#fba635] bg-orange-50 dark:bg-orange-950'
                      : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0">
                      {getStageIcon(stage.status)}
                    </div>

                    <div className="flex-1">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          Tahap {stage.tahap}: {UMKM_STAGE_NAMES[stage.tahap]}
                        </h3>
                        <Badge
                          className={UMKM_STAGE_STATUS_COLORS[stage.status]}
                        >
                          {UMKM_STAGE_STATUS_LABELS[stage.status]}
                        </Badge>
                      </div>

                      {stage.catatan && (
                        <div className="mb-2 rounded bg-blue-50 p-3 text-sm dark:bg-blue-950">
                          <p className="mb-1 font-semibold text-blue-900 dark:text-blue-300">
                            Catatan:
                          </p>
                          <p className="text-blue-800 dark:text-blue-400">
                            {stage.catatan}
                          </p>
                        </div>
                      )}

                      {stage.tanggalSubmit && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Disubmit:{' '}
                          {new Date(stage.tanggalSubmit).toLocaleDateString(
                            'id-ID',
                            {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            }
                          )}
                        </p>
                      )}

                      {stage.tanggalValidasi && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Divalidasi:{' '}
                          {new Date(stage.tanggalValidasi).toLocaleDateString(
                            'id-ID',
                            {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            }
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA for Owner */}
      {isOwner && umkm.tahapSaatIni < 4 && (
        <Card className="border-[#fba635] bg-orange-50 dark:bg-orange-950">
          <CardContent className="pt-0">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-[#fba635] p-3">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold">
                  Lanjutkan Tahap Pembinaan
                </h3>
                <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                  Lengkapi persyaratan untuk tahap {umkm.tahapSaatIni} dan
                  ajukan validasi
                </p>
                <Button
                  onClick={() => router.push(`/profile/umkm/${umkmId}`)}
                  className="bg-[#fba635] hover:bg-[#fdac58]"
                >
                  Kelola UMKM Saya
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
