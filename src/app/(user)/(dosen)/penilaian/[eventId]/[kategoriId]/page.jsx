'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { assessmentAPI, marketplaceAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronLeft, Save, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PenilaianFormPage() {
  const router = useRouter();
  const params = useParams();
  const { eventId, kategoriId } = params;

  const [event, setEvent] = useState(null);
  const [category, setCategory] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [scores, setScores] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, kategoriId]);

  const fetchData = async () => {
    try {
      const [eventResponse, categoryResponse, businessesResponse] =
        await Promise.all([
          marketplaceAPI.getEventById(eventId),
          assessmentAPI.getCategoryById(kategoriId),
          marketplaceAPI.getBusinessesByEvent(eventId, {
            tipeUsaha: 'MAHASISWA',
            disetujui: 'true',
          }),
        ]);

      setEvent(eventResponse.data);
      setCategory(categoryResponse.data);
      setBusinesses(businessesResponse.data);

      // Initialize scores
      const initialScores = {};
      businessesResponse.data.forEach((business) => {
        initialScores[business.id] = {};
        categoryResponse.data.kriteria.forEach((kriteria) => {
          initialScores[business.id][kriteria.id] = '';
        });
      });
      setScores(initialScores);
    } catch (error) {
      toast.error('Gagal memuat data');
      console.error(error);
    }
  };

  const handleScoreChange = (businessId, kriteriaId, value) => {
    const numValue = parseInt(value);
    if (value === '' || (numValue >= 0 && numValue <= 100)) {
      setScores((prev) => ({
        ...prev,
        [businessId]: {
          ...prev[businessId],
          [kriteriaId]: value,
        },
      }));
    }
  };

  const handleSubmitScore = async (businessId, kriteriaId) => {
    const nilai = scores[businessId]?.[kriteriaId];

    if (nilai === '' || nilai === undefined) {
      toast.error('Nilai tidak boleh kosong');
      return;
    }

    try {
      setSubmitting(true);
      await assessmentAPI.submitScore({
        usahaId: businessId,
        kategoriId,
        kriteriaId,
        nilai: parseInt(nilai),
      });
      toast.success('Nilai berhasil disimpan');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan nilai');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAll = async () => {
    if (!confirm('Apakah Anda yakin ingin menyimpan semua nilai?')) {
      return;
    }

    try {
      setSubmitting(true);
      let successCount = 0;
      let failCount = 0;

      for (const businessId of Object.keys(scores)) {
        for (const kriteriaId of Object.keys(scores[businessId])) {
          const nilai = scores[businessId][kriteriaId];
          if (nilai !== '' && nilai !== undefined) {
            try {
              await assessmentAPI.submitScore({
                usahaId: businessId,
                kategoriId,
                kriteriaId,
                nilai: parseInt(nilai),
              });
              successCount++;
            } catch (error) {
              failCount++;
              console.error('Error submitting score:', error);
            }
          }
        }
      }

      if (failCount === 0) {
        toast.success(`Semua nilai berhasil disimpan (${successCount} nilai)`);
        router.push(`/penilaian/${eventId}`);
      } else {
        toast.error(
          `${successCount} nilai berhasil, ${failCount} nilai gagal disimpan`
        );
      }
    } catch (error) {
      console.error('Error submitting all scores:', error);
      toast.error('Terjadi kesalahan saat menyimpan nilai');
    } finally {
      setSubmitting(false);
    }
  };

  if (!event || !category) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <p className="mb-4 text-gray-500">Data tidak ditemukan</p>
        <Button onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </div>
    );
  }

  const canAssess = event.status === 'BERLANGSUNG';

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push(`/penilaian/${eventId}`)}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>

        <div>
          <h1 className="mb-2 flex items-center gap-3 text-3xl font-bold">
            <Award className="h-8 w-8 text-[#fba635]" />
            {category.nama}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {event.nama} - Masukkan nilai untuk setiap kriteria penilaian
          </p>
        </div>
      </div>

      {/* Alert */}
      {!canAssess && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              ⚠️ Penilaian hanya dapat dilakukan saat event sedang berlangsung
            </p>
          </CardContent>
        </Card>
      )}

      {/* Kriteria Info */}
      <Card>
        <CardHeader>
          <CardTitle>Kriteria Penilaian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {category.kriteria.map((kriteria) => (
              <div
                key={kriteria.id}
                className="rounded-lg border p-4 text-center"
              >
                <p className="font-semibold">{kriteria.nama}</p>
                <p className="mt-2 text-2xl font-bold text-[#fba635]">
                  {kriteria.bobot}%
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assessment Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Form Penilaian ({businesses.length} Peserta)</CardTitle>
            {canAssess && (
              <Button
                onClick={handleSubmitAll}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="mr-2 h-4 w-4" />
                {submitting ? 'Menyimpan...' : 'Simpan Semua'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {businesses.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">
                Belum ada peserta yang disetujui untuk dinilai
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>Booth</TableHead>
                    {category.kriteria.map((kriteria) => (
                      <TableHead key={kriteria.id} className="text-center">
                        {kriteria.nama}
                        <br />
                        <span className="text-xs text-gray-500">
                          ({kriteria.bobot}%)
                        </span>
                      </TableHead>
                    ))}
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businesses.map((business, index) => (
                    <TableRow key={business.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {business.namaProduk}
                      </TableCell>
                      <TableCell>
                        <Badge>{business.nomorBooth || '-'}</Badge>
                      </TableCell>
                      {category.kriteria.map((kriteria) => (
                        <TableCell key={kriteria.id} className="text-center">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0-100"
                            value={scores[business.id]?.[kriteria.id] || ''}
                            onChange={(e) =>
                              handleScoreChange(
                                business.id,
                                kriteria.id,
                                e.target.value
                              )
                            }
                            disabled={!canAssess || submitting}
                            className="w-20 text-center"
                          />
                        </TableCell>
                      ))}
                      <TableCell className="text-center">
                        {canAssess && (
                          <div className="flex flex-col gap-2">
                            {category.kriteria.map((kriteria) => (
                              <Button
                                key={kriteria.id}
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleSubmitScore(business.id, kriteria.id)
                                }
                                disabled={
                                  submitting ||
                                  !scores[business.id]?.[kriteria.id]
                                }
                                className="text-xs"
                              >
                                <Save className="mr-1 h-3 w-3" />
                                {kriteria.nama.slice(0, 8)}
                              </Button>
                            ))}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>Petunjuk:</strong>
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>Masukkan nilai antara 0-100 untuk setiap kriteria</li>
              <li>
                Anda dapat menyimpan nilai per kriteria atau semua sekaligus
              </li>
              <li>Penilaian hanya dapat dilakukan saat event berlangsung</li>
              <li>Nilai yang sudah disimpan dapat diubah kembali</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
