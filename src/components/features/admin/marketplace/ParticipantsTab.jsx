'use client';

import { useState } from 'react';
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
import { Check, X, Edit2 } from 'lucide-react';
import { BUSINESS_TYPE_LABELS } from '@/lib/constants';
import { marketplaceAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ParticipantsTab({ event, onRefresh, isLocked }) {
  const [filter, setFilter] = useState('all');
  const [editingBooth, setEditingBooth] = useState(null);
  const [boothNumber, setBoothNumber] = useState('');

  const businesses = event.usaha || [];
  const filteredBusinesses =
    filter === 'all'
      ? businesses
      : filter === 'approved'
        ? businesses.filter((b) => b.disetujui)
        : businesses.filter((b) => !b.disetujui);

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

  return (
    <div className="space-y-6">
      {/* Filter */}
      <Card className="gap-3">
        <CardContent className="pt-0">
          <div className="flex items-center gap-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua ({businesses.length})</SelectItem>
                <SelectItem value="approved">
                  Disetujui ({businesses.filter((b) => b.disetujui).length})
                </SelectItem>
                <SelectItem value="pending">
                  Menunggu ({businesses.filter((b) => !b.disetujui).length})
                </SelectItem>
              </SelectContent>
            </Select>

            {!isLocked && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                💡 Tip: Setujui peserta dan tetapkan nomor booth sebelum
                mengunci event
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Participants Table */}
      <Card className="gap-3">
        <CardHeader>
          <CardTitle>Daftar Peserta ({filteredBusinesses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBusinesses.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">Belum ada peserta</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Pemilik/Ketua</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Nomor Booth</TableHead>
                    {!isLocked && <TableHead>Aksi</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBusinesses.map((business, index) => (
                    <TableRow key={business.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {business.namaProduk}
                      </TableCell>
                      <TableCell>{business.kategori}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {BUSINESS_TYPE_LABELS[business.tipeUsaha]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {business.tipeUsaha === 'MAHASISWA'
                          ? business.pemilik?.nama
                          : business.namaPemilik}
                      </TableCell>
                      <TableCell>{business.telepon}</TableCell>
                      <TableCell>
                        {business.disetujui ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            <Check className="mr-1 h-3 w-3" />
                            Disetujui
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                            Menunggu
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingBooth === business.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={boothNumber}
                              onChange={(e) => setBoothNumber(e.target.value)}
                              placeholder="e.g., A1"
                              className="w-20"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleAssignBooth(business.id)}
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={cancelEditBooth}
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        ) : business.nomorBooth ? (
                          <div className="flex items-center gap-2">
                            <Badge>{business.nomorBooth}</Badge>
                            {!isLocked && (
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => startEditBooth(business)}
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      {!isLocked && (
                        <TableCell>
                          <div className="flex gap-2">
                            {!business.disetujui &&
                              business.tipeUsaha === 'UMKM_LUAR' && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleApproveBusiness(business.id)
                                  }
                                  className="bg-green-600 hover:bg-green-700"
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
                              >
                                <Edit2 className="mr-1 h-3 w-3" />
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
