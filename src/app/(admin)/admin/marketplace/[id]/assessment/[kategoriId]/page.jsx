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
import {
  ChevronLeft,
  Trophy,
  Award,
  Target,
  Users,
  Star,
  Medal,
  Store,
  Info,
} from 'lucide-react';
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
        <Award className="mb-4 h-10 w-10 text-gray-400" />
        <p className="mb-4 text-gray-500">{error || 'Data tidak ditemukan'}</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refetch}>
            Coba Lagi
          </Button>
          <Button asChild className="bg-[#fba635] hover:bg-[#fdac58]">
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

  const canSetWinner = event?.status === 'SELESAI' && !pemenang;
  const isEventSelesai = event?.status === 'SELESAI';

  const highestScore = businesses.length > 0 ? businesses[0].totalScore : 0;
  const tiedTopScorers = businesses.filter(
    (b) => b.totalScore === highestScore && highestScore > 0
  );
  const hasTie = tiedTopScorers.length > 1;

  const isTopScorer = (business) => {
    return tiedTopScorers.some((t) => t.usahaId === business.usahaId);
  };

  const isWinner = (business) => {
    return pemenang && business.usahaId === pemenang.id;
  };

  const sortedBusinesses = [...businesses].sort((a, b) => {
    if (pemenang) {
      if (a.usahaId === pemenang.id) return -1;
      if (b.usahaId === pemenang.id) return 1;
    }
    return b.totalScore - a.totalScore;
  });

  const avgScore =
    businesses.length > 0
      ? (
          businesses.reduce((acc, b) => acc + b.totalScore, 0) /
          businesses.length
        ).toFixed(1)
      : 0;

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/admin/marketplace/${eventId}`)}
            className="h-8 bg-slate-100 px-2 hover:bg-slate-200 dark:bg-gray-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#fba635] to-[#174c4e]">
              <Medal className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {kategori.nama}
              </h1>
              {kategori.deskripsi && (
                <p className="text-sm text-gray-500">{kategori.deskripsi}</p>
              )}
            </div>
          </div>
        </div>
        <ExportButton
          onExport={handleExportAssessment}
          formats={['excel', 'pdf']}
          label="Export"
          size="sm"
        />
      </div>

      {/* Compact Stats Row */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
          <Users className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-gray-500">Peserta:</span>
          <span className="font-bold">{businesses.length}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
          <Target className="h-4 w-4 text-green-500" />
          <span className="text-sm text-gray-500">Kriteria:</span>
          <span className="font-bold">{kriteria.length}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
          <Star className="h-4 w-4 text-purple-500" />
          <span className="text-sm text-gray-500">Rata-rata:</span>
          <span className="font-bold text-purple-600">{avgScore}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span className="text-sm text-gray-500">Tertinggi:</span>
          <span className="font-bold text-yellow-600">{highestScore}</span>
        </div>
        {pemenang && (
          <div className="flex items-center gap-2 rounded-lg border-2 border-yellow-300 bg-yellow-50 px-3 py-2 dark:border-yellow-700 dark:bg-yellow-900/20">
            <Trophy className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
              Pemenang: {pemenang.namaProduk}
            </span>
          </div>
        )}
      </div>

      {/* Compact Kriteria */}
      <Card className="overflow-hidden rounded-xl border-0 pt-0 shadow-sm">
        <CardHeader className="border-b bg-gray-50/50 px-4 py-2 dark:bg-gray-900/50">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Target className="h-4 w-4 text-[#fba635]" />
            Kriteria Penilaian
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="flex flex-wrap gap-2">
            {kriteria.map((k, index) => (
              <div
                key={k.id}
                className="flex items-center gap-2 rounded-lg border bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              >
                <span className="text-xs font-bold text-gray-400">
                  K{index + 1}
                </span>
                <span className="text-sm font-medium">{k.nama}</span>
                <Badge className="bg-[#fba635] text-xs">{k.bobot}%</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scores Table */}
      <Card className="overflow-hidden rounded-xl border-0 pt-0 shadow-sm">
        <CardHeader className="border-b bg-gray-50/50 px-4 py-2 dark:bg-gray-900/50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Award className="h-4 w-4 text-[#fba635]" />
              Hasil Penilaian
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {businesses.length} peserta
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {businesses.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-2 h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-500">
                Belum ada peserta yang dinilai
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80 text-xs dark:bg-gray-900/50">
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Pemilik
                    </TableHead>
                    <TableHead className="text-center">Booth</TableHead>
                    {kriteria.map((k, index) => (
                      <TableHead key={k.id} className="text-center">
                        K{index + 1}
                      </TableHead>
                    ))}
                    <TableHead className="text-center font-bold">
                      Total
                    </TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedBusinesses.map((business, index) => (
                    <TableRow
                      key={business.usahaId}
                      className={`text-sm ${
                        isWinner(business)
                          ? 'bg-yellow-50 dark:bg-yellow-950/30'
                          : index === 0 && !pemenang
                            ? 'bg-green-50/50 dark:bg-green-950/20'
                            : ''
                      }`}
                    >
                      <TableCell className="text-center">
                        {isWinner(business) ? (
                          <Trophy className="mx-auto h-4 w-4 text-yellow-500" />
                        ) : (
                          <span
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                              index === 0
                                ? 'bg-green-100 text-green-700'
                                : index === 1
                                  ? 'bg-gray-100 text-gray-600'
                                  : index === 2
                                    ? 'bg-orange-100 text-orange-600'
                                    : 'text-gray-400'
                            }`}
                          >
                            {index + 1}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Store className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">{business.namaProduk}</p>
                            <p className="text-xs text-gray-400 md:hidden">
                              {business.pemilik}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden text-gray-600 md:table-cell">
                        {business.pemilik}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-xs">
                          {business.nomorBooth || '-'}
                        </Badge>
                      </TableCell>
                      {business.scoreDetails.map((score) => (
                        <TableCell
                          key={score.kriteriaId}
                          className="text-center"
                        >
                          <div className="text-sm font-medium">
                            {score.nilai}
                          </div>
                          <div className="text-xs text-gray-400">
                            ({score.weightedScore.toFixed(1)})
                          </div>
                        </TableCell>
                      ))}
                      <TableCell className="text-center">
                        <span className="rounded bg-[#fba635]/10 px-2 py-1 text-sm font-bold text-[#fba635]">
                          {business.totalScore}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {isTopScorer(business) && (
                          <>
                            {pemenang && business.usahaId === pemenang.id ? (
                              <Badge className="bg-green-600 text-xs">
                                <Trophy className="mr-1 h-3 w-3" />
                                Pemenang
                              </Badge>
                            ) : pemenang ? null : canSetWinner ? (
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleSetWinner(business.usahaId)
                                }
                                disabled={settingWinner}
                                className="h-7 bg-yellow-500 px-2 text-xs hover:bg-yellow-600"
                              >
                                <Trophy className="mr-1 h-3 w-3" />
                                {settingWinner
                                  ? '...'
                                  : hasTie
                                    ? 'Pilih'
                                    : 'Set'}
                              </Button>
                            ) : !isEventSelesai ? (
                              index === 0 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs text-gray-400"
                                >
                                  Belum selesai
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

      {/* Compact Legend */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-gray-50 px-4 py-3 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-1">
          <Info className="h-3 w-3" />
          <span className="font-medium">Keterangan:</span>
        </div>
        <span>Nilai = mentah (0-100)</span>
        <span>|</span>
        <span>(x.x) = terbobot</span>
        <span>|</span>
        <span>Total = Σ terbobot</span>
      </div>
    </div>
  );
}
