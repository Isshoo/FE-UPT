'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { assessmentAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PendampinganPage() {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    fetchMentoredBusinesses();
  }, []);

  const fetchMentoredBusinesses = async () => {
    try {
      const response = await assessmentAPI.getMentoredBusinesses();
      setBusinesses(response.data);
    } catch (error) {
      toast.error('Gagal memuat data pendampingan');
      console.error(error);
    }
  };

  // Group businesses by event
  const groupedByEvent = businesses.reduce((acc, business) => {
    const eventId = business.event.id;
    if (!acc[eventId]) {
      acc[eventId] = {
        event: business.event,
        businesses: [],
      };
    }
    acc[eventId].businesses.push(business);
    return acc;
  }, {});

  const events = Object.values(groupedByEvent);

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">Pendampingan</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Kelola dan setujui usaha mahasiswa yang Anda dampingi
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="py-4">
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Event
                </p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hidden py-4 sm:block">
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                <Users className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Usaha Bimbingan
                </p>
                <p className="text-2xl font-bold">{businesses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hidden py-4 sm:block">
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900">
                <Users className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Menunggu Persetujuan
                </p>
                <p className="text-2xl font-bold">
                  {businesses.filter((b) => !b.disetujui).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <Card className="pt-6 pb-5">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="mb-4 h-16 w-16 text-gray-400" />
            <p className="mb-2 text-lg text-gray-500">
              Belum ada usaha mahasiswa yang Anda dampingi
            </p>
            <p className="text-sm text-gray-400">
              Usaha mahasiswa yang memilih Anda sebagai pembimbing akan muncul
              di sini
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {events.map(({ event, businesses }) => (
            <Card key={event.id} className="pt-6 pb-5">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2">{event.nama}</CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(event.tanggalPelaksanaan)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {businesses.length} Usaha
                      </div>
                      <Badge
                        variant={
                          businesses.some((b) => !b.disetujui)
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {businesses.filter((b) => !b.disetujui).length} Menunggu
                        Persetujuan
                      </Badge>
                    </div>
                  </div>
                  <Button asChild>
                    <Link href={`/pendampingan/${event.id}`}>
                      Lihat Detail
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
