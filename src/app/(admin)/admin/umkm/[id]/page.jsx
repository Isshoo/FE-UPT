'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { umkmAPI } from '@/lib/api';
import {
  UMKM_STAGE_NAMES,
  UMKM_STAGE_DESCRIPTIONS,
  UMKM_STAGE_STATUS_LABELS,
} from '@/lib/constants/labels';
import { UMKM_STAGE_STATUS_COLORS } from '@/lib/constants/colors';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ChevronLeft,
  Building2,
  MapPin,
  Phone,
  User,
  CheckCircle,
  XCircle,
  FileText,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUmkmDetailPage() {
  const router = useRouter();
  const params = useParams();
  const umkmId = params.id;

  const [umkm, setUmkm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [validationData, setValidationData] = useState({
    catatan: '',
  });

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

  const handleValidate = async (isApproved) => {
    if (!selectedStage) return;

    if (
      !confirm(
        `Apakah Anda yakin ingin ${
          isApproved ? 'menyetujui' : 'menolak'
        } tahap ini?`
      )
    ) {
      return;
    }

    try {
      setValidating(true);
      await umkmAPI.validateStage(
        umkmId,
        selectedStage.tahap,
        isApproved,
        validationData.catatan || null
      );

      toast.success(
        isApproved
          ? 'Tahap berhasil divalidasi'
          : 'Tahap ditolak, UMKM dapat mengupload ulang'
      );

      setSelectedStage(null);
      setValidationData({ catatan: '' });
      fetchUmkmDetail();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal validasi tahap');
    } finally {
      setValidating(false);
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
        <Button onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </div>
    );
  }

  const pendingStages = umkm.tahap?.filter(
    (stage) => stage.status === 'MENUNGGU_VALIDASI'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/umkm')}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>

        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold">{umkm.nama}</h1>
            <Badge variant="outline">{umkm.kategori}</Badge>
            <Badge>Tahap {umkm.tahapSaatIni}</Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{umkm.deskripsi}</p>
        </div>
      </div>

      {/* Pending Validation Alert */}
      {pendingStages && pendingStages.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 py-4 dark:border-yellow-800 dark:bg-yellow-950">
          <CardContent className="pt-0">
            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
              ⚠️ Ada {pendingStages.length} tahap yang menunggu validasi Anda
            </p>
          </CardContent>
        </Card>
      )}

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
                    Terdaftar Oleh
                  </p>
                  <p className="font-semibold">{umkm.user?.nama}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stages Accordion */}
      <Card className="gap-1">
        <CardHeader>
          <CardTitle>Tahap Pembinaan</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {umkm.tahap
              ?.sort((a, b) => a.tahap - b.tahap)
              .map((stage) => {
                const isPending = stage.status === 'MENUNGGU_VALIDASI';
                const hasFiles =
                  stage.file &&
                  Array.isArray(stage.file) &&
                  stage.file.length > 0;

                return (
                  <AccordionItem key={stage.id} value={`tahap-${stage.tahap}`}>
                    <AccordionTrigger
                      className={
                        isPending ? 'font-semibold text-yellow-600' : ''
                      }
                    >
                      <div className="flex w-full items-center gap-3">
                        <span>
                          Tahap {stage.tahap}: {UMKM_STAGE_NAMES[stage.tahap]}
                        </span>
                        <Badge
                          className={UMKM_STAGE_STATUS_COLORS[stage.status]}
                        >
                          {UMKM_STAGE_STATUS_LABELS[stage.status]}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-0">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {UMKM_STAGE_DESCRIPTIONS[stage.tahap]}
                        </p>

                        {stage.catatan && (
                          <div className="rounded bg-blue-50 p-3 text-sm dark:bg-blue-950">
                            <p className="mb-1 font-semibold text-blue-900 dark:text-blue-300">
                              Catatan:
                            </p>
                            <p className="text-blue-800 dark:text-blue-400">
                              {stage.catatan}
                            </p>
                          </div>
                        )}

                        {hasFiles && (
                          <div>
                            <Label className="mb-2 block">
                              File yang Diupload:
                            </Label>
                            <div className="space-y-2">
                              {stage.file.map((fileUrl, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 rounded border p-3"
                                >
                                  <FileText className="h-4 w-4 text-gray-600" />
                                  <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-sm text-blue-600 hover:underline"
                                  >
                                    File {index + 1}
                                  </a>
                                  <Button size="sm" variant="ghost" asChild>
                                    <a
                                      href={fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </a>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {isPending && (
                          <Button
                            onClick={() => setSelectedStage(stage)}
                            className="w-full bg-[#fba635] hover:bg-[#fdac58]"
                          >
                            Validasi Tahap Ini
                          </Button>
                        )}

                        {stage.tanggalSubmit && (
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Disubmit:{' '}
                            {new Date(stage.tanggalSubmit).toLocaleString(
                              'id-ID'
                            )}
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
          </Accordion>
        </CardContent>
      </Card>

      {/* Validation Dialog */}
      <Dialog
        open={!!selectedStage}
        onOpenChange={() => setSelectedStage(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Validasi Tahap {selectedStage?.tahap}:{' '}
              {UMKM_STAGE_NAMES[selectedStage?.tahap]}
            </DialogTitle>
            <DialogDescription>
              Periksa file yang diupload dan berikan catatan jika diperlukan
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan (Opsional)</Label>
              <Textarea
                id="catatan"
                placeholder="Berikan catatan untuk UMKM..."
                value={validationData.catatan}
                onChange={(e) => setValidationData({ catatan: e.target.value })}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedStage(null)}
              disabled={validating}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleValidate(false)}
              disabled={validating}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Tolak
            </Button>
            <Button
              onClick={() => handleValidate(true)}
              disabled={validating}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {validating ? 'Memproses...' : 'Setujui'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
