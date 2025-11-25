'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Users, ClipboardList, Trophy } from 'lucide-react';

export default function AssessmentTab({ event }) {
  const categories = event.kategoriPenilaian || [];

  return (
    <div className="space-y-6">
      {categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="mb-4 h-12 w-12 text-gray-400" />
            <p className="text-gray-500">Belum ada kategori penilaian</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {categories.map((kategori) => (
            <Card
              key={kategori.id}
              className="gap-3 transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-[#fba635]" />
                      {kategori.nama}
                    </CardTitle>
                    {kategori.deskripsi && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {kategori.deskripsi}
                      </p>
                    )}
                  </div>
                  {kategori.pemenang && (
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      <Trophy className="mr-1 h-3 w-3" />
                      Ada Pemenang
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex h-full flex-col gap-4">
                {/* Penilai */}
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    <span className="font-semibold">Penilai:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {kategori.penilai?.map((dosen) => (
                      <Badge key={dosen.id} variant="outline">
                        {dosen.nama}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Kriteria */}
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <ClipboardList className="h-4 w-4" />
                    <span className="font-semibold">Kriteria:</span>
                  </div>
                  <div className="space-y-1">
                    {kategori.kriteria?.map((kriteria) => (
                      <div
                        key={kriteria.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>{kriteria.nama}</span>
                        <Badge variant="secondary">{kriteria.bobot}%</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pemenang */}
                {kategori.pemenang && (
                  <div className="border-t pt-3">
                    <p className="mb-1 text-sm font-semibold text-[#fba635]">
                      🏆 Pemenang
                    </p>
                    <p className="font-semibold">
                      {kategori.pemenang.namaProduk}
                    </p>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex w-full flex-1 items-end">
                  <Button asChild className="w-full" variant="outline">
                    <Link
                      href={`/admin/marketplace/${event.id}/assessment/${kategori.id}`}
                    >
                      Lihat Detail Penilaian
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
