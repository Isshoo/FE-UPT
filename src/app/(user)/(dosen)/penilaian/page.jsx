'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { assessmentAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, Calendar, ClipboardList, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PenilaianPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchAssignedCategories();
  }, []);

  const fetchAssignedCategories = async () => {
    try {
      const response = await assessmentAPI.getCategoriesByDosen();
      setCategories(response.data);
    } catch (error) {
      toast.error('Gagal memuat data penilaian');
      console.error(error);
    }
  };

  // Group categories by event
  const groupedByEvent = categories.reduce((acc, category) => {
    const eventId = category.event.id;
    if (!acc[eventId]) {
      acc[eventId] = {
        event: category.event,
        categories: [],
      };
    }
    acc[eventId].categories.push(category);
    return acc;
  }, {});

  const events = Object.values(groupedByEvent);

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">Penilaian</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Kelola penilaian untuk kategori yang Anda nilai
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="py-4 sm:block">
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
              <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                <Award className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Kategori
                </p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hidden py-4 sm:block">
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                <ClipboardList className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Event Aktif
                </p>
                <p className="text-2xl font-bold">
                  {
                    events.filter((e) => e.event.status === 'BERLANGSUNG')
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <Card className="gap-3">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="mb-4 h-16 w-16 text-gray-400" />
            <p className="mb-2 text-lg text-gray-500">
              Belum ada penugasan penilaian
            </p>
            <p className="text-sm text-gray-400">
              Admin akan menugaskan Anda sebagai penilai untuk event tertentu
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {events.map(({ event, categories }) => (
            <Card key={event.id} className="gap-3">
              <CardHeader>
                <div className="flex flex-col items-start justify-between md:flex-row">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2 space-y-1">
                      <CardTitle>{event.nama}</CardTitle>
                      <Badge
                        variant={
                          event.status === 'BERLANGSUNG'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <div className="mb-2 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(event.tanggalPelaksanaan)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        {categories.length} Kategori Penilaian
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge key={category.id} variant="outline">
                        {category.nama}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href={`/penilaian/${event.id}`}>
                    Lihat Detail
                    <ChevronRight className="ml-2 h-4 w-4" />
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
