'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMarketplaceStore } from '@/store';
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
import { Search, Calendar, MapPin, Users, X } from 'lucide-react';

import { EventCardSkeleton } from '@/components/common/skeletons';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function UserMarketplacePage() {
  // Use Zustand store with specific selectors
  const events = useMarketplaceStore((state) => state.events);
  const isLoading = useMarketplaceStore((state) => state.isLoading);
  const error = useMarketplaceStore((state) => state.error);
  const pagination = useMarketplaceStore((state) => state.pagination);
  const filters = useMarketplaceStore((state) => state.filters);
  const tahunAjaranOptions = useMarketplaceStore(
    (state) => state.tahunAjaranOptions
  );
  const statusOptions = useMarketplaceStore((state) => state.statusOptions);
  const fetchEvents = useMarketplaceStore((state) => state.fetchEvents);
  const setFilters = useMarketplaceStore((state) => state.setFilters);
  const setPagination = useMarketplaceStore((state) => state.setPagination);
  const resetFilters = useMarketplaceStore((state) => state.resetFilters);

  // Local states
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        setFilters({ search: localSearch });
        setPagination({ page: 1 });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, filters.search, setFilters, setPagination]);

  // Auto-fetch when filters or pagination changes
  useEffect(() => {
    fetchEvents().then(() => {
      setIsInitialLoad(false);
    });
  }, [pagination.page, pagination.limit, filters, fetchEvents]);

  const handlePageChange = (newPage) => {
    setPagination({ page: newPage });
  };

  const handlePageSizeChange = (newLimit) => {
    setPagination({ page: 1, limit: newLimit });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ [key]: value });
    setPagination({ page: 1 });
  };

  const handleReset = () => {
    setLocalSearch('');
    resetFilters();
    setPagination({ page: 1 });
  };

  const hasActiveFilters =
    localSearch || filters.semester || filters.tahunAjaran || filters.status;

  // Initial loading state (only on first load)
  if (isInitialLoad && isLoading) {
    return (
      <div className="container mx-auto mt-20 px-4 py-8">
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
      <div className="container mx-auto mt-20 px-4 py-8">
        <ErrorMessage
          title="Gagal Memuat Event"
          message={error}
          onRetry={fetchEvents}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-20 space-y-8 px-4 py-8">
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
      <Card className="overflow-hidden border-0 pt-0 shadow-sm">
        <div className="h-1 bg-gradient-to-r from-[#174c4e] to-[#fba635]" />
        <CardContent className="p-4 py-2">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari nama event..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="h-10 border-gray-200 bg-gray-50 pl-9 transition-all focus:bg-white dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            {/* Filter Selects */}
            <div className="flex flex-wrap gap-2">
              <Select
                value={filters.semester}
                onValueChange={(value) => handleFilterChange('semester', value)}
              >
                <SelectTrigger className="h-10 w-full min-w-[120px] border-gray-200 bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-800">
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
                <SelectTrigger className="h-10 w-full min-w-[130px] border-gray-200 bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-800">
                  <SelectValue placeholder="Tahun Ajaran" />
                </SelectTrigger>
                <SelectContent>
                  {!tahunAjaranOptions.length && (
                    <SelectItem disabled>Tidak ada tahun ajaran</SelectItem>
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
                <SelectTrigger className="h-10 w-full min-w-[110px] border-gray-200 bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-800">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {EVENT_STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Reset Button */}
              <Button
                onClick={handleReset}
                variant="ghost"
                size="sm"
                className="h-10 text-gray-500 hover:text-gray-700"
                disabled={!hasActiveFilters}
              >
                <X className="mr-1 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="relative">
        {/* Loading overlay for filter changes */}

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
                      <CardTitle className="line-clamp-2">
                        {event.nama}
                      </CardTitle>
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
    </div>
  );
}
