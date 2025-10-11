'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { umkmAPI } from '@/lib/api';
import { KATEGORI_USAHA, UMKM_STAGE_NAMES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PaginationControls from '@/components/ui/pagination-controls';
import {
  Search,
  Briefcase,
  CheckCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUmkmPage() {
  const [umkms, setUmkms] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
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
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [umkmsResponse, statsResponse] = await Promise.all([
        umkmAPI.getUmkms({
          ...filters,
          page: pagination.page,
          limit: pagination.limit,
        }),
        umkmAPI.getStatistics(),
      ]);

      setUmkms(umkmsResponse.data.umkms || umkmsResponse.data);
      setStats(statsResponse.data);
      setPagination((prev) => ({
        ...prev,
        total: umkmsResponse.pagination?.total || 0,
        totalPages: umkmsResponse.pagination?.totalPages || 1,
      }));
    } catch (error) {
      toast.error('Gagal memuat data');
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
    setTimeout(() => fetchData(), 100);
  };

  const getPendingValidationCount = () => {
    return umkms.filter((umkm) =>
      umkm.tahap?.some((stage) => stage.status === 'MENUNGGU_VALIDASI')
    ).length;
  };

  if (loading) {
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
        <h1 className="text-3xl font-bold">UMKM Binaan</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Kelola dan validasi UMKM yang mengikuti program pembinaan
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5">
        <Card className="gap-2 py-4">
          <CardHeader className="flex flex-row items-center justify-between pb-0">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total UMKM
            </CardTitle>
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-950">
              <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>

        {[1, 2, 3, 4].map((tahap) => (
          <Card key={tahap} className="gap-2 py-4">
            <CardHeader className="flex flex-row items-center justify-between pb-0">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {UMKM_STAGE_NAMES[tahap]}
              </CardTitle>
              <div className="rounded-lg bg-[#fba635]/10 p-2">
                <TrendingUp className="h-5 w-5 text-[#fba635]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats?.byStage?.[`tahap${tahap}`] || 0}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Validation Alert */}
      {getPendingValidationCount() > 0 && (
        <Card className="gap-2 border-yellow-200 bg-yellow-50 py-4 dark:border-yellow-800 dark:bg-yellow-950">
          <CardContent className="">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                Ada <strong>{getPendingValidationCount()} UMKM</strong> yang
                menunggu validasi
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="gap-2 pt-5 pb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filter UMKM</CardTitle>
        </CardHeader>
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

      {/* UMKM Table */}
      <Card className="gap-2">
        <CardHeader>
          <CardTitle>Daftar UMKM ({umkms.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {umkms.length === 0 ? (
            <div className="py-12 text-center">
              <Briefcase className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <p className="text-gray-500">Belum ada UMKM terdaftar</p>
            </div>
          ) : (
            <>
              <div className="w-[260] overflow-x-auto sm:w-[448] md:w-[655] lg:w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Nama UMKM</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead className="text-center">Tahap 1</TableHead>
                      <TableHead className="text-center">Tahap 2</TableHead>
                      <TableHead className="text-center">Tahap 3</TableHead>
                      <TableHead className="text-center">Tahap 4</TableHead>
                      <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {umkms.map((umkm, index) => {
                      const hasPendingValidation = umkm.tahap?.some(
                        (stage) => stage.status === 'MENUNGGU_VALIDASI'
                      );

                      return (
                        <TableRow
                          key={umkm.id}
                          className={
                            hasPendingValidation
                              ? 'bg-yellow-50 dark:bg-yellow-950'
                              : ''
                          }
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">
                            {umkm.nama}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{umkm.kategori}</Badge>
                          </TableCell>
                          {[1, 2, 3, 4].map((tahap) => {
                            const stage = umkm.tahap?.find(
                              (t) => t.tahap === tahap
                            );
                            const status = stage?.status || 'BELUM_DIMULAI';

                            return (
                              <TableCell key={tahap} className="text-center">
                                {status === 'SELESAI' ? (
                                  <CheckCircle className="mx-auto h-5 w-5 text-green-600" />
                                ) : status === 'MENUNGGU_VALIDASI' ? (
                                  <Clock className="mx-auto h-5 w-5 text-yellow-600" />
                                ) : status === 'SEDANG_PROSES' ? (
                                  <div className="mx-auto h-5 w-5 rounded-full border-2 border-blue-500" />
                                ) : (
                                  <div className="mx-auto h-5 w-5 rounded-full border-2 border-gray-300" />
                                )}
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-center">
                            <Button asChild size="sm">
                              <Link href={`/admin/umkm/${umkm.id}`}>
                                Detail
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
