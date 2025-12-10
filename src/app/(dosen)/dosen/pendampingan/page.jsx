'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { assessmentAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Users, Search, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';
import PaginationControls from '@/components/ui/pagination-controls';
import EmptyState from '@/components/ui/EmptyState';

export default function PendampinganPage() {
  // Data states
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Filter & Pagination states
  const [filters, setFilters] = useState({
    search: '',
    eventId: 'ALL',
    status: 'ALL', // ALL, MENUNGGU, DISETUJUI
  });
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  // Unique Events for Filter
  const eventOptions = useMemo(() => {
    const events = businesses.map((b) => b.event);
    const uniqueEvents = Array.from(new Set(events.map((e) => e.id))).map(
      (id) => events.find((e) => e.id === id)
    );
    return uniqueEvents;
  }, [businesses]);

  useEffect(() => {
    fetchMentoredBusinesses();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Reset page when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, filters.eventId, filters.status]);

  const fetchMentoredBusinesses = async () => {
    try {
      setLoading(true);
      const response = await assessmentAPI.getMentoredBusinesses();
      setBusinesses(response.data || []);
    } catch (error) {
      toast.error('Gagal memuat data pendampingan');
      console.error(error);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  // Filter and Paginate Data
  const filteredData = useMemo(() => {
    return businesses.filter((item) => {
      const matchesSearch =
        item.namaProduk.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.pemilik.nama.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesEvent =
        filters.eventId === 'ALL' || item.event.id === filters.eventId;

      const matchesStatus =
        filters.status === 'ALL' ||
        (filters.status === 'DISETUJUI' ? item.disetujui : !item.disetujui);

      return matchesSearch && matchesEvent && matchesStatus;
    });
  }, [businesses, debouncedSearch, filters]);

  const paginatedData = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    return filteredData.slice(start, end);
  }, [filteredData, pagination]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      eventId: 'ALL',
      status: 'ALL',
    });
    setDebouncedSearch('');
  };

  const hasActiveFilters =
    filters.search || filters.eventId !== 'ALL' || filters.status !== 'ALL';

  // Initial loading state
  if (isInitialLoad && loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#fba635]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold">Pendampingan</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Kelola dan setujui usaha mahasiswa yang Anda dampingi
        </p>
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
                placeholder="Cari nama usaha atau mahasiswa..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="h-10 border-gray-200 bg-gray-50 pl-9 transition-all focus:bg-white dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            {/* Filter Selects */}
            <div className="flex flex-wrap gap-2">
              <Select
                value={filters.eventId}
                onValueChange={(value) => handleFilterChange('eventId', value)}
              >
                <SelectTrigger className="h-10 w-full min-w-[150px] border-gray-200 bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-800">
                  <SelectValue placeholder="Pilih Event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Event</SelectItem>
                  {eventOptions.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="h-10 w-full min-w-[130px] border-gray-200 bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-800">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Status</SelectItem>
                  <SelectItem value="MENUNGGU">Menunggu</SelectItem>
                  <SelectItem value="DISETUJUI">Disetujui</SelectItem>
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

      {/* Businesses Table */}
      <Card className="relative gap-2">
        {/* Loading overlay for filter changes */}
        {loading && !isInitialLoad && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px] dark:bg-gray-900/60">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#fba635] border-t-transparent"></div>
          </div>
        )}

        <CardHeader>
          <CardTitle>Daftar Usaha Bimbingan ({filteredData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6">
              <EmptyState
                icon={Users}
                title="Tidak Ada Data"
                description={
                  hasActiveFilters
                    ? 'Tidak ada usaha bimbingan yang sesuai dengan filter.'
                    : 'Belum ada usaha mahasiswa yang Anda dampingi.'
                }
              />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">No</TableHead>
                      <TableHead>Nama Usaha / Produk</TableHead>
                      <TableHead>Event & Tahun</TableHead>
                      <TableHead>Mahasiswa (Pemilik)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((business, index) => (
                      <TableRow key={business.id}>
                        <TableCell>
                          {(pagination.page - 1) * pagination.limit + index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {business.namaProduk}
                          <div className="text-xs text-gray-500">
                            {business.kategoriProduk}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <span className="font-medium">
                              {business.event.nama}
                            </span>
                            <span className="text-xs text-gray-500">
                              {business.event.tahunAjaran}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <span className="font-medium">
                              {business.pemilik.nama}
                            </span>
                            <span className="text-xs text-gray-500">
                              {business.pemilik.prodi?.nama || '-'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={business.disetujui ? 'success' : 'warning'}
                            className={
                              business.disetujui
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            }
                          >
                            {business.disetujui ? 'Disetujui' : 'Menunggu'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Button
                              asChild
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <Link
                                href={`/dosen/pendampingan/${business.event.id}`}
                              >
                                <Eye className="h-4 w-4 text-gray-500" />
                                <span className="sr-only">Lihat Detail</span>
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <PaginationControls
                currentPage={pagination.page}
                totalPages={Math.ceil(filteredData.length / pagination.limit)}
                pageSize={pagination.limit}
                totalItems={filteredData.length}
                onPageChange={(page) =>
                  setPagination((prev) => ({ ...prev, page }))
                }
                onPageSizeChange={(limit) =>
                  setPagination((prev) => ({ ...prev, limit, page: 1 }))
                }
                pageSizeOptions={[5, 10, 20]}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
