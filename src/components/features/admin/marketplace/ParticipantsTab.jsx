'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Check,
  X,
  Edit2,
  Search,
  Users,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  User,
  Store,
  Filter,
} from 'lucide-react';
import { BUSINESS_TYPE_LABELS } from '@/lib/constants/labels';
import { marketplaceAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ParticipantsTab({ event, onRefresh, isLocked }) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingBooth, setEditingBooth] = useState(null);
  const [boothNumber, setBoothNumber] = useState('');

  const businesses = event.usaha || [];

  // Stats
  const stats = useMemo(() => {
    const approved = businesses.filter((b) => b.disetujui);
    const pending = businesses.filter((b) => !b.disetujui);
    const withBooth = businesses.filter((b) => b.nomorBooth);

    return {
      total: businesses.length,
      approved: approved.length,
      pending: pending.length,
      withBooth: withBooth.length,
    };
  }, [businesses]);

  // Filtered businesses
  const filteredBusinesses = useMemo(() => {
    let result = businesses;

    // Apply status filter
    if (filter === 'approved') {
      result = result.filter((b) => b.disetujui);
    } else if (filter === 'pending') {
      result = result.filter((b) => !b.disetujui);
    } else if (filter === 'withBooth') {
      result = result.filter((b) => b.nomorBooth);
    } else if (filter === 'noBooth') {
      result = result.filter((b) => b.disetujui && !b.nomorBooth);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.namaProduk?.toLowerCase().includes(query) ||
          b.kategori?.toLowerCase().includes(query) ||
          b.pemilik?.nama?.toLowerCase().includes(query) ||
          b.namaPemilik?.toLowerCase().includes(query) ||
          b.nomorBooth?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [businesses, filter, searchQuery]);

  const handleApproveBusiness = async (businessId) => {
    try {
      await marketplaceAPI.approveBusiness(businessId);
      toast.success('Peserta berhasil disetujui');
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyetujui peserta');
    }
  };

  const handleAssignBooth = async (businessId) => {
    if (!boothNumber.trim()) {
      toast.error('Nomor booth harus diisi');
      return;
    }

    try {
      await marketplaceAPI.assignBoothNumber(businessId, boothNumber);
      toast.success('Nomor booth berhasil ditetapkan');
      setEditingBooth(null);
      setBoothNumber('');
      onRefresh();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Gagal menetapkan nomor booth'
      );
    }
  };

  const startEditBooth = (business) => {
    setEditingBooth(business.id);
    setBoothNumber(business.nomorBooth || '');
  };

  const cancelEditBooth = () => {
    setEditingBooth(null);
    setBoothNumber('');
  };

  // Stats cards configuration
  const statsCards = [
    {
      label: 'Total Peserta',
      value: stats.total,
      icon: Users,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
      filterValue: 'all',
    },
    {
      label: 'Disetujui',
      value: stats.approved,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30',
      filterValue: 'approved',
    },
    {
      label: 'Menunggu',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
      filterValue: 'pending',
    },
    {
      label: 'Ada Booth',
      value: stats.withBooth,
      icon: MapPin,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
      filterValue: 'withBooth',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {statsCards.map((stat, index) => (
          <button
            key={index}
            onClick={() => setFilter(stat.filterValue)}
            className={`rounded-xl border p-4 text-left transition-all hover:shadow-md ${
              filter === stat.filterValue
                ? 'border-[#fba635] bg-[#fba635]/5 ring-1 ring-[#fba635]'
                : 'border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900'
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.label}
              </span>
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </span>
          </button>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <Card className="overflow-hidden rounded-2xl border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari nama produk, pemilik, atau booth..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua ({stats.total})</SelectItem>
                    <SelectItem value="approved">
                      Disetujui ({stats.approved})
                    </SelectItem>
                    <SelectItem value="pending">
                      Menunggu ({stats.pending})
                    </SelectItem>
                    <SelectItem value="withBooth">
                      Ada Booth ({stats.withBooth})
                    </SelectItem>
                    <SelectItem value="noBooth">
                      Belum Ada Booth ({stats.approved - stats.withBooth})
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {!isLocked && stats.pending > 0 && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
              <Clock className="h-4 w-4" />
              <span>
                <strong>{stats.pending} peserta</strong> menunggu persetujuan
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Participants Table */}
      <Card className="overflow-hidden rounded-2xl border-0 pt-0 shadow-md">
        <CardHeader className="border-b bg-gray-50/50 pt-3 dark:bg-gray-900/50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-[#fba635]" />
              Daftar Peserta
            </CardTitle>
            <Badge variant="secondary">
              {filteredBusinesses.length} dari {stats.total}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-4">
          {filteredBusinesses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <p className="mb-2 font-medium text-gray-900 dark:text-white">
                Tidak ada peserta ditemukan
              </p>
              <p className="text-sm text-gray-500">
                {searchQuery
                  ? 'Coba ubah kata kunci pencarian'
                  : 'Belum ada peserta yang mendaftar'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80 dark:bg-gray-900/50">
                    <TableHead className="w-12 text-center font-semibold">
                      No
                    </TableHead>
                    <TableHead className="font-semibold">Produk</TableHead>
                    <TableHead className="font-semibold">Kategori</TableHead>
                    <TableHead className="font-semibold">Tipe</TableHead>
                    <TableHead className="font-semibold">
                      Pemilik/Ketua
                    </TableHead>
                    <TableHead className="font-semibold">Kontak</TableHead>
                    <TableHead className="text-center font-semibold">
                      Status
                    </TableHead>
                    <TableHead className="text-center font-semibold">
                      Booth
                    </TableHead>
                    {!isLocked && (
                      <TableHead className="text-center font-semibold">
                        Aksi
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBusinesses.map((business, index) => (
                    <TableRow
                      key={business.id}
                      className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50 ${
                        !business.disetujui
                          ? 'bg-yellow-50/30 dark:bg-yellow-900/10'
                          : ''
                      }`}
                    >
                      <TableCell className="text-center font-medium text-gray-500">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#fba635]/20 to-[#174c4e]/20">
                            <Store className="h-5 w-5 text-[#174c4e]" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {business.namaProduk}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600 dark:text-gray-400">
                          {business.kategori}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-gray-200 bg-gray-50 font-normal dark:border-gray-700 dark:bg-gray-800"
                        >
                          {BUSINESS_TYPE_LABELS[business.tipeUsaha]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {business.tipeUsaha === 'MAHASISWA'
                              ? business.pemilik?.nama
                              : business.namaPemilik}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {business.telepon}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {business.disetujui ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Disetujui
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400">
                            <Clock className="mr-1 h-3 w-3" />
                            Menunggu
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {editingBooth === business.id ? (
                          <div className="flex items-center justify-center gap-1">
                            <Input
                              value={boothNumber}
                              onChange={(e) => setBoothNumber(e.target.value)}
                              placeholder="A1"
                              className="h-8 w-16 text-center text-sm"
                              autoFocus
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => handleAssignBooth(business.id)}
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={cancelEditBooth}
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        ) : business.nomorBooth ? (
                          <div className="flex items-center justify-center gap-2">
                            <Badge className="bg-[#174c4e] text-white hover:bg-[#174c4e]">
                              <MapPin className="mr-1 h-3 w-3" />
                              {business.nomorBooth}
                            </Badge>
                            {!isLocked && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() => startEditBooth(business)}
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </TableCell>
                      {!isLocked && (
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            {!business.disetujui && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleApproveBusiness(business.id)
                                }
                                className="h-8 bg-green-600 px-3 text-xs hover:bg-green-700"
                              >
                                <Check className="mr-1 h-3 w-3" />
                                Setujui
                              </Button>
                            )}
                            {business.disetujui && !business.nomorBooth && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEditBooth(business)}
                                className="h-8 px-3 text-xs"
                              >
                                <MapPin className="mr-1 h-3 w-3" />
                                Set Booth
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
