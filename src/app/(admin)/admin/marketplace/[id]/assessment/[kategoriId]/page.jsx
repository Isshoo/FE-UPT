'use client';

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
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
import { exportAPI, downloadBlob } from '@/lib/api';
import ExportButton from '@/components/ui/ExportButton';
import { useAssessmentDetail } from '@/lib/hooks/features/useAssessmentDetail';

export default function AssessmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id: eventId, kategoriId } = params;

  const { data, loading, error, settingWinner, refetch, handleSetWinner } =
    useAssessmentDetail(kategoriId);

  const handleExportAssessment = async (format) => {
    try {
      const response = await exportAPI.exportAssessment(kategoriId, format);
      const ext = format === 'pdf' ? 'pdf' : 'xlsx';
      const filename = `hasil-penilaian-${data?.kategori?.nama || 'assessment'}-${new Date().getTime()}.${ext}`;
      downloadBlob(response.data, filename);
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#fba635]"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <p className="mb-4 text-gray-500">{error || 'Data tidak ditemukan'}</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refetch}>
            Coba Lagi
          </Button>
          <Button asChild>
            <Link href={`/admin/marketplace/${eventId}`}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Kembali
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const { kategori, kriteria, businesses, event, pemenang } = data;

  // Check if we can set winner: event must be SELESAI and no winner set
  const canSetWinner = event?.status === 'SELESAI' && !pemenang;
  const isEventSelesai = event?.status === 'SELESAI';

  // Get highest score and find all businesses with that score (for tie detection)
  const highestScore = businesses.length > 0 ? businesses[0].totalScore : 0;
  const tiedTopScorers = businesses.filter(
    (b) => b.totalScore === highestScore && highestScore > 0
  );
  const hasTie = tiedTopScorers.length > 1;

  // Function to check if a business is a top scorer (eligible for manual winner selection in tie)
  const isTopScorer = (business) => {
    return tiedTopScorers.some((t) => t.usahaId === business.usahaId);
  };

  // Check if business is the set winner
  const isWinner = (business) => {
    return pemenang && business.usahaId === pemenang.id;
  };

  // Sort businesses: winner always at top, then by score
  const sortedBusinesses = [...businesses].sort((a, b) => {
    // Winner always first
    if (pemenang) {
      if (a.usahaId === pemenang.id) return -1;
      if (b.usahaId === pemenang.id) return 1;
    }
    // Then by score descending
    return b.totalScore - a.totalScore;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push(`/admin/marketplace/${eventId}`)}
          className="mb-4 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali ke Detail Event
        </Button>

        <div className="flex flex-row items-start justify-between">
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
              formats={['excel', 'pdf']}
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
            {kriteria.map((k, index) => (
              <div key={k.id} className="rounded-lg border p-4 text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  (K{index + 1})
                </p>
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
                    {kriteria.map((k, index) => (
                      <TableHead key={k.id} className="text-center">
                        K{index + 1}
                      </TableHead>
                    ))}
                    <TableHead className="text-center font-bold">
                      Total Score
                    </TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedBusinesses.map((business, index) => (
                    <TableRow
                      key={business.usahaId}
                      className={
                        isWinner(business)
                          ? 'bg-yellow-50 dark:bg-yellow-950'
                          : ''
                      }
                    >
                      <TableCell className="font-bold">
                        {isWinner(business) ? (
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
                        {/* Show actions for top scorers (handles tie scenario) */}
                        {isTopScorer(business) && (
                          <>
                            {/* Winner already set */}
                            {pemenang && business.usahaId === pemenang.id ? (
                              <Badge className="bg-green-600 text-white">
                                <Trophy className="mr-1 h-3 w-3" />
                                Pemenang
                              </Badge>
                            ) : pemenang ? null : canSetWinner ? (
                              // Can set winner: event SELESAI and no pemenang yet
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleSetWinner(business.usahaId)
                                }
                                disabled={settingWinner}
                                className="bg-yellow-600 hover:bg-yellow-700"
                              >
                                <Trophy className="mr-1 h-3 w-3" />
                                {settingWinner
                                  ? 'Memproses...'
                                  : hasTie
                                    ? 'Pilih Pemenang'
                                    : 'Set Pemenang'}
                              </Button>
                            ) : !isEventSelesai ? (
                              // Event not finished yet (only show badge for rank 1)
                              index === 0 && (
                                <Badge
                                  variant="outline"
                                  className="text-gray-500"
                                >
                                  Event belum selesai
                                </Badge>
                              )
                            ) : null}
                          </>
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
