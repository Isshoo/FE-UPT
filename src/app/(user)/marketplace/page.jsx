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
import PaginationControls from '@/components/ui/pagination-controls';
import { Search, Calendar, MapPin, Users, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserMarketplacePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    semester: '',
    tahunAjaran: '',
    status: '',
  });

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await marketplaceAPI.getEvents({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
      // Filter out DRAFT events for non-admin users
      const publicEvents = (response.data.events || response.data).filter(
        (event) => event.status !== 'DRAFT'
      );
      setEvents(publicEvents);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || 0,
      }));
    } catch (error) {
      toast.error('Gagal memuat data event');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchEvents();
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newLimit) => {
    setPagination({ page: 1, limit: newLimit, total: 0, totalPages: 0 });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      semester: '',
      tahunAjaran: '',
      status: '',
    });
    setTimeout(() => fetchEvents(), 100);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#fba635]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* Hero Section */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">
          Event <span className="text-[#fba635]">Marketplace</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Ikuti berbagai event bazaar dan marketplace untuk mempromosikan produk
          Anda dan mengembangkan usaha
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Event Terbuka
                </p>
                <p className="text-2xl font-bold">
                  {events.filter((e) => e.status === 'TERBUKA').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Event Berlangsung
                </p>
                <p className="text-2xl font-bold">
                  {events.filter((e) => e.status === 'BERLANGSUNG').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-300" />
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
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-1">
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
                <SelectItem value="TERBUKA">Terbuka</SelectItem>
                <SelectItem value="PERSIAPAN">Persiapan</SelectItem>
                <SelectItem value="BERLANGSUNG">Berlangsung</SelectItem>
                <SelectItem value="SELESAI">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 flex w-full justify-end gap-2">
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
            <Button
              onClick={handleSearch}
              className="bg-[#fba635] hover:bg-[#fdac58]"
            >
              <Search className="mr-2 h-4 w-4" />
              Cari
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      {events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="mb-4 h-16 w-16 text-gray-400" />
            <p className="mb-2 text-lg text-gray-500">
              Belum ada event tersedia
            </p>
            <p className="text-sm text-gray-400">
              Event baru akan segera hadir. Pantau terus!
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link key={event.id} href={`/marketplace/${event.id}`}>
                <Card className="h-full cursor-pointer transition-all hover:scale-105 hover:shadow-xl">
                  <CardHeader>
                    <div className="mb-2 flex items-start justify-between">
                      <Badge className={EVENT_STATUS_COLORS[event.status]}>
                        {EVENT_STATUS_LABELS[event.status]}
                      </Badge>
                      {event.status === 'TERBUKA' && (
                        <Badge className="animate-pulse bg-green-500 text-white">
                          Daftar Sekarang!
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2">{event.nama}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {event.deskripsi}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>{formatDate(event.tanggalPelaksanaan)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="line-clamp-1">{event.lokasi}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4 flex-shrink-0" />
                      <span>
                        {event._count?.usaha || 0} / {event.kuotaPeserta}{' '}
                        Peserta
                      </span>
                    </div>
                    <div className="border-t pt-3">
                      <p className="text-xs text-gray-500">
                        {event.semester} {event.tahunAjaran}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {/* Add Pagination */}
          <PaginationControls
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            pageSize={pagination.limit}
            totalItems={pagination.total}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[6, 12, 24, 48]}
          />
        </>
      )}
    </div>
  );
}
