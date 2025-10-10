'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { assessmentAPI, marketplaceAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Award, ClipboardList, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store';

export default function PenilaianEventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId;
  const { user } = useAuthStore();

  const [event, setEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventResponse, categoriesResponse, getCategoriesByDosenResponse] =
        await Promise.all([
          marketplaceAPI.getEventById(eventId),
          assessmentAPI.getCategoriesByEvent(eventId),
          assessmentAPI.getCategoriesByDosen(),
        ]);

      setEvent(eventResponse.data);

      // Filter only categories where current user is assessor
      // This is already filtered by backend getCategoriesByDosen, but we fetch all here

      // TODO: fix this
      // So we need to filter client-side
      const filteredCategories = categoriesResponse.data.filter((category) => {
        return getCategoriesByDosenResponse.data.some(
          (dosenCategory) => dosenCategory.id === category.id
        );
      });
      setCategories(filteredCategories);
    } catch (error) {
      toast.error('Gagal memuat data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#fba635]"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <p className="mb-4 text-gray-500">Event tidak ditemukan</p>
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
          onClick={() => router.push('/penilaian')}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>

        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold">{event.nama}</h1>
            <Badge
              variant={event.status === 'BERLANGSUNG' ? 'default' : 'secondary'}
            >
              {event.status}
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola penilaian untuk kategori yang Anda nilai
          </p>
        </div>
      </div>

      {/* Info Alert */}
      {!canAssess && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              ⚠️ Penilaian hanya dapat dilakukan saat event sedang berlangsung
            </p>
          </CardContent>
        </Card>
      )}

      {canAssess && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardContent className="pt-6">
            <p className="text-sm text-green-800 dark:text-green-300">
              ✅ Event sedang berlangsung. Anda dapat melakukan penilaian
              sekarang!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Event Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tanggal Pelaksanaan
              </p>
              <p className="font-semibold">
                {formatDate(event.tanggalPelaksanaan)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lokasi</p>
              <p className="font-semibold">{event.lokasi}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Kategori
              </p>
              <p className="font-semibold">{categories.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Kategori Penilaian</h2>

        {categories.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Award className="mb-4 h-16 w-16 text-gray-400" />
              <p className="text-gray-500">
                Anda belum ditugaskan untuk menilai kategori apapun
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="transition-shadow hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-[#fba635]" />
                        {category.nama}
                      </CardTitle>
                      {category.deskripsi && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {category.deskripsi}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Kriteria */}
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <ClipboardList className="h-4 w-4" />
                      <span className="font-semibold">
                        Kriteria ({category.kriteria?.length || 0}):
                      </span>
                    </div>
                    <div className="space-y-1">
                      {category.kriteria?.slice(0, 3).map((kriteria) => (
                        <div
                          key={kriteria.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{kriteria.nama}</span>
                          <Badge variant="secondary">{kriteria.bobot}%</Badge>
                        </div>
                      ))}
                      {category.kriteria?.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{category.kriteria.length - 3} kriteria lainnya
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button asChild className="w-full" disabled={!canAssess}>
                    <Link href={`/penilaian/${eventId}/${category.id}`}>
                      {canAssess ? 'Mulai Penilaian' : 'Lihat Detail'}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
