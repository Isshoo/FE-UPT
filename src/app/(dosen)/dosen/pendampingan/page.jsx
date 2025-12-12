'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Users,
  Search,
  X,
  Check,
  Info,
  XCircle,
  Ban,
  Clock,
} from 'lucide-react';
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
    status: 'ALL',
  });
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  // Dialog states
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [approving, setApproving] = useState(false);

  // Reject Dialog State
  const [rejectingBusiness, setRejectingBusiness] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(false);

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

  // Handlers
  const handleApprove = async (businessId) => {
    try {
      setApproving(true);
      await assessmentAPI.approveMentoredBusiness(businessId);
      toast.success('Usaha mahasiswa berhasil disetujui');
      if (selectedBusiness?.id === businessId) {
        setSelectedBusiness(null);
      }
      fetchMentoredBusinesses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyetujui usaha');
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectingBusiness) return;

    try {
      setRejecting(true);
      await assessmentAPI.rejectMentoredBusiness(
        rejectingBusiness.id,
        rejectReason
      );
      toast.success('Usaha mahasiswa berhasil ditolak');
      setRejectingBusiness(null);
      setRejectReason('');
      if (selectedBusiness?.id === rejectingBusiness.id) {
        setSelectedBusiness(null);
      }
      fetchMentoredBusinesses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menolak usaha');
    } finally {
      setRejecting(false);
    }
  };

  // Helper to render status badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'DISETUJUI':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <Check className="mr-1 h-3 w-3" />
            Disetujui
          </Badge>
        );
      case 'DITOLAK':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            <XCircle className="mr-1 h-3 w-3" />
            Ditolak
          </Badge>
        );
      case 'DIBATALKAN':
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            <Ban className="mr-1 h-3 w-3" />
            Dibatalkan
          </Badge>
        );
      case 'PENDING':
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <Clock className="mr-1 h-3 w-3" />
            Menunggu
          </Badge>
        );
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
        filters.status === 'ALL' || item.status === filters.status;

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
                  <SelectItem value="PENDING">Menunggu</SelectItem>
                  <SelectItem value="DISETUJUI">Disetujui</SelectItem>
                  <SelectItem value="DITOLAK">Ditolak</SelectItem>
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
                            {business.kategori}
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
                              {business.prodi?.nama || '-'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {renderStatusBadge(business.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedBusiness(business)}
                              className="h-8 px-3 text-xs"
                            >
                              <Info className="mr-1 h-3 w-3" />
                              Detail
                            </Button>
                            {/* {business.status === 'PENDING' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(business.id)}
                                  disabled={approving}
                                  className="h-8 bg-green-600 px-3 text-xs hover:bg-green-700"
                                >
                                  <Check className="mr-1 h-3 w-3" />
                                  Setujui
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setRejectingBusiness(business)}
                                  className="h-8 px-3 text-xs"
                                >
                                  <X className="mr-1 h-3 w-3" />
                                  Tolak
                                </Button>
                              </>
                            )} */}
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

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedBusiness}
        onOpenChange={() => setSelectedBusiness(null)}
      >
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Usaha Mahasiswa</DialogTitle>
            <DialogDescription>
              Informasi lengkap usaha yang didampingi
            </DialogDescription>
          </DialogHeader>

          {selectedBusiness && (
            <div className="space-y-6">
              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="font-semibold">Informasi Produk</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Nama Produk
                    </p>
                    <p className="font-semibold">
                      {selectedBusiness.namaProduk}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Kategori</p>
                    <p className="font-semibold">{selectedBusiness.kategori}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600 dark:text-gray-400">
                      Deskripsi
                    </p>
                    <p className="font-semibold">
                      {selectedBusiness.deskripsi}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Status</p>
                    {renderStatusBadge(selectedBusiness.status)}
                  </div>
                  {selectedBusiness.status === 'DITOLAK' &&
                    selectedBusiness.alasanPenolakan && (
                      <div className="col-span-2">
                        <p className="text-gray-600 dark:text-gray-400">
                          Alasan Penolakan
                        </p>
                        <p className="font-semibold text-red-600">
                          {selectedBusiness.alasanPenolakan}
                        </p>
                      </div>
                    )}
                </div>
              </div>

              {/* Event Info */}
              <div className="space-y-2">
                <h3 className="font-semibold">Informasi Event</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Nama Event
                    </p>
                    <p className="font-semibold">
                      {selectedBusiness.event.nama}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Tahun Ajaran
                    </p>
                    <p className="font-semibold">
                      {selectedBusiness.event.tahunAjaran}
                    </p>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              {selectedBusiness.anggota?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Anggota Tim</h3>
                  <div className="space-y-1">
                    {selectedBusiness.anggota.map((anggota, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="font-medium">{anggota.nama}</span>
                        <span className="text-gray-500">({anggota.nim})</span>
                        {anggota.nim === selectedBusiness.ketuaId && (
                          <Badge variant="outline" className="text-xs">
                            Ketua
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Academic Info */}
              <div className="space-y-2">
                <h3 className="font-semibold">Informasi Akademik</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Fakultas</p>
                    <p className="font-semibold">
                      {selectedBusiness.fakultas?.nama || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Program Studi
                    </p>
                    <p className="font-semibold">
                      {selectedBusiness.prodi?.nama || '-'}
                    </p>
                  </div>
                  {selectedBusiness.mataKuliah && (
                    <div className="col-span-2">
                      <p className="text-gray-600 dark:text-gray-400">
                        Mata Kuliah
                      </p>
                      <p className="font-semibold">
                        {selectedBusiness.mataKuliah}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <h3 className="font-semibold">Kontak</h3>
                <div className="text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    Nomor Telepon
                  </p>
                  <p className="font-semibold">{selectedBusiness.telepon}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedBusiness(null)}>
              <X className="mr-2 h-4 w-4" />
              Tutup
            </Button>
            {selectedBusiness && selectedBusiness.status === 'PENDING' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setRejectingBusiness(selectedBusiness);
                    setSelectedBusiness(null);
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Tolak
                </Button>
                <Button
                  onClick={() => handleApprove(selectedBusiness.id)}
                  disabled={approving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  {approving ? 'Memproses...' : 'Setujui Usaha'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={!!rejectingBusiness}
        onOpenChange={() => {
          setRejectingBusiness(null);
          setRejectReason('');
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tolak Pendaftaran Mahasiswa</DialogTitle>
            <DialogDescription>
              Masukkan alasan penolakan. Alasan akan dikirimkan ke mahasiswa
              melalui notifikasi.
            </DialogDescription>
          </DialogHeader>

          {rejectingBusiness && (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Usaha
                </p>
                <p className="font-semibold">{rejectingBusiness.namaProduk}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {rejectingBusiness.pemilik?.nama || 'Pemilik tidak diketahui'}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Alasan Penolakan (Opsional)
                </label>
                <Textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Masukkan alasan penolakan..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectingBusiness(null);
                setRejectReason('');
              }}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejecting}
            >
              {rejecting ? 'Memproses...' : 'Tolak Pendaftaran'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
