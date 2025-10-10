'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { marketplaceAPI } from '@/lib/api';
import {
  EVENT_STATUS_LABELS,
  EVENT_STATUS_COLORS,
  SEMESTER_OPTIONS,
} from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Calendar, MapPin, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMarketplacePage() {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    semester: '',
    tahunAjaran: '',
    status: '',
  });

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await marketplaceAPI.getEvents(filters);
      setEvents(response.data.events || response.data);
    } catch (error) {
      toast.error('Gagal memuat data event');
      console.error(error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    fetchEvents();
  };

  const handleReset = async () => {
    await setFilters((prev) => ({
      ...prev,
      search: '',
      semester: '',
      tahunAjaran: '',
      status: '',
    }));
    fetchEvents();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Kelola event bazaar dan marketplace
          </p>
        </div>
        <Button asChild className="bg-[#fba635] hover:bg-[#fdac58]">
          <Link href="/admin/marketplace/create">
            <Plus className="mr-2 h-5 w-5" />
            Buat Event Baru
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Event</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative w-full">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari event..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={filters.semester}
              onValueChange={(value) => handleFilterChange('semester', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                {SEMESTER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Tahun Ajaran (e.g., 2024/2025)"
              value={filters.tahunAjaran}
              onChange={(e) =>
                handleFilterChange('tahunAjaran', e.target.value)
              }
            />

            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EVENT_STATUS_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 flex w-full justify-end gap-2">
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
            <Button
              onClick={handleSearch}
              className="min-w-[120px] bg-[#fba635] font-bold hover:bg-[#fdac58]"
            >
              Cari
              <Search className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      {events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-gray-500">Belum ada event</p>
            <Button asChild className="bg-[#fba635] hover:bg-[#fdac58]">
              <Link href="/admin/marketplace/create">
                <Plus className="mr-2 h-5 w-5" />
                Buat Event Pertama
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link key={event.id} href={`/admin/marketplace/${event.id}`}>
              <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex items-start justify-between">
                    <Badge className={EVENT_STATUS_COLORS[event.status]}>
                      {EVENT_STATUS_LABELS[event.status]}
                    </Badge>
                    {event.terkunci && (
                      <Badge variant="outline" className="ml-2">
                        🔒 Terkunci
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2">{event.nama}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {event.deskripsi}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    {formatDate(event.tanggalPelaksanaan)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    {event.lokasi}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    {event._count?.usaha || 0} / {event.kuotaPeserta} Peserta
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {event.semester} {event.tahunAjaran}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
