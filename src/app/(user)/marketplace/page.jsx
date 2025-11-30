'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { marketplaceAPI } from '@/lib/api';
import { EVENT_STATUS_LABELS, SEMESTER_OPTIONS } from '@/lib/constants/labels';
import { EVENT_STATUS_COLORS } from '@/lib/constants/colors';
import { formatDate } from '@/lib/utils/date';
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
import {
  Search,
  Calendar,
  MapPin,
  Users,
  // TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

import { EventCardSkeleton } from '@/components/common/skeletons';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function UserMarketplacePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const [tahunAjaranOptions, setTahunAjaranOptions] = useState([]);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
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

      // Extract unique tahun ajaran from events
      const uniqueTahunAjaran = [
        ...new Set(
          publicEvents.map((event) => event.tahunAjaran).filter(Boolean)
        ),
      ].sort((a, b) => {
        // Sort descending (newest first)
        const yearA = parseInt(a.split('/')[0]);
        const yearB = parseInt(b.split('/')[0]);
        return yearB - yearA;
      });

      setTahunAjaranOptions(uniqueTahunAjaran);

      setPagination((prev) => ({
        ...prev,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || 0,
      }));
    } catch (error) {
      toast.error('Gagal memuat data event');
      setError(error.message);
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

  // Ganti bagian loading
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="mb-6 flex gap-4">
          <div className="h-10 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-10 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <EventCardSkeleton count={6} />
        </div>
      </div>
    );
  }

  // Ganti bagian error
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage
          title="Gagal Memuat Event"
          message={error}
          onRetry={fetchEvents}
        />
      </div>
    );
  }

  // Ganti bagian empty state
  if (events.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold">Marketplace</h1>
        <p className="mb-6 text-gray-600">Daftar event marketplace/bazaar</p>
        <EmptyState
          icon={Calendar}
          title="Belum Ada Event"
          description="Belum ada event marketplace yang tersedia saat ini. Silakan cek kembali nanti."
        />
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
      {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:grid-cols-3">
        <Card className="gap-2 py-4">
          <CardContent className="">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Terbuka
                </p>
                <p className="text-2xl font-bold">
                  {events.filter((e) => e.status === 'TERBUKA').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hidden gap-2 py-4 sm:block">
          <CardContent className="">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Berlangsung
                </p>
                <p className="text-2xl font-bold">
                  {events.filter((e) => e.status === 'BERLANGSUNG').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hidden gap-2 py-4 sm:block">
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
      </div> */}

      {/* Filters */}
      <Card className="gap-2 pt-5 pb-6">
        <CardContent className="flex flex-col gap-3 md:flex-row">
          <div className="flex w-full flex-1 flex-col gap-3 md:flex-row">
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <div className="relative w-full">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari event..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Select
                value={filters.semester}
                onValueChange={(value) => handleFilterChange('semester', value)}
              >
                <SelectTrigger className="w-full min-w-[110px]">
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
              <Select
                value={filters.tahunAjaran}
                onValueChange={(value) =>
                  handleFilterChange('tahunAjaran', value)
                }
              >
                <SelectTrigger className="w-full min-w-[140px]">
                  <SelectValue placeholder="Tahun Ajaran" />
                </SelectTrigger>
                <SelectContent>
                  {!tahunAjaranOptions.length && (
                    <SelectItem disabled>
                      Tidak ada tahun ajaran tersedia
                    </SelectItem>
                  )}
                  {tahunAjaranOptions?.map((tahun) => (
                    <SelectItem key={tahun} value={tahun}>
                      {tahun}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="w-full min-w-[110px]">
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
          </div>

          <div className="flex justify-end gap-2">
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
        <div>
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
                        Kuota {': '}
                        {event.kuotaPeserta} Peserta
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
        </div>
      )}
    </div>
  );
}
