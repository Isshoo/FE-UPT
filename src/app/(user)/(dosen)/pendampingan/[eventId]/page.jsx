'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { assessmentAPI, marketplaceAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils/date';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ChevronLeft, Check, Info, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PendampinganDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId;

  const [event, setEvent] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventResponse, businessesResponse] = await Promise.all([
        marketplaceAPI.getEventById(eventId),
        assessmentAPI.getMentoredBusinesses(eventId),
      ]);

      setEvent(eventResponse.data);
      setBusinesses(businessesResponse.data);
    } catch (error) {
      toast.error('Gagal memuat data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedBusiness) return;

    try {
      setApproving(true);
      await assessmentAPI.approveMentoredBusiness(selectedBusiness.id);
      toast.success('Usaha mahasiswa berhasil disetujui');
      setSelectedBusiness(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyetujui usaha');
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#fba635]"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <p className="mb-4 text-gray-500">Event tidak ditemukan</p>
        <Button onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-4 py-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push('/pendampingan')}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>

        <div>
          <h1 className="mb-2 text-3xl font-bold">{event.nama}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola persetujuan usaha mahasiswa bimbingan Anda
          </p>
        </div>
      </div>

      {/* Event Info */}
      <Card className="pt-5 pb-6">
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tanggal Pelaksanaan
              </p>
              <p className="font-semibold">
                {formatDate(event.tanggalPelaksanaan)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Usaha Bimbingan
              </p>
              <p className="font-semibold">{businesses.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Menunggu Persetujuan
              </p>
              <p className="font-semibold text-yellow-600">
                {businesses.filter((b) => !b.disetujui).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Businesses Table */}
      <Card className="gap-3">
        <CardHeader>
          <CardTitle>Daftar Usaha Mahasiswa ({businesses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {businesses.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">
                Belum ada usaha mahasiswa yang memilih Anda sebagai pembimbing
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Ketua</TableHead>
                    <TableHead>Jumlah Anggota</TableHead>
                    <TableHead>Prodi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businesses.map((business, index) => (
                    <TableRow key={business.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {business.namaProduk}
                      </TableCell>
                      <TableCell>{business.kategori}</TableCell>
                      <TableCell>
                        {business.anggota?.find(
                          (a) => a.nim === business.ketuaId
                        )?.nama || '-'}
                      </TableCell>
                      <TableCell>{business.anggota?.length || 0}</TableCell>
                      <TableCell>{business.prodi}</TableCell>
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
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedBusiness(business)}
                          >
                            <Info className="mr-1 h-3 w-3" />
                            Detail
                          </Button>
                          {!business.disetujui && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedBusiness(business);
                              }}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="mr-1 h-3 w-3" />
                              Setujui
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
              Informasi lengkap usaha yang akan mengikuti event
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
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Deskripsi
                  </p>
                  <p className="text-sm">{selectedBusiness.deskripsi}</p>
                </div>
              </div>

              {/* Team Members */}
              <div className="space-y-2">
                <h3 className="font-semibold">Anggota Kelompok</h3>
                <div className="space-y-2">
                  {selectedBusiness.anggota?.map((anggota, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded border p-3"
                    >
                      <div>
                        <p className="font-medium">{anggota.nama}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          NIM: {anggota.nim}
                        </p>
                      </div>
                      {anggota.nim === selectedBusiness.ketuaId && (
                        <Badge>Ketua</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic Info */}
              <div className="space-y-2">
                <h3 className="font-semibold">Informasi Akademik</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Fakultas</p>
                    <p className="font-semibold">{selectedBusiness.fakultas}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Program Studi
                    </p>
                    <p className="font-semibold">{selectedBusiness.prodi}</p>
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
            {selectedBusiness && !selectedBusiness.disetujui && (
              <Button
                onClick={handleApprove}
                disabled={approving}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="mr-2 h-4 w-4" />
                {approving ? 'Memproses...' : 'Setujui Usaha'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
