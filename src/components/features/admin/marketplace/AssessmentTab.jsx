'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Award,
  Users,
  ClipboardList,
  Trophy,
  ChevronRight,
  Star,
  // Target,
  Medal,
} from 'lucide-react';

export default function AssessmentTab({ event }) {
  const categories = event.kategoriPenilaian || [];
  // const totalPenilai = categories.reduce(
  //   (acc, cat) => acc + (cat.penilai?.length || 0),
  //   0
  // );
  // const totalKriteria = categories.reduce(
  //   (acc, cat) => acc + (cat.kriteria?.length || 0),
  //   0
  // );
  // const categoriesWithWinner = categories.filter((cat) => cat.pemenang).length;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      {/* {categories.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                Kategori
              </span>
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {categories.length}
            </span>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                Total Penilai
              </span>
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalPenilai}
            </span>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                Total Kriteria
              </span>
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalKriteria}
            </span>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                Pemenang
              </span>
              <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
                <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {categoriesWithWinner}/{categories.length}
            </span>
          </div>
        </div>
      )} */}

      {/* Categories List */}
      {categories.length === 0 ? (
        <Card className="overflow-hidden rounded-2xl border-0 shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
              <Award className="h-10 w-10 text-gray-400" />
            </div>
            <p className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200">
              Belum ada kategori penilaian
            </p>
            <p className="text-sm text-gray-500">
              Tambahkan kategori penilaian untuk memulai evaluasi peserta
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((kategori) => (
            <Card
              key={kategori.id}
              className="group relative overflow-hidden rounded-2xl border-0 pt-0 shadow-md transition-all hover:shadow-lg"
            >
              {/* Winner Ribbon */}
              {kategori.pemenang && (
                <div className="absolute top-4 -right-8 z-10 rotate-45 bg-gradient-to-r from-yellow-500 to-amber-500 px-10 py-1 text-xs font-bold text-white shadow-md">
                  WINNER
                </div>
              )}

              {/* Header with gradient accent */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#174c4e]/10 to-[#fba635]/10" />
                <CardHeader className="relative pt-6 pb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#fba635] to-[#174c4e] text-white shadow-lg">
                      <Medal className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="mb-1 text-lg">
                        {kategori.nama}
                      </CardTitle>
                      {kategori.deskripsi && (
                        <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                          {kategori.deskripsi}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </div>

              <CardContent className="space-y-4 pt-0">
                {/* Penilai Section */}
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                  <div className="mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Penilai ({kategori.penilai?.length || 0})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {kategori.penilai?.length > 0 ? (
                      kategori.penilai.map((dosen) => (
                        <Badge
                          key={dosen.id}
                          variant="secondary"
                          className="bg-white px-3 py-1 font-normal shadow-sm dark:bg-gray-700"
                        >
                          {dosen.nama}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">
                        Belum ada penilai
                      </span>
                    )}
                  </div>
                </div>

                {/* Kriteria Section */}
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                  <div className="mb-3 flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Kriteria Penilaian
                    </span>
                  </div>
                  <div className="space-y-2">
                    {kategori.kriteria?.length > 0 ? (
                      kategori.kriteria.map((kriteria) => (
                        <div
                          key={kriteria.id}
                          className="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm dark:bg-gray-700"
                        >
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {kriteria.nama}
                          </span>
                          <Badge className="bg-[#174c4e] text-white">
                            {kriteria.bobot}%
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">
                        Belum ada kriteria
                      </span>
                    )}
                  </div>
                </div>

                {/* Winner Showcase */}
                {kategori.pemenang && (
                  <div className="rounded-xl border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 p-4 dark:border-yellow-800 dark:from-yellow-900/20 dark:to-amber-900/20">
                    <div className="mb-2 flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      <span className="text-sm font-bold text-yellow-700 uppercase dark:text-yellow-400">
                        Pemenang Kategori
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-200 dark:bg-yellow-800">
                        <Star className="h-5 w-5 text-yellow-700 dark:text-yellow-300" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {kategori.pemenang.namaProduk}
                        </p>
                        <p className="text-xs text-gray-500">
                          Booth: {kategori.pemenang.nomorBooth || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  asChild
                  className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <Link
                    href={`/admin/marketplace/${event.id}/assessment/${kategori.id}`}
                    className="flex items-center justify-center gap-2"
                  >
                    Lihat Detail Penilaian
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
