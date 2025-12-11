'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import {
  Search,
  Calendar,
  MapPin,
  X,
  Info,
  ArrowRight,
  Filter,
  Image as ImageIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';

// import { EventCardSkeleton } from '@/components/common/skeletons';
// import ErrorMessage from '@/components/ui/ErrorMessage';

export default function UserMarketplacePage() {
  // Store
  const events = useMarketplaceStore((state) => state.events);
  const isLoading = useMarketplaceStore((state) => state.isLoading);
  // const error = useMarketplaceStore((state) => state.error);
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

  // Local state
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        setFilters({ search: localSearch });
        setPagination({ page: 1 });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, filters.search, setFilters, setPagination]);

  // Fetch data
  useEffect(() => {
    fetchEvents().then(() => {
      setIsInitialLoad(false);
    });
  }, [pagination.page, pagination.limit, filters, fetchEvents]);

  // Handlers
  const handlePageChange = (newPage) => setPagination({ page: newPage });
  const handlePageSizeChange = (newLimit) =>
    setPagination({ page: 1, limit: newLimit });
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

  // Loading State (First Load Only)
  // if (isInitialLoad && isLoading) {
  //   return (
  //     <div className="container mx-auto mt-20 px-4 py-8">
  //       <div className="mb-8 space-y-4">
  //         <div className="h-12 w-3/4 animate-pulse rounded-lg bg-gray-200 md:w-1/2 dark:bg-gray-800"></div>
  //         <div className="h-6 w-full animate-pulse rounded bg-gray-200 md:w-2/3 dark:bg-gray-800"></div>
  //       </div>
  //       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  //         <EventCardSkeleton count={6} />
  //       </div>
  //     </div>
  //   );
  // }

  // // Error State
  // if (error) {
  //   return (
  //     <div className="container mx-auto mt-20 px-4 py-8">
  //       <ErrorMessage
  //         title="Gagal Memuat Event"
  //         message={error}
  //         onRetry={fetchEvents}
  //       />
  //     </div>
  //   );
  // }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute inset-0 h-full w-full opacity-30 dark:opacity-20">
        <Image
          src="/images/beranda.jpg"
          alt="Hero Background"
          fill
          className="object-cover"
        />
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-[#fba635]/20 blur-3xl" />
        <div className="absolute right-10 bottom-20 h-72 w-72 rounded-full bg-[#174c4e]/20 blur-3xl" />
      </div>

      <div className="container mx-auto mt-0 px-4 pt-30 pb-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center"
        >
          <Badge
            variant="outline"
            className="mb-4 border-[#fba635] text-[#fba635]"
          >
            UPT Pusat Inovasi dan Kewirausahaan
          </Badge>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl dark:text-white">
            Temukan Event <br />
            <span className="bg-gradient-to-r from-[#174c4e] to-[#fba635] bg-clip-text text-transparent">
              Marketplace Terbaik
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Platform terintegrasi untuk mengembangkan potensi wirausaha Anda
            melalui berbagai event menarik dan inspiratif.
          </p>
        </motion.div>

        {/* Floating Filter Bar */}
        <div className="sticky top-20 z-30 -mx-4 mb-8 items-center px-4 md:static md:mx-0 md:px-0">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl border border-white/20 bg-white/80 p-4 shadow-lg backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari event..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="h-12 rounded-xl border-gray-200 bg-white/50 pl-10 text-base transition-all focus:border-[#fba635]/50 focus:bg-white focus:ring-4 focus:ring-[#fba635]/10 dark:border-gray-700 dark:bg-gray-800 dark:focus:bg-gray-900"
                />
              </div>

              {/* Filter Toggle Mobile */}
              <Button
                variant="outline"
                className="h-12 md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>

              {/* Desktop Filters / Mobile Collapsible */}
              <div
                className={`${showFilters ? 'flex' : 'hidden'} flex-col items-center gap-2 md:flex md:flex-row`}
              >
                <Select
                  value={filters.semester}
                  onValueChange={(value) =>
                    handleFilterChange('semester', value)
                  }
                >
                  <SelectTrigger className="h-12 w-full min-w-[140px] rounded-xl border-gray-200 bg-white/50 dark:border-gray-700 dark:bg-gray-800">
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
                  <SelectTrigger className="h-12 w-full min-w-[140px] rounded-xl border-gray-200 bg-white/50 dark:border-gray-700 dark:bg-gray-800">
                    <SelectValue placeholder="Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    {!tahunAjaranOptions.length && (
                      <SelectItem disabled>Tidak ada tahun</SelectItem>
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
                  <SelectTrigger className="h-12 w-full min-w-[140px] rounded-xl border-gray-200 bg-white/50 dark:border-gray-700 dark:bg-gray-800">
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

                <Button
                  onClick={handleReset}
                  variant="ghost"
                  className="h-12 px-4 text-gray-500 hover:text-red-500"
                  disabled={!hasActiveFilters}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content Area */}
        <div className="relative min-h-[400px]">
          {/* Loading Overlay */}
          {isLoading && !isInitialLoad && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/50 backdrop-blur-sm dark:bg-gray-950/50">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#fba635] border-t-transparent"></div>
            </div>
          )}

          {events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white/50 py-20 text-center dark:border-gray-700 dark:bg-gray-900/50"
            >
              <div className="mb-6 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Tidak ada event ditemukan
              </h3>
              <p className="text-gray-500">
                Coba sesuaikan filter pencarian Anda
              </p>
              {hasActiveFilters && (
                <Button
                  onClick={handleReset}
                  variant="link"
                  className="mt-4 text-[#fba635]"
                >
                  Reset Filter
                </Button>
              )}
            </motion.div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.05 }}
                  >
                    <Link href={`/marketplace/${event.id}`}>
                      <Card className="group relative h-full overflow-hidden rounded-3xl border-0 bg-white pt-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-900">
                        {/* Event Cover Image */}
                        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                          {event.gambarCover ? (
                            <Image
                              src={event.gambarCover}
                              alt={event.nama}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#174c4e]/10 to-[#fba635]/10">
                              <ImageIcon className="h-12 w-12 text-[#174c4e]/20" />
                            </div>
                          )}
                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                          {/* Status Badge */}
                          <div className="absolute top-4 right-4">
                            <Badge
                              className={`${
                                EVENT_STATUS_COLORS[event.status]
                              } rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase shadow-sm`}
                            >
                              {EVENT_STATUS_LABELS[event.status]}
                            </Badge>
                          </div>

                          {/* Date Badge */}
                          <div className="absolute bottom-4 left-4 flex flex-col items-center rounded-xl bg-white/90 p-2 text-center text-xs font-bold shadow-sm backdrop-blur-sm dark:bg-gray-900/90">
                            <span className="text-lg leading-none text-gray-900 dark:text-white">
                              {formatDate(event.tanggalPelaksanaan, 'dd')}
                            </span>
                            <span className="text-[10px] text-[#fba635] uppercase">
                              {formatDate(event.tanggalPelaksanaan, 'MMM')}
                            </span>
                          </div>
                        </div>

                        <CardHeader className="pb-2">
                          <CardTitle className="mb-2 line-clamp-2 truncate text-xl leading-tight font-bold transition-colors group-hover:text-[#fba635]">
                            {event.nama}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 truncate">
                            {event.deskripsi}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4 overflow-hidden align-bottom">
                          {/* Info Items */}
                          <div className="space-y-2 overflow-hidden">
                            <div className="line-clamp-2 flex w-full items-center gap-2 truncate overflow-hidden text-sm text-gray-600 dark:text-gray-400">
                              <MapPin className="h-4 w-4 text-[#fba635]" />
                              <span className="truncate overflow-hidden font-medium text-ellipsis whitespace-nowrap">
                                {event.lokasi}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Info className="h-4 w-4 text-[#174c4e]" />
                              <span>
                                {event.semester} {event.tahunAjaran}
                              </span>
                            </div>
                          </div>

                          {/* Quota Progress */}
                          <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
                            <div className="mb-2 flex items-center justify-between text-xs">
                              <span className="font-medium text-gray-600 dark:text-gray-400">
                                Kuota Peserta
                              </span>
                              <span className="font-bold text-[#174c4e] dark:text-[#fba635]">
                                {event._count?.usaha || 0} /{' '}
                                {event.kuotaPeserta}
                              </span>
                            </div>
                            {/* Custom Progress Bar */}
                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#174c4e] to-[#fba635] transition-all duration-500"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    ((event._count?.usaha || 0) /
                                      event.kuotaPeserta) *
                                      100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Action Footer */}
                          <div className="flex items-center justify-end border-t border-gray-100 pt-3 dark:border-gray-800">
                            <span className="flex items-center text-sm font-medium text-[#fba635] transition-transform group-hover:translate-x-1">
                              Lihat Detail{' '}
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
