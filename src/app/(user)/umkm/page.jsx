'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { umkmAPI } from '@/lib/api';
import {
  KATEGORI_USAHA,
  UMKM_STAGE_NAMES,
  UMKM_STAGE_STATUS_LABELS,
} from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PaginationControls from '@/components/ui/pagination-controls';
import { Briefcase, Search, TrendingUp, Building2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { CardSkeleton } from '@/components/common/skeletons';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { Store } from 'lucide-react';

export default function UmkmPage() {
  const [umkms, setUmkms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    kategori: '',
    tahap: '',
  });

  useEffect(() => {
    fetchUmkms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit]);

  const fetchUmkms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await umkmAPI.getUmkms({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
      setUmkms(response.data.umkms || response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || 1,
      }));
    } catch (error) {
      toast.error('Gagal memuat data UMKM');
      setError(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchData();
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
      kategori: '',
      tahap: '',
    });
    setTimeout(() => fetchUmkms(), 100);
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="mb-6 flex gap-4">
          <div className="h-10 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-10 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton count={6} />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage
          title="Gagal Memuat UMKM"
          message={error}
          onRetry={fetchUmkms}
        />
      </div>
    );
  }

  // Empty state
  if (umkms.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold">UMKM Binaan</h1>
        <p className="mb-6 text-gray-600">Daftar UMKM yang terdaftar</p>
        <EmptyState
          icon={Store}
          title="Belum Ada UMKM"
          description="Belum ada UMKM binaan yang terdaftar saat ini."
        />
      </div>
    );
  }
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* Hero Section */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">
          UMKM <span className="text-[#fba635]">Binaan</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Daftar UMKM yang sedang mengikuti program pembinaan UPT-PIK
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5">
        <Card className="gap-2 py-4">
          <CardContent className="">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total UMKM
                </p>
                <p className="text-2xl font-bold">{umkms.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {[1, 2, 3, 4].map((tahap) => (
          <Card key={tahap} className="hidden gap-2 py-4 sm:block">
            <CardContent className="">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-[#fba635]/10 p-3">
                  <TrendingUp className="h-6 w-6 text-[#fba635]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {UMKM_STAGE_NAMES[tahap]}
                  </p>
                  <p className="text-2xl font-bold">
                    {umkms.filter((u) => u.tahapSaatIni === tahap).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="gap-2 pt-6 pb-6">
        <CardContent>
          <div className="flex flex-col items-center gap-3 md:flex-row">
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <div className="relative w-full">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari UMKM..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-3">
                <Select
                  value={filters.kategori}
                  onValueChange={(value) =>
                    handleFilterChange('kategori', value)
                  }
                >
                  <SelectTrigger className="w-full min-w-[104px] sm:w-auto">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {KATEGORI_USAHA.map((kategori) => (
                      <SelectItem key={kategori} value={kategori}>
                        {kategori}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.tahap}
                  onValueChange={(value) => handleFilterChange('tahap', value)}
                >
                  <SelectTrigger className="w-full min-w-[104px] sm:w-auto">
                    <SelectValue placeholder="Tahap" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(UMKM_STAGE_NAMES).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        Tahap {key}: {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex w-full justify-end gap-3 md:w-auto">
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
          </div>
        </CardContent>
      </Card>

      {/* UMKM List */}
      {umkms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="mb-4 h-16 w-16 text-gray-400" />
            <p className="mb-2 text-lg text-gray-500">
              Belum ada UMKM terdaftar
            </p>
            <p className="text-sm text-gray-400">
              UMKM yang terdaftar akan muncul di sini
            </p>
          </CardContent>
        </Card>
      ) : (
        <div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {umkms.map((umkm) => (
              <Link key={umkm.id} href={`/umkm/${umkm.id}`}>
                <Card className="h-full cursor-pointer transition-all hover:scale-105 hover:shadow-xl">
                  <CardHeader>
                    <div className="mb-2 flex items-start justify-between">
                      <Badge variant="outline">{umkm.kategori}</Badge>
                      <Badge>Tahap {umkm.tahapSaatIni}</Badge>
                    </div>
                    <CardTitle className="line-clamp-2">{umkm.nama}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {umkm.deskripsi}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Building2 className="h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-1">{umkm.namaPemilik}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-1">{umkm.alamat}</span>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <p className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                        Progress Tahap:
                      </p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((tahap) => {
                          const stage = umkm.tahap?.find(
                            (t) => t.tahap === tahap
                          );
                          const status = stage?.status || 'BELUM_DIMULAI';

                          return (
                            <div
                              key={tahap}
                              className={`h-2 flex-1 rounded ${
                                status === 'SELESAI'
                                  ? 'bg-green-500'
                                  : status === 'MENUNGGU_VALIDASI'
                                    ? 'bg-yellow-500'
                                    : status === 'SEDANG_PROSES'
                                      ? 'bg-blue-500'
                                      : 'bg-gray-200 dark:bg-gray-700'
                              }`}
                              title={`Tahap ${tahap}: ${UMKM_STAGE_STATUS_LABELS[status]}`}
                            />
                          );
                        })}
                      </div>
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
          />
        </div>
      )}
    </div>
  );
}
