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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Plus, Search, Calendar, MapPin, Users, X } from 'lucide-react';
import PaginationControls from '@/components/ui/pagination-controls';

import { exportAPI, downloadBlob } from '@/lib/api';
import EmptyState from '@/components/ui/EmptyState';

export default function AdminMarketplacePage() {
  // Use Zustand store with specific selectors
  const events = useMarketplaceStore((state) => state.events);
  const isLoading = useMarketplaceStore((state) => state.isLoading);
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

  // Local search state for debouncing
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
    fetchEvents({ includeDraft: true });
    setIsInitialLoad(false);
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

  const handleExportMarketplace = async (format) => {
    // Export dengan filter yang sedang aktif
    const response = await exportAPI.exportMarketplace(
      {
        status: filters.status,
        semester: filters.semester,
        tahunAjaran: filters.tahunAjaran,
      },
      format
    );
    const ext = format === 'pdf' ? 'pdf' : 'xlsx';
    const filename = `data-marketplace-${new Date().getTime()}.${ext}`;
    downloadBlob(response.data, filename);
  };

  const handleExportMarketplaceDetailed = async (format = 'excel') => {
    const response = await exportAPI.exportMarketplaceDetailed(
      {
        status: filters.status,
        semester: filters.semester,
        tahunAjaran: filters.tahunAjaran,
      },
      format
    );
    const ext = format === 'pdf' ? 'pdf' : 'xlsx';
    const filename = `data-marketplace-detail-${new Date().getTime()}.${ext}`;
    downloadBlob(response.data, filename);
  };

  if (isLoading && isInitialLoad) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#fba635]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Kelola event bazaar dan marketplace
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Ekspor Data
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleExportMarketplace('excel')}
                className="cursor-pointer"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                Export Ringkasan (Excel)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleExportMarketplace('pdf')}
                className="cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4 text-red-600" />
                Export Ringkasan (PDF)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleExportMarketplaceDetailed('excel')}
                className="cursor-pointer"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                Export Detail (Excel)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleExportMarketplaceDetailed('pdf')}
                className="cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4 text-red-600" />
                Export Detail (PDF)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button asChild className="">
            <Link href="/admin/marketplace/create">
              <Plus className="mr-2 h-5 w-5" />
              Buat Event Baru
            </Link>
          </Button>
        </div>
      </div>

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
        {isLoading && !isInitialLoad && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/60 backdrop-blur-[1px] dark:bg-gray-900/60">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#fba635] border-t-transparent"></div>
          </div>
        )}

        {events.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <EmptyState
                icon={Calendar}
                title="Belum Ada Event"
                description="Belum ada event marketplace yang tersedia saat ini. Silakan buat event baru."
              />
              <Button asChild className="bg-[#fba635] hover:bg-[#fdac58]">
                <Link href="/admin/marketplace/create">
                  <Plus className="mr-2 h-5 w-5" />
                  Buat Event Pertama
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div>
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
                      <CardTitle className="line-clamp-2">
                        {event.nama}
                      </CardTitle>
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
                        {event._count?.usaha || 0} / {event.kuotaPeserta}{' '}
                        Peserta
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {event.semester} {event.tahunAjaran}
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
