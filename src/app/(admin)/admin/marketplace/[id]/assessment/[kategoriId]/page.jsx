'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { assessmentAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
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

import { ChevronLeft, Trophy, Award } from 'lucide-react';
import toast from 'react-hot-toast';

import { exportAPI, downloadBlob } from '@/lib/api';
import ExportButton from '@/components/ui/ExportButton';

export default function AssessmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id: eventId, kategoriId } = params;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settingWinner, setSettingWinner] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kategoriId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await assessmentAPI.getScoresByCategory(kategoriId);
      setData(response.data);
    } catch (error) {
      toast.error('Gagal memuat data penilaian');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetWinner = async (usahaId) => {
    if (
      !confirm(
        'Apakah Anda yakin ingin menetapkan pemenang untuk kategori ini?'
      )
    ) {
      return;
    }

    try {
      setSettingWinner(true);
      await assessmentAPI.setWinner(kategoriId, usahaId);
      toast.success('Pemenang berhasil ditetapkan');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menetapkan pemenang');
    } finally {
      setSettingWinner(false);
    }
  };

  const handleExportAssessment = async (format) => {
    const response = await exportAPI.exportAssessment(kategoriId, format);
    const filename = `hasil-penilaian-${kategori?.nama}-${new Date().getTime()}.xlsx`;
    downloadBlob(response.data, filename);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#fba635]"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <p className="mb-4 text-gray-500">Data tidak ditemukan</p>
        <Button asChild>
          <Link href={`/admin/marketplace/${eventId}`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
      </div>
    );
  }

  const { kategori, kriteria, businesses } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push(`/admin/marketplace/${eventId}`)}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali ke Detail Event
        </Button>

        <div className="flex flex-col items-start justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold">
              <Award className="h-8 w-8 text-[#fba635]" />
              {kategori.nama}
            </h1>
            {kategori.deskripsi && (
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {kategori.deskripsi}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <ExportButton
              onExport={handleExportAssessment}
              formats={['excel']}
              label="Export Hasil"
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Kriteria Info */}
      <Card className="gap-3">
        <CardHeader>
          <CardTitle>Kriteria Penilaian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {kriteria.map((k) => (
              <div key={k.id} className="rounded-lg border p-4 text-center">
                <p className="font-semibold">{k.nama}</p>
                <p className="mt-2 text-2xl font-bold text-[#fba635]">
                  {k.bobot}%
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scores Table */}
      <Card className="gap-1">
        <CardHeader>
          <CardTitle>Hasil Penilaian ({businesses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {businesses.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">Belum ada peserta yang dinilai</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Rank</TableHead>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Pemilik</TableHead>
                    <TableHead>Booth</TableHead>
                    {kriteria.map((k) => (
                      <TableHead key={k.id} className="text-center">
                        {k.nama}
                      </TableHead>
                    ))}
                    <TableHead className="text-center font-bold">
                      Total Score
                    </TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businesses.map((business, index) => (
                    <TableRow
                      key={business.usahaId}
                      className={
                        index === 0 ? 'bg-yellow-50 dark:bg-yellow-950' : ''
                      }
                    >
                      <TableCell className="font-bold">
                        {index === 0 ? (
                          <Trophy className="h-5 w-5 text-yellow-500" />
                        ) : (
                          index + 1
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {business.namaProduk}
                      </TableCell>
                      <TableCell>{business.kategoriUsaha}</TableCell>
                      <TableCell>{business.pemilik}</TableCell>
                      <TableCell>
                        <Badge>{business.nomorBooth || '-'}</Badge>
                      </TableCell>
                      {business.scoreDetails.map((score) => (
                        <TableCell
                          key={score.kriteriaId}
                          className="text-center"
                        >
                          <div className="space-y-1">
                            <div className="font-semibold">{score.nilai}</div>
                            <div className="text-xs text-gray-500">
                              ({score.weightedScore.toFixed(1)})
                            </div>
                          </div>
                        </TableCell>
                      ))}
                      <TableCell className="text-center">
                        <div className="text-lg font-bold text-[#fba635]">
                          {business.totalScore}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {index === 0 && (
                          <Button
                            size="sm"
                            onClick={() => handleSetWinner(business.usahaId)}
                            disabled={settingWinner}
                            className="bg-yellow-600 hover:bg-yellow-700"
                          >
                            <Trophy className="mr-1 h-3 w-3" />
                            Set Pemenang
                          </Button>
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
      <Card className="gap-3">
        <CardContent className="pt-0">
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>Keterangan:</strong>
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>Nilai pertama = nilai mentah (0-100)</li>
              <li>Nilai dalam kurung = nilai terbobot (nilai × bobot / 100)</li>
              <li>Total Score = jumlah dari semua nilai terbobot</li>
              <li>Peserta diurutkan berdasarkan Total Score tertinggi</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
